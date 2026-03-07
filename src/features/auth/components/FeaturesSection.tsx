// features/auth/components/FeaturesSection.tsx
import { useScrollAnimation } from "../hooks/useScrollAnimation"
import "../components/animations.css"

// ─── Icons (dari PDF RedGo) ───────────────────────────────────────────────────
const IconMarketing = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#D93B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10 Q4 7 7 7 L20 4 Q22 4 22 6 L22 20 Q22 22 20 22 L7 19 Q4 19 4 16 Z" />
    <rect x="1" y="10" width="3" height="6" rx="1" />
    <path d="M22 10 Q26 11 26 14 Q26 17 22 18" />
  </svg>
)

const IconBranding = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#D93B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3 L24 8 L24 16 Q24 22 14 26 Q4 22 4 16 L4 8 Z" />
    <polyline points="9,14 12,17 19,11" />
  </svg>
)

const IconPricing = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#D93B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2 L20 2 Q22 2 22 4 L22 22 Q22 24 20 24 L8 24 Q6 24 6 22 L6 4 Q6 2 8 2 Z" />
    <circle cx="14" cy="7" r="2" />
    <line x1="10" y1="13" x2="18" y2="13" />
    <line x1="10" y1="17" x2="18" y2="17" />
    <path d="M14 24 L11 28 L17 28 Z" />
  </svg>
)

const IconPositioning = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#D93B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="14" cy="14" r="12" />
    <circle cx="14" cy="14" r="7" />
    <circle cx="14" cy="14" r="2.5" />
    <line x1="20" y1="8" x2="24" y2="4" />
    <polyline points="21,4 24,4 24,7" />
  </svg>
)

const IconMarketAnalysis = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#D93B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3,20 9,13 13,16 19,8 25,3" />
    <polyline points="23,3 25,3 25,5" />
    <rect x="4" y="18" width="4" height="6" />
    <rect x="11" y="15" width="4" height="9" />
    <rect x="18" y="11" width="4" height="13" />
    <line x1="2" y1="24" x2="26" y2="24" />
  </svg>
)

const IconLainnya = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#D93B2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="14" cy="14" r="4" />
    <path d="M14 2 L14 6 M14 22 L14 26 M2 14 L6 14 M22 14 L26 14" />
    <path d="M5.9 5.9 L8.8 8.8 M19.2 19.2 L22.1 22.1 M22.1 5.9 L19.2 8.8 M8.8 19.2 L5.9 22.1" />
  </svg>
)

const features = [
  { Icon: IconBranding,       title: "Branding",        desc: "Bangun identitas brand yang kuat dan konsisten. Nama, tagline, brand voice." },
  { Icon: IconMarketing,      title: "Marketing",       desc: "Strategi konten, kampanye, dan cara menjangkau target pasar yang tepat." },
  { Icon: IconPricing,        title: "Pricing",         desc: "Tentukan harga yang optimal - tidak terlalu murah, dan tidak terlalu mahal." },
 //{ Icon: IconPositioning,    title: "Positioning",     desc: "Analisis kompetitor, positioning, dan langkah strategis untuk tumbuh lebih cepat." },
  { Icon: IconMarketAnalysis, title: "Market Analysis", desc: "Pantau tren pasar dan ambil keputusan berbasis data yang akurat." },
  { Icon: IconLainnya,        title: "Lainnya",         desc: "Dan berbagai topik lain yang diperlukan", italic: true },
];

const delays = ["delay-100","delay-200","delay-300","delay-400","delay-500","delay-600"];

const FeaturesSection = () => {
  const ref = useScrollAnimation()
  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{ width: "100%", minHeight: "720px", background: "#FFFFFF", boxSizing: "border-box", padding: "60px 56px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: "1328px", margin: "0 auto" }}>

        <p className="anim-fade-up" style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "12px", color: "#D93B2B", margin: "0 0 18px 0", textTransform: "uppercase" }}>
          WHAT READY HELPS WITH
        </p>

        <div className="anim-fade-up delay-100" style={{ marginBottom: "16px" }}>
          <div style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "58px", color: "#1A1410", lineHeight: "100%" }}>Your business,</div>
          <em style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "italic", fontSize: "58px", color: "#D93B2B", lineHeight: "100%", display: "block" }}>every angle.</em>
        </div>

        <p className="anim-fade-up delay-200" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "16px", color: "#9A7B73", margin: "0 0 48px 0" }}>
          Ready menguasai berbagai aspek bisnis, coba mode{" "}
          <strong style={{ fontWeight: 800, color: "#9A7B73" }}>Thrive</strong>{" "}
          untuk eksplore lebih banyak!
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {features.map(({ Icon, title, desc, italic }, i) => (
            <div key={title} className={`anim-fade-up card-hover ${delays[i]}`} style={{ background: "#FDFAF7", border: "1px solid #EAD9D4", borderRadius: "14px", padding: "24px", boxSizing: "border-box", minHeight: "180px", display: "flex", flexDirection: "column" }}>
              <div style={{ width: "48px", height: "48px", background: "#F5EAE8", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <Icon />
              </div>
              <h3 style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "20px", color: "#1A1410", lineHeight: "100%", margin: "0 0 12px 0", fontStyle: italic ? "italic" : "normal" }}>{title}</h3>
              <p style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "13px", color: "#9A7B73", lineHeight: "150%", margin: 0, fontStyle: italic ? "italic" : "normal" }}>{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default FeaturesSection;