// features/auth/components/NavBar.tsx

import "../components/animations.css"
import { useState } from "react";

interface NavBarProps {
  onGoToLogin?: () => void;
}

function RedGoLogo() {
  return (
    <span
      style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 700,
        fontSize: "22px",
      }}
    >
      <span style={{ color: "#111" }}>Red</span>
      <span style={{ color: "#D93B2B" }}>Go AI</span>
    </span>
  );
}

export default function NavBar({ onGoToLogin }: NavBarProps) {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{`
/* overlay fade */
@keyframes menuFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* card slide */
@keyframes menuSlide {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.mobile-overlay {
  animation: menuFade 0.25s ease;
}

.mobile-menu-card {
  animation: menuSlide 0.28s cubic-bezier(.25,.8,.25,1);
}
      .navbar-inner{
        padding-left:61px;
        padding-right:48px;
      }

      .navbar-desktop{
        display:flex;
        gap:8px;
      }

      .navbar-hamburger{
        display:none;
      }

      /* MOBILE */

      @media (max-width:600px){

        .navbar-inner{
          padding-left:16px !important;
          padding-right:16px !important;
        }

        .navbar-desktop{
          display:none;
        }

        .navbar-hamburger{
          display:block;
          font-size:26px;
          background:none;
          border:none;
          cursor:pointer;
        }

      }

      `}</style>

      <nav
        className="anim-fade-in is-visible navbar-inner"
        style={{
          width: "100%",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f0f0f0",
          position: "sticky",
          top: 0,
          background: "rgba(253,250,247,0.95)",
          backdropFilter: "blur(8px)",
          zIndex: 100,
        }}
      >
        <RedGoLogo />

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

          {/* Desktop buttons */}
          <div className="navbar-desktop">

            <button
              onClick={onGoToLogin}
              style={{
                height: "34px",
                background: "transparent",
                border: "1.5px solid #D4B8B0",
                color: "#111",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
                padding: "0 16px"
              }}
            >
              Login
            </button>

            <button
              onClick={onGoToLogin}
              style={{
                height: "34px",
                background: "#D93B2B",
                border: "none",
                color: "white",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
                padding: "0 16px"
              }}
            >
              Chat with Ready
            </button>

          </div>

          {/* Hamburger */}
          <button
            className="navbar-hamburger"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>

        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="mobile-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.25)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: "70px",
            zIndex: 200
          }}
        >

          <div
            className="mobile-menu-card"
            style={{
              width: "92%",
              background: "white",
              borderRadius: "22px",
              padding: "24px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.15)"
            }}
          >

            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "20px"
              }}
            >
              <button
                onClick={() => setMenuOpen(false)}
                style={{
                  fontSize: "22px",
                  background: "none",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                ✕
              </button>
            </div>

            {/* Divider */}
            <div style={{
              height: "1px",
              background: "#eee",
              marginBottom: "20px"
            }} />

            {/* Menu items */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}>

              <button
                onClick={onGoToLogin}
                style={{
                  height: "44px",
                  borderRadius: "10px",
                  border: "1px solid #D4B8B0",
                  background: "white",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Login
              </button>

              <button
                onClick={onGoToLogin}
                style={{
                  height: "44px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#D93B2B",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Chat with Ready
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}