import { Link } from "react-router"
import AuthResetPassword from "./components/forms/AuthResetPassword"
import LeftSidebarPart from "./components/LeftSidebarPart"
import { ROUTES } from "@/app/constants/router"

// const ChevronLeft = ({ size = 14 }: { size?: number }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M15 18l-6-6 6-6"/>
//   </svg>
// )

// const backBtnStyle: React.CSSProperties = {
//   display: "inline-flex", alignItems: "center", gap: "5px",
//   background: "none", border: "none", cursor: "pointer",
//   color: "#9ca3af", fontSize: "12px", fontWeight: 600,
//   fontFamily: "inherit", transition: "color 0.15s", letterSpacing: "0.01em",
// }

const ResetPasswordPage = () => {
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

        .rp-left { width: 50%; }
        .rp-right { width: 50%; display: block; }
        .rp-pad { padding: 0 56px; }
        .rp-topbar { padding: 22px 44px; }
        .rp-bottom { padding: 14px 44px 22px; }

        @media (max-width: 768px) {
          .rp-left { width: 100% !important; }
          .rp-right { display: none !important; }
          .rp-pad { padding: 0 28px !important; }
          .rp-topbar { padding: 18px 24px !important; }
          .rp-bottom { padding: 12px 24px 20px !important; }
        }
        @media (max-width: 400px) {
          .rp-pad { padding: 0 20px !important; }
          .rp-topbar { padding: 16px 20px !important; }
        }

        .rp-form-wrap input,
        .rp-form-wrap .MuiInputBase-root {
          background: #f9fafb !important;
          border: 1.5px solid #f0f0f0 !important;
          border-radius: 12px !important;
          color: #111 !important;
          font-size: 14px !important;
          transition: all 0.18s !important;
        }
        .rp-form-wrap input:focus {
          background: #fff !important;
          border-color: #e53e3e !important;
          box-shadow: 0 0 0 4px rgba(229,62,62,0.07) !important;
          outline: none !important;
        }
        .rp-form-wrap label,
        .rp-form-wrap .MuiFormLabel-root {
          color: #9ca3af !important;
          font-size: 13px !important;
          font-weight: 500 !important;
        }
        .rp-form-wrap button[type="submit"],
        .rp-form-wrap .MuiButton-containedPrimary {
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
        .rp-form-wrap button[type="submit"]:hover {
          background: #c53030 !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 8px 28px rgba(229,62,62,0.38) !important;
        }
        .rp-form-wrap a { color: #e53e3e !important; font-weight: 600 !important; }
      `}</style>

      {/* ── Left: White Form Panel ── */}
      <div className="rp-left" style={{
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 20% 80%, rgba(229,62,62,0.03) 0%, transparent 60%)",
        }} />

        {/* Top bar */}
        <div className="rp-topbar" style={{
          display: "flex", alignItems: "center",
          position: "relative", zIndex: 1,
        }}>
       
        </div>

        {/* Form area */}
        <div className="rp-pad" style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{ maxWidth: "320px", width: "100%", margin: "0 auto" }}>
            <h1 style={{
              fontSize: "24px", fontWeight: 800, letterSpacing: "-0.7px",
              color: "#0f0f0f", lineHeight: 1.2, marginBottom: "6px",
            }}>
              Reset Password
            </h1>
            <p style={{ fontSize: "13px", color: "#9ca3af", fontWeight: 400, lineHeight: 1.55, marginBottom: "24px" }}>
              Buat password baru yang kuat untuk akunmu.
            </p>

            <div className="rp-form-wrap">
              <AuthResetPassword />
            </div>

            <Link
              to={`${ROUTES.AUTH.LOGIN_1}?direct=1`}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "100%", padding: "13px", fontSize: "14px", fontWeight: 600,
                borderRadius: "12px", border: "1.5px solid #e5e7eb",
                background: "#fff", color: "#374151", cursor: "pointer",
                marginTop: "10px", transition: "all 0.18s ease", textDecoration: "none",
              }}
            >
              ← Kembali ke Login
            </Link>
          </div>
        </div>

        <div className="rp-bottom" style={{ position: "relative", zIndex: 1 }} />
      </div>

      {/* ── Right: Brand Panel ── */}
      <div className="rp-right" style={{
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(145deg, #ffe5e5 0%, #ffc7c7 40%, #ffaaaa 70%, #ff8888 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 55% 35%, rgba(255,255,255,0.5) 0%, transparent 60%)",
        }} />
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: 0, width: "100px",
          background: "linear-gradient(to right, #fff 0%, rgba(255,255,255,0.6) 60%, transparent 100%)",
          zIndex: 2, pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <LeftSidebarPart />
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage