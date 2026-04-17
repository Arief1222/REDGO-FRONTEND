// features/auth/RegisterPage.tsx
import { useState } from "react"
import { Link } from "react-router"
import AuthRegister from "./components/forms/AuthRegister"
import LeftSidebarPart from "./components/LeftSidebarPart"
import { ROUTES } from "@/app/constants/router"


// ── Icons ─────────────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

const EmailIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

const ChevronLeft = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)

// ── Shared styles ─────────────────────────────────────────────────────────────
const googleBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center",
  gap: "10px", width: "100%", padding: "14px 20px",
  background: "#fff", border: "none",
  borderRadius: "14px", cursor: "pointer",
  fontSize: "14px", fontWeight: 600, color: "#374151",
  fontFamily: "inherit", transition: "all 0.18s ease",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06)",
}
const emailBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center",
  gap: "10px", width: "100%", padding: "14px 20px",
  background: "#e53e3e", border: "none",
  borderRadius: "14px", cursor: "pointer",
  fontSize: "14px", fontWeight: 700, color: "#fff",
  fontFamily: "inherit", transition: "all 0.18s ease",
  boxShadow: "0 4px 16px rgba(229,62,62,0.28)",
}
const backBtnStyle: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "5px",
  background: "none", border: "none", cursor: "pointer",
  color: "#9ca3af", fontSize: "12px", fontWeight: 600,
  marginBottom: "24px", padding: "6px 0",
  fontFamily: "inherit", transition: "color 0.15s",
  letterSpacing: "0.01em",
}

// ── Step 1: Choose register method ────────────────────────────────────────────
const StepChoose = ({
  onEmailClick,
  onGoogleClick,
}: {
  onEmailClick: () => void
  onGoogleClick: () => void
}) => (
  <div style={{ animation: "fadeUp 0.4s ease both" }}>
    <div style={{ marginBottom: "36px" }}>
      <h1 style={{
        fontSize: "26px", fontWeight: 800, letterSpacing: "-0.8px",
        color: "#0f0f0f", lineHeight: 1.2, marginBottom: "8px",
      }}>
        Buat akun baru
      </h1>
      <p style={{ fontSize: "14px", color: "#9ca3af", fontWeight: 400, lineHeight: 1.5 }}>
        Bergabung dengan RedGo AI dan mulai diskusi bisnis Anda.
      </p>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <button
        onClick={onGoogleClick}
        style={googleBtnStyle}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "#f9fafb"
            ; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"
            ; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "#fff"
            ; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"
            ; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"
        }}
      >
        <GoogleIcon />
        <span>Daftar dengan Google</span>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "2px 0" }}>
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #e5e7eb)" }} />
        <span style={{ color: "#d1d5db", fontSize: "11px", fontWeight: 500, letterSpacing: "0.05em" }}>ATAU</span>
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, #e5e7eb)" }} />
      </div>

      <button
        onClick={onEmailClick}
        style={emailBtnStyle}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "#c53030"
            ; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"
            ; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(229,62,62,0.38)"
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = "#e53e3e"
            ; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"
            ; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(229,62,62,0.28)"
        }}
      >
        <EmailIcon />
        <span>Daftar dengan Email</span>
      </button>
    </div>
  </div>
)

// ── Step 2: Register form ─────────────────────────────────────────────────────
const StepRegisterForm = ({ onBack }: { onBack: () => void }) => (
  <div style={{ animation: "fadeUp 0.35s ease both" }}>
    <button onClick={onBack} style={backBtnStyle}>
      <ChevronLeft />
      <span>Kembali</span>
    </button>

    <div style={{ marginBottom: "28px" }}>
      <h1 style={{
        fontSize: "24px", fontWeight: 800, letterSpacing: "-0.7px",
        color: "#0f0f0f", lineHeight: 1.2, marginBottom: "6px",
      }}>
        Daftar dengan email
      </h1>
      <p style={{ fontSize: "13px", color: "#9ca3af", fontWeight: 400 }}>
        Isi data berikut untuk membuat akun Anda.
      </p>
    </div>

    <style>{`
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .redgo-reg-wrap input,
      .redgo-reg-wrap .MuiInputBase-root {
        background: #f9fafb !important;
        border: 1.5px solid #f0f0f0 !important;
        border-radius: 12px !important;
        color: #111 !important;
        font-size: 14px !important;
        transition: all 0.18s !important;
      }
      .redgo-reg-wrap input:focus {
        background: #fff !important;
        border-color: #e53e3e !important;
        box-shadow: 0 0 0 4px rgba(229,62,62,0.07) !important;
        outline: none !important;
      }
      .redgo-reg-wrap label,
      .redgo-reg-wrap .MuiFormLabel-root {
        color: #9ca3af !important; font-size: 13px !important; font-weight: 500 !important;
      }
      .redgo-reg-wrap button[type="submit"],
      .redgo-reg-wrap .MuiButton-containedPrimary {
        background: #e53e3e !important;
        border: none !important;
        border-radius: 12px !important;
        font-weight: 700 !important;
        font-size: 14px !important;
        color: #fff !important;
        box-shadow: 0 4px 20px rgba(229,62,62,0.28) !important;
        transition: all 0.18s ease !important;
        padding: 13px !important;
        width: 100% !important;
      }
      .redgo-reg-wrap button[type="submit"]:hover {
        background: #c53030 !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 8px 28px rgba(229,62,62,0.38) !important;
      }
      .redgo-reg-wrap .MuiFormControl-root { margin-bottom: 0 !important; }
      .redgo-reg-wrap a { color: #e53e3e !important; font-weight: 600 !important; }
    `}</style>

    <div className="redgo-reg-wrap">
      <AuthRegister />
    </div>
  </div>
)

