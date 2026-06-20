"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            Your<span className="text-[#f5a623]">App</span>
          </h1>
          <p className="text-gray-400 mt-2">Reset your password</p>
        </div>

        <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="text-white font-semibold mb-2">Email sent!</h3>
              <p className="text-gray-400 text-sm mb-6">
                We sent a reset link to <span className="text-white">{email}</span>.
                Check your spam folder if you don't see it.
              </p>
              <Link href="/login" className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition block text-center">
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <p className="text-gray-400 text-sm mb-4">
                Enter your account email and we'll send you a password reset link.
              </p>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f5a623]"
                  placeholder="you@example.com"
                  required
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
              <p className="text-center text-gray-400 text-sm">
                <Link href="/login" className="text-[#f5a623] hover:underline">
                  Back to login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}