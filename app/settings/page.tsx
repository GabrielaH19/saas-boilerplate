"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  deleteUser,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/app/lib/firebase";
import AppNav from "@/app/components/AppNav";
import { useLang } from "@/app/lib/LanguageContext";
import { usePlan } from "@/app/lib/usePlan";

interface FixedCosts {
  salaries: number;
  admin: number;
  rent: number;
  software: number;
  other: number;
}

interface CalcSettings {
  thresholdPerKm: number;
  defaultFuelPrice: number;
  estimatedKmPerMonth: number;
  companyFixedCosts: FixedCosts;
  currency: string;
}

const defaultCalc = (): CalcSettings => ({
  thresholdPerKm: 1.30,
  defaultFuelPrice: 1.68,
  estimatedKmPerMonth: 9500,
  companyFixedCosts: { salaries: 0, admin: 0, rent: 0, software: 0, other: 0 },
  currency: "EUR",
});

export default function SettingsPage() {
  const router = useRouter();
  const { tr, locale, setLocale } = useLang();
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

  const [calcSettings, setCalcSettings] = useState<CalcSettings>(defaultCalc());
  const [calcSaved, setCalcSaved] = useState(false);
  const [calcLoading, setCalcLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUserId(u.uid);
      setUserEmail(u.email || "");
      const [userSnap, settingsSnap] = await Promise.all([
        getDoc(doc(db, "users", u.uid)),
        getDoc(doc(db, "settings", u.uid)),
      ]);
      if (userSnap.exists()) {
        const d = userSnap.data();
        setUserName(d.name || u.displayName || "");
        setCompanyName(d.companyName || "");
        setStripeCustomerId(d.stripeCustomerId || null);
        setTrialEnd(d.trialEnd || null);
        setEmailNotifications(d.emailNotifications !== false);
      }
      if (settingsSnap.exists()) {
        const d = settingsSnap.data() as CalcSettings;
        setCalcSettings({
          thresholdPerKm: d.thresholdPerKm ?? 1.30,
          defaultFuelPrice: d.defaultFuelPrice ?? 1.68,
          estimatedKmPerMonth: d.estimatedKmPerMonth ?? 9500,
          companyFixedCosts: {
            salaries: d.companyFixedCosts?.salaries ?? 0,
            admin: d.companyFixedCosts?.admin ?? 0,
            rent: d.companyFixedCosts?.rent ?? 0,
            software: d.companyFixedCosts?.software ?? 0,
            other: d.companyFixedCosts?.other ?? 0,
          },
          currency: d.currency ?? "EUR",
        });
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

  const totalFixed = Object.values(calcSettings.companyFixedCosts).reduce((a, b) => a + b, 0);
  const costPerKm = calcSettings.estimatedKmPerMonth > 0
    ? ((calcSettings.defaultFuelPrice * 0.32) + totalFixed / calcSettings.estimatedKmPerMonth).toFixed(2)
    : "—";

  const handleChangePassword = async () => {
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "err", text: locale === "it" ? "Le password non coincidono." : "Parolele nu coincid." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: "err", text: locale === "it" ? "Minimo 6 caratteri." : "Minim 6 caractere." });
      return;
    }
    if (!auth.currentUser?.email) return;
    setPasswordLoading(true);
    try {
      const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await updatePassword(auth.currentUser, newPassword);
      setPasswordMsg({ type: "ok", text: locale === "it" ? "Password cambiata con successo." : "Parola schimbata cu succes." });
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch {
      setPasswordMsg({ type: "err", text: locale === "it" ? "La password attuale non e corretta." : "Parola curenta este incorecta." });
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
      for (const col of ["trips", "trucks", "clients", "invoices"]) {
        const q = query(collection(db, col), where("userId", "==", userId));
        const snap = await getDocs(q);
        for (const d of snap.docs) await deleteDoc(d.ref);
      }
      await deleteDoc(doc(db, "users", userId));
      await deleteDoc(doc(db, "settings", userId));
      await deleteUser(auth.currentUser);
      router.push("/login");
    } catch {
      setDeleteMsg({ type: "err", text: locale === "it" ? "Password errata o errore." : "Parola incorecta sau eroare." });
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
      setCompanyMsg({ type: "ok", text: tr.settingsSaved });
    } catch {
      setCompanyMsg({ type: "err", text: locale === "it" ? "Errore nel salvataggio." : "Eroare la salvare." });
    } finally {
      setCompanyLoading(false);
    }
  };

  const handleSaveCalc = async () => {
    if (!userId) return;
    setCalcLoading(true);
    try {
      await setDoc(doc(db, "settings", userId), { ...calcSettings, userId, updatedAt: serverTimestamp() }, { merge: true });
      setCalcSaved(true);
      setTimeout(() => setCalcSaved(false), 2500);
    } catch {
      // silently fail
    } finally {
      setCalcLoading(false);
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
    } catch {
      // silently fail
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

  const setFixed = (key: keyof FixedCosts, val: number) => {
    setCalcSettings(s => ({ ...s, companyFixedCosts: { ...s.companyFixedCosts, [key]: val } }));
  };

  const inp = "w-full bg-[#0d0d0d] border border-[#2e2e2e] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#f5a623] transition";
  const lbl = "block text-xs text-gray-400 mb-1";
  const btnPrimary = "bg-[#f5a623] hover:bg-[#e8951a] text-black text-sm font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed";
  const btnSecondary = "bg-[#4e9eff] hover:bg-[#3a8aee] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed";
  const btnDanger = "bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition disabled:opacity-50";

  const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6 space-y-4">
      <h2 className="text-white font-semibold text-base">{title}</h2>
      {children}
    </div>
  );

  const Msg = ({ msg }: { msg: { type: "ok" | "err"; text: string } | null }) =>
    msg ? <p className={`text-sm ${msg.type === "ok" ? "text-green-400" : "text-red-400"}`}>{msg.text}</p> : null;

  const it = locale === "it";

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <p className="text-gray-400">{tr.loading}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <AppNav active="settings" />
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold">{tr.settings}</h1>

        {/* 1. Cont */}
        <Card title={it ? "Account" : "Cont"}>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <div>
    <label className={lbl}>{tr.yourName}</label>
    <input className={inp} value={userName} onChange={e => setUserName(e.target.value)}
      placeholder={it ? "Mario Rossi" : "Ion Ionescu"} />
  </div>
  <div>
    <label className={lbl}>Email</label>
    <p className="text-sm text-white pt-2 break-all">{userEmail || "—"}</p>
  </div>
</div>
          <Msg msg={companyMsg} />
          <button onClick={handleSaveCompany} disabled={companyLoading} className={btnSecondary}>
            {companyLoading ? tr.saving : (it ? "Salva nome" : "Salveaza numele")}
          </button>

          <hr className="border-[#2e2e2e]" />

          <p className="text-sm font-medium text-gray-300">
            {it ? "Cambia password" : "Schimba parola"}
          </p>
          <input type="password"
            placeholder={it ? "Password attuale" : "Parola curenta"}
            value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={inp} />
          <input type="password"
            placeholder={it ? "Nuova password" : "Parola noua"}
            value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inp} />
          <input type="password"
            placeholder={it ? "Conferma nuova password" : "Confirma parola noua"}
            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inp} />
          <Msg msg={passwordMsg} />
          <button onClick={handleChangePassword}
            disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
            className={btnSecondary}>
            {passwordLoading ? tr.saving : (it ? "Cambia password" : "Schimba parola")}
          </button>

          <hr className="border-[#2e2e2e]" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                {it ? "Elimina account" : "Sterge contul"}
              </p>
              <p className="text-xs text-gray-500">
                {it ? "Questa azione e irreversibile." : "Aceasta actiune este ireversibila."}
              </p>
            </div>
            <button onClick={() => setShowDeleteModal(true)} className={btnDanger}>
              {it ? "Elimina account" : "Sterge contul"}
            </button>
          </div>
        </Card>

        {/* 2. Abonament */}
        <Card title={it ? "Abbonamento" : "Abonament"}>
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full uppercase ${planColors[plan] || planColors.free}`}>
              {plan}
            </span>
            {isTrialing && (
              <span className="text-xs text-amber-400 bg-amber-900/30 px-3 py-1 rounded-full">
                {it ? "Trial attivo" : "Trial activ"} — {trialDaysLeft} {
                  it
                    ? (trialDaysLeft === 1 ? "giorno rimasto" : "giorni rimasti")
                    : (trialDaysLeft === 1 ? "zi ramasa" : "zile ramase")
                }
              </span>
            )}
          </div>
          {stripeCustomerId ? (
            <button onClick={handleBillingPortal} disabled={billingLoading} className={btnSecondary}>
              {billingLoading
                ? (it ? "Reindirizzamento..." : "Se redirectioneaza...")
                : (it ? "Gestisci abbonamento" : "Gestioneaza abonamentul")}
            </button>
          ) : (
            <button onClick={() => router.push("/pricing")} className={btnPrimary}>
              {it ? "Scegli un piano" : "Alege un plan"}
            </button>
          )}
        </Card>

        {/* 3. Firma */}
        <Card title={tr.companyData}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className={lbl}>{tr.companyName}</label>
              <input className={inp} value={companyName} onChange={e => setCompanyName(e.target.value)}
                placeholder={it ? "Trasporti SRL" : "Transport SRL"} />
            </div>
          </div>
          <button onClick={handleSaveCompany} disabled={companyLoading} className={btnPrimary}>
            {companyLoading ? tr.saving : tr.saveSettings}
          </button>
        </Card>

        {/* 4. Setari calcul */}
        <Card title={tr.calcSettings}>
          {calcSaved && (
            <div className="bg-green-900 border border-green-700 text-green-400 px-4 py-3 rounded-lg text-sm">
              {tr.settingsSaved}
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={lbl}>{tr.minThreshold}</label>
              <input type="number" step="0.01" className={inp}
                value={calcSettings.thresholdPerKm}
                onChange={e => setCalcSettings(s => ({ ...s, thresholdPerKm: +e.target.value }))} />
              <p className="text-xs text-gray-600 mt-1">{tr.thresholdHint}</p>
            </div>
            <div>
              <label className={lbl}>{tr.defaultFuel}</label>
              <input type="number" step="0.01" className={inp}
                value={calcSettings.defaultFuelPrice}
                onChange={e => setCalcSettings(s => ({ ...s, defaultFuelPrice: +e.target.value }))} />
              <p className="text-xs text-gray-600 mt-1">{tr.fuelHint}</p>
            </div>
            <div>
              <label className={lbl}>{tr.companyKm}</label>
              <input type="number" className={inp}
                value={calcSettings.estimatedKmPerMonth}
                onChange={e => setCalcSettings(s => ({ ...s, estimatedKmPerMonth: +e.target.value }))} />
              <p className="text-xs text-gray-600 mt-1">{tr.companyKmHint}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{tr.companyFixed}</p>
            <p className="text-xs text-gray-600 mb-3">{tr.companyFixedDesc}</p>
            <div className="grid grid-cols-2 gap-4">
              {([
                ["salaries", tr.salaries],
                ["admin", tr.admin],
                ["rent", tr.rent],
                ["software", tr.software],
                ["other", tr.other],
              ] as [keyof FixedCosts, string][]).map(([key, label]) => (
                <div key={key}>
                  <label className={lbl}>{label}</label>
                  <input type="number" className={inp}
                    value={calcSettings.companyFixedCosts[key] || ""}
                    onChange={e => setFixed(key, +e.target.value)}
                    placeholder="0" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1a1a0a] border border-[#3a3000] rounded-lg p-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">{tr.totalCompanyFixed}</div>
              <div className="text-xl font-bold text-[#f5a623]">{totalFixed.toLocaleString()} EUR</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">{tr.companyCostPerKm}</div>
              <div className="text-xl font-bold text-white">{costPerKm} EUR/km</div>
              <div className="text-xs text-gray-600 mt-0.5">{tr.includesFuel}</div>
            </div>
          </div>

          <button onClick={handleSaveCalc} disabled={calcLoading} className={`w-full ${btnPrimary}`}>
            {calcLoading ? tr.saving : tr.saveSettings}
          </button>
        </Card>

        {/* 5. Preferinte */}
        <Card title={it ? "Preferenze" : "Preferinte"}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{it ? "Lingua" : "Limba"}</p>
              <p className="text-xs text-gray-500">{it ? "Interfaccia applicazione" : "Interfata aplicatiei"}</p>
            </div>
            <div className="flex gap-2">
              {(["ro", "it"] as const).map(l => (
                <button key={l} onClick={() => setLocale(l)}
                  className={`text-sm font-medium px-4 py-1.5 rounded-lg border transition ${
                    locale === l
                      ? "border-[#f5a623] bg-[#f5a623]/10 text-[#f5a623]"
                      : "border-[#2e2e2e] text-gray-400 hover:border-gray-500"
                  }`}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-[#2e2e2e]" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{it ? "Notifiche email" : "Notificari email"}</p>
              <p className="text-xs text-gray-500">{it ? "Rapporti mensili e avvisi" : "Rapoarte lunare si alerte"}</p>
            </div>
            <button
              onClick={() => handleToggleNotifications(!emailNotifications)}
              disabled={notifLoading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                emailNotifications ? "bg-[#f5a623]" : "bg-[#2e2e2e]"
              }`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                emailNotifications ? "translate-x-6" : "translate-x-1"
              }`} />
            </button>
          </div>
        </Card>

      </div>

      {/* Modal stergere cont */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-white font-semibold text-lg">
              {it ? "Elimina account" : "Sterge contul"}
            </h3>
            <p className="text-sm text-gray-400">
              {it ? "Questa azione e " : "Aceasta actiune este "}
              <span className="text-red-400 font-medium">{it ? "irreversibile" : "ireversibila"}</span>
              {it ? ". Tutti i tuoi dati verranno eliminati definitivamente." : ". Toate datele tale vor fi sterse permanent."}
            </p>
            <input type="password"
              placeholder={it ? "Inserisci la password per confermare" : "Introdu parola pentru confirmare"}
              value={deletePassword} onChange={e => setDeletePassword(e.target.value)}
              className={inp} />
            <Msg msg={deleteMsg} />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowDeleteModal(false); setDeletePassword(""); setDeleteMsg(null); }}
                className="text-sm text-gray-400 hover:text-white px-4 py-2 transition">
                {tr.cancel}
              </button>
              <button onClick={handleDeleteAccount} disabled={deleteLoading || !deletePassword} className={btnDanger}>
                {deleteLoading ? tr.saving : (it ? "Elimina definitivamente" : "Sterge definitiv")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}