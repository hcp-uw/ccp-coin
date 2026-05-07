"use client";

import { Suspense, useState, useEffect, useRef, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { supabase } from "@/lib/supabase";

type View =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "form"; ready: true }
  | { kind: "success" };

function ResetPasswordFallback() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen items-center justify-center bg-obsidian p-4">
        <div className="w-full max-w-md border-[4px] border-primary bg-obsidian p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,240,255,0.4)]">
          <p className="font-arcade text-[12px] text-primary animate-pulse">
            VERIFYING RESET LINK...
          </p>
        </div>
      </div>
    </MotionConfig>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [view, setView] = useState<View>({ kind: "loading" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const passwordValid =
    password.length >= 8 && password === confirmPassword && confirmPassword.length > 0;

  useEffect(() => {
    let cancelled = false;

    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    const showExpiredLink = (message = "Invalid or expired password reset link. Please request a new one.") => {
      if (!cancelled) {
        setView({ kind: "error", message });
      }
    };

    const showForm = () => {
      if (!cancelled) {
        setView({ kind: "form", ready: true });
      }
    };

    const formatError = (message: string) =>
      message === "Token has expired or is invalid"
        ? "This reset link has expired. Please request a new one."
        : message;

    const hashParams =
      typeof window === "undefined"
        ? new URLSearchParams()
        : new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const hashType = hashParams.get("type");
    const hashError = hashParams.get("error_description") ?? hashParams.get("error");

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" && session) {
          showForm();
        }
      }
    );

    if (hashError) {
      setView({
        kind: "error",
        message: formatError(hashError.replace(/\+/g, " ")),
      });
      return () => {
        cancelled = true;
        subscription.unsubscribe();
      };
    }

    const verifyRecoveryLink = async () => {
      if (type === "recovery" && tokenHash) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });

        if (error) {
          showExpiredLink(formatError(error.message));
          return;
        }

        showForm();
        return;
      }

      if (hashType === "recovery") {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          showForm();
          return;
        }
      }

      showExpiredLink();
    };

    verifyRecoveryLink();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateError(null);

    if (!passwordValid) {
      setUpdateError("Password must be at least 8 characters and match the confirmation.");
      return;
    }

    setUpdating(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      if (error.code === "weak_password") {
        setUpdateError("Password is too weak. Use a stronger password.");
      } else {
        setUpdateError(error.message);
      }
      setUpdating(false);
      return;
    }

    setView({ kind: "success" });
    redirectTimer.current = setTimeout(() => router.push("/dashboard"), 2500);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen items-center justify-center bg-obsidian p-4">
        <div className="w-full max-w-md border-[4px] border-primary bg-obsidian p-8 shadow-[8px_8px_0px_0px_rgba(0,240,255,0.4)]">
          {view.kind === "loading" && (
            <div className="text-center space-y-4">
              <p className="font-arcade text-[12px] text-primary animate-pulse">
                VERIFYING RESET LINK...
              </p>
            </div>
          )}

          {view.kind === "error" && (
            <div className="text-center space-y-6">
              <h2 className="font-arcade text-xl text-red-500">LINK EXPIRED</h2>
              <p className="font-mono text-sm text-muted">{view.message}</p>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="border-[2px] border-primary bg-primary/10 px-4 py-2 font-arcade text-[10px] text-primary hover:bg-primary/20 transition-colors"
              >
                BACK TO HOME
              </button>
            </div>
          )}

          {view.kind === "form" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-arcade text-xl text-primary">SET NEW PASSWORD</h2>
              </div>

              {updateError && (
                <p className="text-red-500 font-arcade text-[10px]">{updateError}</p>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <label className="block font-arcade text-[10px] uppercase text-primary">
                  New Password
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-3 w-full border-[2px] border-primary bg-obsidian px-4 py-3 font-mono text-sm text-text"
                    placeholder="••••••••"
                    autoFocus
                  />
                </label>

                <label className="block font-arcade text-[10px] uppercase text-primary">
                  Confirm Password
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-3 w-full border-[2px] border-primary bg-obsidian px-4 py-3 font-mono text-sm text-text"
                    placeholder="••••••••"
                  />
                </label>

                {password.length > 0 && confirmPassword.length > 0 && (
                  <p
                    className={`font-arcade text-[8px] ${
                      password.length >= 8 ? "text-xp" : "text-red-500"
                    }`}
                  >
                    {password.length < 8
                      ? "• Minimum 8 characters"
                      : password !== confirmPassword
                        ? "• Passwords do not match"
                        : "• Password valid"}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!passwordValid || updating}
                  className="w-full border-[2px] border-xp bg-xp px-4 py-4 font-arcade text-sm text-obsidian disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? "UPDATING..." : "RESET PASSWORD"}
                </button>
              </form>
            </div>
          )}

          {view.kind === "success" && (
            <div className="text-center space-y-4">
              <p className="font-arcade text-[14px] text-xp">PASSWORD UPDATED</p>
              <p className="font-mono text-sm text-text">Redirecting to dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </MotionConfig>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
