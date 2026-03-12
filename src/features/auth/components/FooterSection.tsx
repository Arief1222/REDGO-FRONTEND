// features/auth/components/FooterSection.tsx
import { useScrollAnimation } from "../hooks/useScrollAnimation"
import "../components/animations.css"

const FooterSection = () => {
  const ref = useScrollAnimation()
  return (
    <footer ref={ref as React.RefObject<HTMLElement>} style={{ width: "100%", minHeight: "400px", background: "#1A1410", boxSizing: "border-box", display: "flex", alignItems: "center", padding: "0 89px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div className="anim-fade-up" style={{ width: "44px", height: "44px", background: "white", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          <img src="/maskot.png" width="46" height="46" style={{ objectFit: "contain", display: "block" }} />
        </div>
        <div className="anim-fade-up delay-100" style={{ fontFamily: "Inter, sans-serif", fontWeight: 700, fontSize: "22px", lineHeight: "100%" }}>
          <span style={{ color: "white" }}>Red</span>
          <span style={{ color: "#D93B2B" }}>Go AI</span>
        </div>
        <div className="anim-fade-up delay-200" style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "14px", color: "#856B62", lineHeight: "100%" }}>by ZENZELAB</div>
      </div>

    </footer>
  )
}

export default FooterSection;