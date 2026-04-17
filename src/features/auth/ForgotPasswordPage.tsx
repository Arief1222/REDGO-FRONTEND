
import { Button } from '@/shared/components/theme-ui'
import { Link } from "react-router"
import AuthForgotPassword from "./components/forms/AuthForgotPassword"
import LeftSidebarPart from "./components/LeftSidebarPart"
import { ROUTES } from "@/app/constants"

// const ChevronLeft = ({ size = 14 }: { size?: number }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M15 18l-6-6 6-6"/>
//   </svg>
// )

const ForgotPasswordPage = () => {
  return (
    <div style={{
      display: "flex",
      height: "100vh",
      width: "100%",
      fontFamily: "'Plus Jakarta Sans', 'DM Sans', 'Helvetica Neue', sans-serif",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .fp-left { width: 50%; }
        .fp-right { width: 50%; display: block; }
        .fp-pad { padding: 0 56px; }
        .fp-topbar { padding: 22px 44px; }
        .fp-bottom { padding: 14px 44px 22px; }
        @media (max-width: 768px) {
          .fp-left { width: 100% !important; }
          .fp-right { display: none !important; }
          .fp-pad { padding: 0 28px !important; }
          .fp-topbar { padding: 18px 24px !important; }
          .fp-bottom { padding: 12px 24px 20px !important; }
        }
        @media (max-width: 400px) {
          .fp-pad { padding: 0 20px !important; }
          .fp-topbar { padding: 16px 20px !important; }
        }
      `}</style>

      {/* Left */}
      <div className="fp-left" style={{ background: "#fff", display: "flex", flexDirection: "column", position: "relative" }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 20% 80%, rgba(229,62,62,0.03) 0%, transparent 60%)",
        }} />

        <div className="fp-topbar" style={{ display: "flex", alignItems: "center", position: "relative", zIndex: 1 }}>
        
        </div>

        <div className="fp-pad" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "320px", width: "100%", margin: "0 auto" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.7px", color: "#0f0f0f", marginBottom: "6px" }}>
              Lupa Password?
            </h1>
            <p style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "24px", lineHeight: 1.55 }}>
              Masukkan email yang terdaftar. Kami akan kirimkan link untuk reset password kamu.
            </p>
            <AuthForgotPassword />
            <Button as={Link} to={`${ROUTES.AUTH.LOGIN_1}?direct=1`}style={outlineBtnStyle}>
              ← Kembali ke Login
            </Button>
          </div>
        </div>

        <div className="fp-bottom" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "11px", color: "#d1d5db" }}>
            Belum punya akun?{" "}
            <Link to={ROUTES.AUTH.REGISTER_1} style={{ color: "#e53e3e", fontWeight: 700, textDecoration: "none" }}>
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="fp-right" style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, #ffe5e5 0%, #ffc7c7 40%, #ffaaaa 70%, #ff8888 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 55% 35%, rgba(255,255,255,0.5) 0%, transparent 60%)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "100px", zIndex: 2, background: "linear-gradient(to right, #fff 0%, rgba(255,255,255,0.6) 60%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <LeftSidebarPart />
        </div>
      </div>
    </div>
  )
}

// const backBtnStyle: React.CSSProperties = {
//   display: "inline-flex", alignItems: "center", gap: "5px",
//   background: "none", border: "none", cursor: "pointer",
//   color: "#9ca3af", fontSize: "12px", fontWeight: 600,
//   fontFamily: "inherit", transition: "color 0.15s",
//}
const outlineBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "center",
  width: "100%", padding: "13px", fontSize: "14px", fontWeight: 600,
  borderRadius: "12px", border: "1.5px solid #e5e7eb",
  background: "#fff", color: "#374151", cursor: "pointer",
  marginTop: "10px", transition: "all 0.18s ease", textDecoration: "none",
}
export default ForgotPasswordPage
