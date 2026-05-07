import { describe, it, expect } from "vitest";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateResetEmail(email: string): string | null {
  if (!email || !EMAIL_RE.test(email)) {
    return "Please enter a valid email address.";
  }
  return null;
}

function validateNewPassword(
  password: string,
  confirm: string
): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (password !== confirm) {
    return "Passwords do not match.";
  }
  return null;
}

function getPasswordHint(
  password: string,
  confirm: string
): string | null {
  if (password.length === 0 || confirm.length === 0) return null;
  if (password.length < 8) return "Minimum 8 characters";
  if (password !== confirm) return "Passwords do not match";
  return "Password valid";
}

function formatRateLimitError(): string {
  return "Too many reset attempts. Please wait a few minutes before trying again.";
}

function formatExpiredTokenMessage(): string {
  return "This reset link has expired. Please request a new one.";
}

describe("Forgot Password — Email Validation", () => {
  it("rejects empty string", () => {
    expect(validateResetEmail("")).toBe("Please enter a valid email address.");
  });

  it("rejects missing @ sign", () => {
    expect(validateResetEmail("testuw.edu")).toBe("Please enter a valid email address.");
  });

  it("rejects missing domain", () => {
    expect(validateResetEmail("test@")).toBe("Please enter a valid email address.");
  });

  it("rejects missing TLD", () => {
    expect(validateResetEmail("test@uw")).toBe("Please enter a valid email address.");
  });

  it("accepts valid UW email", () => {
    expect(validateResetEmail("student@uw.edu")).toBeNull();
  });

  it("accepts valid email with subdomain", () => {
    expect(validateResetEmail("user@sub.uw.edu")).toBeNull();
  });
});

describe("Reset Password — Password Validation", () => {
  it("rejects password shorter than 8 chars", () => {
    expect(validateNewPassword("short", "short")).toBe(
      "Password must be at least 8 characters."
    );
  });

  it("rejects exactly 7 characters", () => {
    expect(validateNewPassword("1234567", "1234567")).toBe(
      "Password must be at least 8 characters."
    );
  });

  it("rejects mismatched passwords", () => {
    expect(validateNewPassword("securepass123", "different")).toBe(
      "Passwords do not match."
    );
  });

  it("accepts valid matching passwords", () => {
    expect(validateNewPassword("securepass123", "securepass123")).toBeNull();
  });

  it("accepts minimum length password", () => {
    expect(validateNewPassword("12345678", "12345678")).toBeNull();
  });
});

describe("Reset Password — Visual Hints", () => {
  it("shows no hint when fields are empty", () => {
    expect(getPasswordHint("", "")).toBeNull();
  });

  it("shows minimum length warning for short password", () => {
    expect(getPasswordHint("abc", "abc")).toBe("Minimum 8 characters");
  });

  it("shows mismatch when passwords differ", () => {
    expect(getPasswordHint("password123", "different123")).toBe(
      "Passwords do not match"
    );
  });

  it("shows valid when all criteria met", () => {
    expect(getPasswordHint("securepass123", "securepass123")).toBe(
      "Password valid"
    );
  });
});

describe("Error Messages", () => {
  it("formats rate limit error", () => {
    expect(formatRateLimitError()).toContain("Too many reset attempts");
  });

  it("formats expired token message", () => {
    expect(formatExpiredTokenMessage()).toContain("has expired");
    expect(formatExpiredTokenMessage()).toContain("request a new one");
  });
});
