// features/auth/components/FeaturesSection.tsx
import { useScrollAnimation } from "../hooks/useScrollAnimation"
import "../components/animations.css"

const features = [
  { icon: "/branding.png",          title: "Branding",        desc: <>Bangun identitas brand yang kuat dan <br />konsisten. Nama, tagline, brand voice. </> },
  { icon: "/marketing.png",         title: "Marketing",       desc: <>Strategi konten, kampanye, dan cara<br /> menjangkau target pasar yang tepat.</>},
  { icon: "/pricing.png",           title: "Pricing",         desc: <>Tentukan harga yang optimal - tidak terlalu<br /> murah, dan tidak terlalu mahal.</> },
  { icon: "/market-analysis.png",   title: "Market Analysis", desc: <>Analisis kompetitor, positioning, dan langkah<br /> strategis untuk tumbuh lebih cepat.</> },
  { icon: "/lainnya.png", title: "Lainnya",       desc: <>Dan berbagai topik lain yang diperlukan</>, italic: true },
];

const delays = ["delay-100","delay-200","delay-300","delay-400","delay-500","delay-600"];

const FeaturesSection = () => {
  const ref = useScrollAnimation()
  return (
    <>
      <style>{`
        .features-grid {
          grid-template-columns: repeat(3, 1fr) !important;
        }
        .features-title {
          font-size: 58px !important;
        }
        .features-section-pad {
          padding: 60px 56px !important;
        }

        @media (max-width: 900px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .features-title {
            font-size: 44px !important;
          }
          .features-section-pad {
            padding: 48px 32px !important;
          }
        }

        @media (max-width: 560px) {
          .features-grid {
            grid-template-columns: 1fr !important;
          }
          .features-title {
            font-size: 36px !important;
          }
          .features-section-pad {
            padding: 40px 20px !important;
          }
        }
      `}</style>
      <section
        ref={ref as React.RefObject<HTMLElement>}
        className="features-section-pad"
        style={{ width: "100%", minHeight: "720px", background: "#FFFFFF", boxSizing: "border-box", padding: "60px 56px", fontFamily: "Inter, sans-serif" }}
      >
        <div style={{ maxWidth: "1328px", margin: "0 auto" }}>

          <p className="anim-fade-up" style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "12px", color: "#D93B2B", margin: "0 0 18px 0", textTransform: "uppercase" }}>
            WHAT READY HELPS WITH
          </p>

          <div className="anim-fade-up delay-100" style={{ marginBottom: "16px" }}>
            <div className="features-title" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "58px", color: "#1A1410", lineHeight: "100%" }}>Your business,</div>
            <em className="features-title" style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "italic", fontSize: "58px", color: "#D93B2B", lineHeight: "100%", display: "block" }}>every angle.</em>
          </div>

          <p className="anim-fade-up delay-200" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "16px", color: "#9A7B73", margin: "0 0 48px 0" }}>
            Ready menguasai berbagai aspek bisnis, coba mode{" "}
            <strong style={{ fontWeight: 800, color: "#9A7B73" }}>Thrive</strong>{" "}
            untuk eksplore lebih banyak!
          </p>

          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {features.map(({ icon, title, desc, italic }, i) => (
              <div key={title} className={`anim-fade-up card-hover ${delays[i]}`} style={{ background: "#FDFAF7", border: "1px solid #EAD9D4", borderRadius: "14px", padding: "24px", boxSizing: "border-box", minHeight: "180px", display: "flex", flexDirection: "column" }}>
                <div style={{ width: "48px", height: "48px", background: "#F5EAE8", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px", overflow: "hidden" }}>
                  <img src={icon} alt={title} style={{ width: "750%", height: "750%", objectFit: "contain" }} />
                </div>
                <h3 style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "20px", color: "#1A1410", lineHeight: "100%", margin: "0 0 12px 0", fontStyle: italic ? "italic" : "normal" }}>{title}</h3>
                <p style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "13px", color: "#9A7B73", lineHeight: "150%", margin: 0, fontStyle: italic ? "italic" : "normal" }}>{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}

export default FeaturesSection;