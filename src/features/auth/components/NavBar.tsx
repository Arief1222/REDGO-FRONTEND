// features/auth/components/NavBar.tsx
import "../components/animations.css"

interface NavBarProps {
  onGoToLogin?: () => void;
}

function RedGoLogo() {
  return (
    <span style={{
      fontFamily: "Inter, sans-serif",
      fontWeight: 700, fontSize: "22px",
      lineHeight: "100%", letterSpacing: "0%",
      userSelect: "none",
    }}>
      <span style={{ color: "#111" }}>Red</span>
      <span style={{ color: "#D93B2B" }}>Go AI</span>
    </span>
  );
}

export default function NavBar({ onGoToLogin }: NavBarProps) {
  return (
    <nav
      className="anim-fade-in is-visible"
      style={{
        width: "100%", height: "72px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        paddingLeft: "61px", paddingRight: "48px",
        borderBottom: "1px solid #f0f0f0",
        position: "sticky", top: 0,
        background: "rgba(253, 250, 247, 0.95)",
        backdropFilter: "blur(8px)",
        zIndex: 100, boxSizing: "border-box",
      }}
    >
      {/* Logo */}
      <RedGoLogo />

      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button
          onClick={onGoToLogin}
          className="nav-btn-hover"
          style={{
            width: "100px", height: "34px",
            background: "transparent", border: "1.5px solid #D4B8B0",
            color: "#111", borderRadius: "8px",
            fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 700,
            lineHeight: "100%", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
          }}
        >Login</button>

        <button
          onClick={onGoToLogin}
          className="btn-hover"
          style={{
            width: "168px", height: "34px",
            background: "#D93B2B", border: "none", color: "white",
            borderRadius: "8px", fontFamily: "Inter, sans-serif",
            fontSize: "13px", fontWeight: 700, lineHeight: "100%",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", gap: "4px", padding: 0,
          }}
        >Chat with Ready ▾</button>
      </div>
    </nav>
  );
}