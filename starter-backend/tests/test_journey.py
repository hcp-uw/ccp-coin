"""Full end-to-end user journey tests."""

from main import _mock_users, _mock_bets
from tests.conftest import auth, mock_user, make_token


class TestFullUserJourney:
    def test_signup_login_bet_history(self, client):
        """Full journey: signup → login → prediction → place bet → history → leaderboard → logout"""
        username = "journeyuser"
        password = "journey123"

        # Step 1: Signup
        res = client.post("/user/signup", json={"username": username, "password": password, "email": "journey@example.com", "expected_grad_year": 2026})
        assert res.status_code == 200

        # Step 2: Login
        res = client.post("/auth/login", json={"username": username, "password": password})
        assert res.status_code == 200
        token = res.json()["token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Step 3: Retrieve AI prediction
        res = client.get("/prediction/today", headers=headers)
        assert res.status_code == 200
        prediction = res.json()
        assert prediction["prediction"] in ("up", "down")

        # Step 4: Place bet based on prediction
        res = client.post(
            "/user/bet",
            json={"stock": prediction["stock"], "direction": prediction["prediction"], "coins": 100},
            headers=headers,
        )
        assert res.status_code == 200
        assert res.json()["newBalance"] == 900

        # Step 5: Retrieve bet history
        res = client.get("/user/history", headers=headers)
        assert res.status_code == 200
        assert len(res.json()) == 1
        assert res.json()[0]["result"] == "pending"

        # Step 6: Check leaderboard rank via account info
        res = client.get("/user/accountInfo", headers=headers)
        assert res.status_code == 200
        assert res.json()["balance"] == 900
        assert res.json()["streak"] == 1

        # Step 7: Logout
        res = client.post("/auth/logout", headers=headers)
        assert res.status_code == 200
        assert res.json()["success"] is True

    def test_multiple_bets_reduce_balance(self, client):
        """Place 3 bets sequentially and verify balance decrements correctly."""
        username = "bettor"
        _mock_users[username] = mock_user(username, balance=1000, streak=0)
        headers = {"Authorization": f"Bearer {make_token(username)}"}

        for coins in [100, 200, 150]:
            res = client.post(
                "/user/bet",
                json={"stock": "AAPL", "direction": "up", "coins": coins},
                headers=headers,
            )
            assert res.status_code == 200

        assert _mock_users[username]["balance"] == 550
        assert len(_mock_bets) == 3

    def test_bet_fails_after_balance_depleted(self, client):
        """Verify bet is rejected when user has insufficient funds."""
        username = "broke"
        _mock_users[username] = mock_user(username, balance=10)
        headers = {"Authorization": f"Bearer {make_token(username)}"}

        res = client.post(
            "/user/bet",
            json={"stock": "AAPL", "direction": "up", "coins": 500},
            headers=headers,
        )
        assert res.status_code == 400
        assert "Insufficient balance" in res.json()["detail"]
