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
      
          @keyframes gp-wiggle {
          0%,100% { transform: rotate(0deg) scale(1); }
          20%     { transform: rotate(-15deg) scale(1.15); }
          40%     { transform: rotate(10deg) scale(1.1); }
          60%     { transform: rotate(-8deg) scale(1.12); }
          80%     { transform: rotate(5deg) scale(1.05); }
        }
        @keyframes btn-pop1 { 0%,100%{transform:translateY(0)} 25%{transform:translateY(-4px)} }
        @keyframes btn-pop2 { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-4px)} }
        @keyframes btn-pop3 { 0%,100%{transform:translateY(0)} 55%{transform:translateY(-4px)} }
        @keyframes btn-pop4 { 0%,100%{transform:translateY(0)} 70%{transform:translateY(-4px)} }

        .gp-body { transform-origin: 30px 20px; animation: gp-wiggle 1.8s ease-in-out infinite; }
        .gp-btn1 { transform-origin: 44px 15px; animation: btn-pop1 1.8s ease-in-out infinite; }
        .gp-btn2 { transform-origin: 38px 19px; animation: btn-pop2 1.8s ease-in-out infinite; }
        .gp-btn3 { transform-origin: 50px 19px; animation: btn-pop3 1.8s ease-in-out infinite; }
        .gp-btn4 { transform-origin: 44px 23px; animation: btn-pop4 1.8s ease-in-out infinite; }

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
              onClick={() => window.location.href = "/BrainGame/"}
              className="btn-drill"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                height: "34px",
                background: "#D93B2B",
                border: "none",
                color: "white",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
                padding: "0 16px",
              }}
            >
              Mainkan Brain Drill
              <svg width="24" height="18" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
                <g className="gp-body">
                  <rect x="5" y="7" width="50" height="22" rx="8" fill="white" />
                  <ellipse cx="10" cy="27" rx="9" ry="7" fill="white" />
                  <ellipse cx="50" cy="27" rx="9" ry="7" fill="white" />
                  <rect x="8" y="15" width="14" height="5" rx="2" fill="#D93B2B" />
                  <rect x="12" y="11" width="5" height="14" rx="2" fill="#D93B2B" />
                  <rect x="26" y="13" width="8" height="5" rx="2" fill="#D93B2B" opacity="0.7" />
                </g>
                <circle className="gp-btn1" cx="44" cy="15" r="3" fill="white" />
                <circle className="gp-btn2" cx="38" cy="19" r="3" fill="white" />
                <circle className="gp-btn3" cx="50" cy="19" r="3" fill="white" />
                <circle className="gp-btn4" cx="44" cy="23" r="3" fill="white" />
              </svg>
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
                onClick={() => window.location.href = "/BrainGame/"}
                style={{
                  height: "44px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#D93B2B",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                Mainkan Brain Drill
                <svg width="24" height="18" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
                  <g className="gp-body">
                    <rect x="5" y="7" width="50" height="22" rx="8" fill="white" />
                    <ellipse cx="10" cy="27" rx="9" ry="7" fill="white" />
                    <ellipse cx="50" cy="27" rx="9" ry="7" fill="white" />
                    <rect x="8" y="15" width="14" height="5" rx="2" fill="#D93B2B" />
                    <rect x="12" y="11" width="5" height="14" rx="2" fill="#D93B2B" />
                    <rect x="26" y="13" width="8" height="5" rx="2" fill="#D93B2B" opacity="0.7" />
                  </g>
                  <circle className="gp-btn1" cx="44" cy="15" r="3" fill="white" />
                  <circle className="gp-btn2" cx="38" cy="19" r="3" fill="white" />
                  <circle className="gp-btn3" cx="50" cy="19" r="3" fill="white" />
                  <circle className="gp-btn4" cx="44" cy="23" r="3" fill="white" />
                </svg>
              </button>

            </div>

          </div>

        </div>
      )}

    </>
  );
}