// ── Main RegisterPage ─────────────────────────────────────────────────────────
type Step = "choose" | "email"

const RegisterPage = () => {
  const [step, setStep] = useState<Step>("choose")

  return (
    <div className="register-root" style={{
      display: "flex", height: "100vh", width: "100%",
      fontFamily: "'Plus Jakarta Sans', 'DM Sans', 'Helvetica Neue', sans-serif",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Left: White Form Panel ── */}
      <div className="register-left" style={{
        width: "50%", background: "#fff",
        display: "flex", flexDirection: "column",
        position: "relative", flexShrink: 0,
      }}>
        {/* Subtle background texture */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 20% 80%, rgba(229,62,62,0.03) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        {/* Top bar */}
        <div className="register-topbar" style={{
          padding: "28px 48px",
          display: "flex", alignItems: "center",
          position: "relative", zIndex: 1,
        }}>
          <Link
            to={`${ROUTES.AUTH.LOGIN_1}`}
            style={{
              color: "#9ca3af", fontSize: "12px", fontFamily: "inherit",
              fontWeight: 600, display: "flex", alignItems: "center", gap: "5px",
              textDecoration: "none", transition: "color 0.15s",
              letterSpacing: "0.01em",
            }}
          >
            <ChevronLeft />
            Beranda
          </Link>
        </div>

        {/* Form area — centered */}
        <div
          className="register-form-area"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 140px)", // biar benar-benar tengah
            padding: "0 72px",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ maxWidth: "340px", width: "100%", margin: "0 auto" }}>
            {step === "choose" ? (
              <StepChoose
                onEmailClick={() => setStep("email")}
                onGoogleClick={() => {window.location.href = 'https://api.airedgo.com/core/v1/auth/google'}}
              />
            ) : (
              <StepRegisterForm onBack={() => setStep("choose")} />
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="register-bottom" style={{
          padding: "20px 48px 28px", textAlign: "center",
          position: "relative", zIndex: 1,
        }}>
          {step === "choose" && (
            <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "10px", fontWeight: 400 }}>
              Sudah punya akun?{" "}
              <Link
                to={`${ROUTES.AUTH.LOGIN_1}?direct=1`}
                style={{ color: "#e53e3e", fontWeight: 700, textDecoration: "none" }}
              >
                Masuk sekarang
              </Link>
            </p>
          )}
          <p style={{ fontSize: "11px", color: "#d1d5db", lineHeight: 1.7 }}>
            Dengan melanjutkan, Anda menyetujui{" "}
            <Link to={ROUTES.AUTH.TOS} style={{ color: "#9ca3af", textDecoration: "none", fontWeight: 500 }}>
              Syarat Layanan
            </Link>
            {" "}dan{" "}
            <Link to={ROUTES.AUTH.PRIVACY} style={{ color: "#9ca3af", textDecoration: "none", fontWeight: 500 }}>
              Kebijakan Privasi
            </Link>.
          </p>
        </div>
      </div>

      {/* ── Right: Brand Panel ── */}
      <div className="register-right" style={{
        width: "50%", position: "relative",
        overflow: "visible", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(145deg, #ffe5e5 0%, #ffc7c7 40%, #ffaaaa 70%, #ff8888 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 55% 35%, rgba(255,255,255,0.5) 0%, transparent 60%)",
        }} />
        {/* Left edge blend */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: "-80px", width: "160px",
          background: "linear-gradient(to right, #fff 0%, #fff8f8 35%, rgba(255,232,232,0.6) 65%, transparent 100%)",
          zIndex: 2, pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <LeftSidebarPart />
        </div>
      </div>
      <style>{`
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ===== MOBILE ===== */
@media (max-width: 900px) {

  .register-root{
    flex-direction: column !important;
    height: auto !important;
    min-height: 100vh;
  }

  .register-left{
    width: 100% !important;
    padding: 0;
  }

  .register-form-area{
    padding: 0 28px !important;
  }

  .register-topbar{
    padding: 20px 28px !important;
  }

  .register-bottom{
    padding: 20px 28px !important;
  }

  .register-right{
    display: none !important;
  }
    .register-form-area{
  padding: 0 28px !important;
  min-height: calc(100vh - 120px);
  display:flex;
  justify-content:center;
}

}
`}</style>
    </div>

  )
}

export default RegisterPage