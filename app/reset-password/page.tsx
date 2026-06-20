"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const oobCode = searchParams.get("oobCode");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [validCode, setValidCode] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!oobCode) { setError("Invalid or expired link."); setChecking(false); return; }
    verifyPasswordResetCode(auth, oobCode)
      .then(() => { setValidCode(true); setChecking(false); })
      .catch(() => { setError("Invalid or expired link."); setChecking(false); });
  }, [oobCode]);

  const handleReset = async () => {
    setError("");
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (!oobCode) return;
    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setError("An error occurred. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full bg-[#1f1f1f] border border-[#2e2e2e] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#f5a623]";

  if (checking) return <div className="text-center text-gray-400">Verifying link...</div>;

  return (
    <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-8">
      {done ? (
        <div className="text-center">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-white font-semibold mb-2">Password reset successfully!</h3>
          <p className="text-gray-400 text-sm mb-6">You will be redirected to login in a few seconds.</p>
          <Link href="/login" className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition block text-center">
            Go to login
          </Link>
        </div>
      ) : !validCode ? (
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <Link href="/forgot-password" className="text-[#f5a623] hover:underline text-sm">
            Request a new link
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">Enter your new password.</p>
          <input type="password" placeholder="New password" value={newPassword}
            onChange={e => setNewPassword(e.target.value)} className={inp} />
          <input type="password" placeholder="Confirm new password" value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)} className={inp} />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button onClick={handleReset} disabled={loading || !newPassword || !confirmPassword}
            className="w-full bg-[#f5a623] text-black font-semibold py-3 rounded-lg hover:bg-[#e8951a] transition disabled:opacity-50">
            {loading ? "Saving..." : "Reset password"}
          </button>
          <p className="text-center text-gray-400 text-sm">
            <Link href="/login" className="text-[#f5a623] hover:underline">Back to login</Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white">
            Your<span className="text-[#f5a623]">App</span>
          </h1>
          <p className="text-gray-400 mt-2">Reset your password</p>
        </div>
        <Suspense fallback={<div className="text-center text-gray-400">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}