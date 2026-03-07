// features/auth/components/CtaSection.tsx
import { useScrollAnimation } from "../hooks/useScrollAnimation"
import "../components/animations.css"

interface CtaSectionProps {
  onGoToLogin: () => void;
}

const testimonials = [
  {
    tag: "BRANDING",
    quote: <>"30 menit brainstorming sama Ready,<br />finally punya nama brand, tagline, dan<br />brand story yang jauh lebih pas."</>,
    name: "AR", role: "Founder, Sustainable Fashion Brand",
  },
  {
    tag: "PRICING",
    quote: <>"Ready bantu naikkan harga 20%<br />dengan reframing value proposition.<br />Revenue naik, komplain turun karena<br />punya strategi yang tepat."</>,
    name: "Bryan H", role: "CEO, B2B SaaS Startup",
  },
  {
    tag: "MARKETING",
    quote: <>"Campaign strategy langsung kena ke market.<br />Setelah bingung mikir konsep akhirnya<br />sekarang ada yang bantu. thanks Ready"</>,
    name: "Citra Dewi", role: "Marketing Lead, F&B Startup",
  },
];

const CtaSection = ({ onGoToLogin }: CtaSectionProps) => {
  const ref = useScrollAnimation()
  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{ width: "100%", minHeight: "630px", background: "#D93B2B", boxSizing: "border-box", padding: "60px 56px", fontFamily: "Inter, sans-serif", display: "flex", flexDirection: "column", alignItems: "center" }}>

      <p className="anim-fade-up" style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "20px", color: "white", textAlign: "center", margin: "0 0 16px 0" }}>GET STARTED</p>

      <div className="anim-fade-up delay-100" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "60px", lineHeight: "100%", textAlign: "center", marginBottom: "48px" }}>
        <span style={{ color: "#1A1410" }}>Siap </span>
        <em style={{ fontStyle: "italic", fontWeight: 400, color: "white" }}>thinking</em>
        <span style={{ color: "#1A1410" }}> bareng Ready?</span>
      </div>

      <button className="anim-fade-up delay-200 btn-hover" onClick={onGoToLogin} style={{ width: "260px", height: "54px", background: "#FFFBFA", border: "none", borderRadius: "10px", cursor: "pointer", marginBottom: "64px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "20px", color: "#D93B2B" }}>Mulai sekarang →</span>
      </button>

      <div style={{ width: "100%", maxWidth: "1328px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {testimonials.map((t, i) => (
          <div key={t.name} className={`anim-fade-up card-hover delay-${(i+1)*100}`} style={{ background: "#FFFFFF", border: "1px solid #EAD9D4", borderRadius: "14px", padding: "28px 32px", boxSizing: "border-box", minHeight: "260px", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1 }}>
              <span style={{ display: "inline-flex", alignItems: "center", height: "24px", background: "#F5EAE8", borderRadius: "6px", padding: "0 10px", fontFamily: "Inter", fontWeight: 700, fontSize: "11px", color: "#D93B2B" }}>{t.tag}</span>
            </div>
            <div>
              <div style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "italic", fontSize: "15px", color: "#1A1410", lineHeight: "180%", margin: "0 0 16px 0" }}>{t.quote}</div>
              <p style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "13px", color: "#3D2B24", margin: "0 0 6px 0" }}>{t.name}</p>
              <p style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "12px", color: "#9A7B73", margin: 0 }}>{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CtaSection;