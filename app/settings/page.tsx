"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged, reauthenticateWithCredential,
  EmailAuthProvider, updatePassword, deleteUser, updateProfile,
} from "firebase/auth";
import {
  doc, getDoc, updateDoc, deleteDoc, setDoc,
  collection, query, where, getDocs, serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import AppNav from "@/app/components/AppNav";
import { usePlan } from "@/app/lib/usePlan";

export default function SettingsPage() {
  const router = useRouter();
  const { plan, isTrialing } = usePlan();

  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteMsg, setDeleteMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [trialEnd, setTrialEnd] = useState<string | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);

  const [companyMsg, setCompanyMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [companyLoading, setCompanyLoading] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notifLoading, setNotifLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUserId(u.uid);
      setUserEmail(u.email || "");
      const userSnap = await getDoc(doc(db, "users", u.uid));
      if (userSnap.exists()) {
        const d = userSnap.data();
        setUserName(d.name || u.displayName || "");
        setCompanyName(d.companyName || "");
        setStripeCustomerId(d.stripeCustomerId || null);
        setTrialEnd(d.trialEnd || null);
        setEmailNotifications(d.emailNotifications !== false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const trialDaysLeft = (() => {
    if (!trialEnd) return 0;
    const diff = new Date(trialEnd).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  })();

  const planColors: Record<string, string> = {
    free: "bg-[#2e2e2e] text-gray-400",
    basic: "bg-blue-900/40 text-blue-300",
    pro: "bg-purple-900/40 text-purple-300",
    premium: "bg-amber-900/40 text-amber-300",
  };

  const handleChangePassword = async () => {
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) { setPasswordMsg({ type: "err", text: "Passwords do not match." }); return; }
    if (newPassword.length < 6) { setPasswordMsg({ type: "err", text: "Minimum 6 characters." }); return; }
    if (!auth.currentUser?.email) return;
    setPasswordLoading(true);
    try {
      const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await updatePassword(auth.currentUser, newPassword);
      setPasswordMsg({ type: "ok", text: "Password changed successfully." });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch {
      setPasswordMsg({ type: "err", text: "Current password is incorrect." });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser?.email || !userId) return;
    setDeleteLoading(true);
    setDeleteMsg(null);
    try {
      const cred = EmailAuthProvider.credential(auth.currentUser.email, deletePassword);
      await reauthenticateWithCredential(auth.currentUser, cred);
      for (const col of ["items", "users"]) {
        const q = query(collection(db, col), where("userId", "==", userId));
        const snap = await getDocs(q);
        for (const d of snap.docs) await deleteDoc(d.ref);
      }
      await deleteDoc(doc(db, "users", userId));
      await deleteUser(auth.currentUser);
      router.push("/login");
    } catch {
      setDeleteMsg({ type: "err", text: "Incorrect password or error occurred." });
      setDeleteLoading(false);
    }
  };

  const handleSaveCompany = async () => {
    if (!userId || !auth.currentUser) return;
    setCompanyLoading(true);
    setCompanyMsg(null);
    try {
      await Promise.all([
        setDoc(doc(db, "users", userId), { name: userName, companyName, updatedAt: serverTimestamp() }, { merge: true }),
        updateProfile(auth.currentUser, { displayName: userName }),
      ]);
      setCompanyMsg({ type: "ok", text: "Settings saved." });
    } catch {
      setCompanyMsg({ type: "err", text: "Error saving settings." });
    } finally {
      setCompanyLoading(false);
    }
  };

  const handleBillingPortal = async () => {
    if (!stripeCustomerId) return;
    setBillingLoading(true);
    try {
      const res = await fetch("/api/billing-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeCustomerId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setBillingLoading(false);
    }
  };

  const handleToggleNotifications = async (val: boolean) => {
    if (!userId) return;
    setNotifLoading(true);
    setEmailNotifications(val);
    try {
      await updateDoc(doc(db, "users", userId), { emailNotifications: val });
    } finally {
      setNotifLoading(false);
    }
  };

  const inp = "w-full bg-[#0d0d0d] border border-[#2e2e2e] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623] transition";
  const lbl = "block text-xs text-gray-400 mb-1";
  const btnPrimary = "bg-[#f5a623] hover:bg-[#e8951a] text-black text-sm font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-50";
  const btnSecondary = "bg-[#4e9eff] hover:bg-[#3a8aee] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-50";
  const btnDanger = "bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-50";

  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6 space-y-4">
      <h2 className="text-white font-semibold text-base">{title}</h2>
      {children}
    </div>
  );

  const Msg = ({ msg }: { msg: { type: "ok" | "err"; text: string } | null }) =>
    msg ? <p className={`text-sm ${msg.type === "ok" ? "text-green-400" : "text-red-400"}`}>{msg.text}</p> : null;

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <AppNav active="settings" />
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        {/* Account */}
        <Card title="Account">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={lbl}>Full Name</label>
              <input className={inp} value={userName} onChange={e => setUserName(e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <label className={lbl}>Email</label>
              <p className="text-sm text-white pt-2 break-all">{userEmail || "—"}</p>
            </div>
          </div>
          <Msg msg={companyMsg} />
          <button onClick={handleSaveCompany} disabled={companyLoading} className={btnSecondary}>
            {companyLoading ? "Saving..." : "Save name"}
          </button>

          <hr className="border-[#2e2e2e]" />

          <p className="text-sm font-medium text-gray-300">Change password</p>
          <input type="password" placeholder="Current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={inp} />
          <input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inp} />
          <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inp} />
          <Msg msg={passwordMsg} />
          <button onClick={handleChangePassword} disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword} className={btnSecondary}>
            {passwordLoading ? "Saving..." : "Change password"}
          </button>

          <hr className="border-[#2e2e2e]" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Delete account</p>
              <p className="text-xs text-gray-500">This action is irreversible.</p>
            </div>
            <button onClick={() => setShowDeleteModal(true)} className={btnDanger}>Delete account</button>
          </div>
        </Card>

        {/* Subscription */}
        <Card title="Subscription">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${planColors[plan] || planColors.free}`}>
              {plan}
            </span>
            {isTrialing && (
              <span className="text-xs text-amber-400 bg-amber-900/30 px-3 py-1 rounded-full">
                Trial active — {trialDaysLeft} {trialDaysLeft === 1 ? "day" : "days"} left
              </span>
            )}
          </div>
          {stripeCustomerId ? (
            <button onClick={handleBillingPortal} disabled={billingLoading} className={btnSecondary}>
              {billingLoading ? "Redirecting..." : "Manage subscription"}
            </button>
          ) : (
            <button onClick={() => router.push("/pricing")} className={btnPrimary}>
              Choose a plan
            </button>
          )}
        </Card>

        {/* Company */}
        <Card title="Company">
          <div>
            <label className={lbl}>Company Name</label>
            <input className={inp} value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Acme Inc." />
          </div>
          <Msg msg={companyMsg} />
          <button onClick={handleSaveCompany} disabled={companyLoading} className={btnPrimary}>
            {companyLoading ? "Saving..." : "Save settings"}
          </button>
        </Card>

        {/* Preferences */}
        <Card title="Preferences">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Email notifications</p>
              <p className="text-xs text-gray-500">Monthly reports and alerts</p>
            </div>
            <button onClick={() => handleToggleNotifications(!emailNotifications)} disabled={notifLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emailNotifications ? "bg-[#f5a623]" : "bg-[#2e2e2e]"}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emailNotifications ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </Card>

      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-white font-semibold text-lg">Delete account</h3>
            <p className="text-sm text-gray-400">
              This action is <span className="text-red-400 font-medium">irreversible</span>. All your data will be permanently deleted.
            </p>
            <input type="password" placeholder="Enter your password to confirm"
              value={deletePassword} onChange={e => setDeletePassword(e.target.value)} className={inp} />
            <Msg msg={deleteMsg} />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowDeleteModal(false); setDeletePassword(""); setDeleteMsg(null); }}
                className="text-sm text-gray-400 hover:text-white px-4 py-2 transition">
                Cancel
              </button>
              <button onClick={handleDeleteAccount} disabled={deleteLoading || !deletePassword} className={btnDanger}>
                {deleteLoading ? "Deleting..." : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}