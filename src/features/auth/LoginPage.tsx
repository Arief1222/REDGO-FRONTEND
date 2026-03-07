// features/auth/LoginPage.tsx
import { useState } from "react"
import Logo from "@/shared/components/layouts/full/shared/logo/Logo"
import { Link } from "react-router"
import AuthLogin from "./components/forms/AuthLogin"
import SocialButtons from "./components/forms/SocialButtons"
import LeftSidebarPart from "./components/LeftSidebarPart"
import { ROUTES } from "@/app/constants/router"
import LandingPage from "./LandingPage"

// ─── Login View ───────────────────────────────────────────────────────────────
const LoginView = ({ onBack }: { onBack: () => void }) => (
  <div className="relative overflow-hidden h-screen">
    <div className="grid grid-cols-12 gap-0 h-screen bg-white dark:bg-darkgray">

      {/* Left: Form */}
      <div className="xl:col-span-5 lg:col-span-6 col-span-12 sm:px-12 px-4 bg-white dark:bg-darkgray">
        <div className="flex h-screen items-center px-3 lg:justify-start justify-center">
          <div className="max-w-md w-full mx-auto">

            {/* Back button */}
            <button onClick={onBack} style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "none", border: "none", cursor: "pointer",
              color: "#888", fontSize: "13px", marginBottom: "32px", padding: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Kembali ke beranda
            </button>

            {/* Brand */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "36px" }}>
              <div style={{
                width: "32px", height: "32px", background: "#e53e3e", borderRadius: "8px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Logo />
              </div>
              <span style={{ fontWeight: 800, fontSize: "18px", letterSpacing: "-0.3px", color: "#111" }}>
                RedGo <span style={{ color: "#e53e3e" }}>AI</span>
              </span>
            </div>

            <h3 style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "-0.7px", lineHeight: 1.2, marginBottom: "6px", color: "#111" }}>
              Selamat Datang 👋
            </h3>
            <p style={{ fontSize: "14px", color: "#888", fontWeight: 400, marginBottom: "28px", lineHeight: 1.6 }}>
              Masuk ke akun Anda dan lanjutkan diskusi bisnis bersama Ready.
            </p>

            <SocialButtons title="atau masuk dengan" />

            <style>{`
              .redgo-login-wrap .btn-primary,
              .redgo-login-wrap button[type="submit"],
              .redgo-login-wrap .MuiButton-containedPrimary {
                background: #e53e3e !important;
                border-color: #e53e3e !important;
                border-radius: 10px !important;
                font-weight: 700 !important;
              }
              .redgo-login-wrap .MuiButton-containedPrimary:hover { background: #c53030 !important; }
              .redgo-login-wrap input:focus {
                border-color: #e53e3e !important;
                box-shadow: 0 0 0 3px rgba(229,62,62,0.12) !important;
              }
              .redgo-login-wrap a { color: #e53e3e !important; }
            `}</style>

            <div className="redgo-login-wrap">
              <AuthLogin />
            </div>

            <div style={{
              display: "flex", gap: "6px", fontSize: "14px", fontWeight: 500,
              marginTop: "24px", alignItems: "center", justifyContent: "center", color: "#555",
            }}>
              <p>Belum punya akun?</p>
              <Link to={ROUTES.AUTH.REGISTER_1} style={{ color: "#e53e3e", fontWeight: 700, fontSize: "14px" }}>
                Daftar sekarang
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Right: Red panel */}
      <div
        className="xl:col-span-7 lg:col-span-6 col-span-12 lg:block hidden relative overflow-hidden"
        style={{ background: "#e53e3e" }}
      >
        <LeftSidebarPart />
      </div>

    </div>
  </div>
);

// ─── Main Export ──────────────────────────────────────────────────────────────
const LoginPage = () => {
  const [view, setView] = useState<"landing" | "login">("landing");

  return view === "landing"
    ? <LandingPage onGoToLogin={() => setView("login")} />
    : <LoginView onBack={() => setView("landing")} />;
};

export default LoginPage;