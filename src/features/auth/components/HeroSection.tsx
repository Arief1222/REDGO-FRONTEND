// features/auth/components/HeroSection.tsx
import { useScrollAnimation } from "../hooks/useScrollAnimation"
import "../components/animations.css"

interface HeroSectionProps {
  onGoToLogin: () => void;
}

const ChatMock = () => (
  <div className="anim-slide-right" style={{ width: "460px", borderRadius: "16px", boxShadow: "0 12px 48px rgba(217,59,43,0.12)", overflow: "hidden", fontFamily: "Inter, sans-serif", flexShrink: 0 }}>
    <div style={{ width: "460px", height: "72px", background: "#D93B2B", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ width: "44px", height: "44px", background: "rgba(255,255,255,0.9)", borderRadius: "10px", flexShrink: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/maskot.png" width="46" height="46" style={{ objectFit: "contain", display: "block" }} />
        </div>
        <div>
          <p style={{ margin: 0, fontFamily: "Inter", fontWeight: 700, fontSize: "15px", color: "white", lineHeight: "100%", marginBottom: "7px" }}>Ready</p>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "6px", height: "6px", background: "#7FE880", borderRadius: "50%", display: "inline-block" }} />
            <span style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "12px", color: "rgba(255,255,255,0.9)" }}>Online &amp; ready to think</span>
          </div>
        </div>
      </div>
      <span style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>by RedGo</span>
    </div>

    <div style={{ width: "460px", height: "388px", background: "#FAFAFA", padding: "18px 14px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "14px", overflow: "hidden" }}>
      <div className="anim-fade-up delay-200" style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
        <div style={{ width: "28px", height: "28px", background: "#D93B2B", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "white" }}>R</div>
        <div style={{ width: "300px", height: "48px", background: "#FFFFFF", border: "1px solid #EAD9D4", borderRadius: "4px 12px 12px 12px", display: "flex", alignItems: "center", padding: "0 16px", boxSizing: "border-box", fontSize: "13px", color: "#333" }}>Mau diskusi tentang apa hari ini?</div>
      </div>
      <div className="anim-fade-up delay-300" style={{ display: "flex", gap: "8px", paddingLeft: "34px" }}>
        {[{ emoji: "🎯", label: "Branding" }, { emoji: "📢", label: "Marketing" }].map(({ emoji, label }) => (
          <span key={label} style={{ height: "26px", background: "#F5EAE8", border: "1px solid #EDD5D0", borderRadius: "20px", padding: "0 12px", display: "flex", alignItems: "center", gap: "5px", fontFamily: "Inter", fontWeight: 700, fontSize: "12px", color: "#C0392B" }}>
            <span style={{ fontSize: "13px" }}>{emoji}</span>{label}
          </span>
        ))}
      </div>
      <div className="anim-fade-up delay-400" style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end", gap: "6px" }}>
        <div style={{ background: "#D93B2B", borderRadius: "12px 12px 4px 12px", padding: "10px 16px", maxWidth: "260px", fontSize: "13px", color: "white", lineHeight: 1.5 }}>Ingin tau cara pricing produk</div>
        <div style={{ width: "28px", height: "28px", background: "#D93B2B", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "white" }}>U</div>
      </div>
      <div className="anim-fade-up delay-500" style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
        <div style={{ width: "28px", height: "28px", background: "#D93B2B", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "white" }}>R</div>
        <div style={{ width: "80px", height: "36px", background: "#FFFFFF", border: "1px solid #EAD9D4", borderRadius: "4px 12px 12px 12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          {[0,1,2].map(i => <span key={i} className="dot-bounce" style={{ width: "8px", height: "8px", background: "#C4A8A0", borderRadius: "50%", display: "inline-block" }} />)}
        </div>
      </div>
    </div>

    <div style={{ width: "460px", height: "70px", background: "white", borderTop: "1px solid #EAD9D4", display: "flex", alignItems: "center", padding: "0 17px", gap: "8px", boxSizing: "border-box" }}>
      <input type="text" placeholder="Ketik pertanyaan bisnis kamu..." style={{ width: "358px", height: "38px", background: "#FDFAF7", border: "1.5px solid #EAD9D4", borderRadius: "8px", outline: "none", padding: "0 14px", fontFamily: "Inter", fontWeight: 400, fontSize: "13px", color: "#C4A8A0", boxSizing: "border-box", flexShrink: 0 }} />
      <button className="btn-hover" style={{ width: "38px", height: "38px", background: "#D93B2B", border: "none", borderRadius: "8px", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="15" height="12" viewBox="0 0 15 12" fill="white"><polygon points="0,0 0,12 15,6" /></svg>
      </button>
    </div>
  </div>
);

const HeroSection = ({ onGoToLogin }: HeroSectionProps) => {
  const ref = useScrollAnimation()
  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{ width: "100%", minHeight: "680px", position: "relative", display: "flex", alignItems: "center", background: "radial-gradient(5000% 5000% at 7000% 5000%, rgba(217,59,43,0.06) 0%, rgba(217,59,43,0) 100%), #FDFAF7", fontFamily: "Inter, sans-serif", overflow: "hidden", boxSizing: "border-box" }}>

      <div style={{ position: "absolute", left: "56px", top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", width: "620px" }}>
        <div className="anim-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(217,59,43,0.07)", borderRadius: "100px", padding: "5px 14px 5px 10px", marginBottom: "24px", width: "fit-content" }}>
          <span style={{ width: "8px", height: "8px", background: "#D93B2B", borderRadius: "50%", display: "inline-block" }} />
          <span style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "12px", color: "#D93B2B" }}>Ready by RedGo AI — Your AI Business Partner</span>
        </div>

        <div className="anim-fade-up delay-100" style={{ marginBottom: "24px" }}>
          <div><span style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "76px", color: "#1A1410", lineHeight: "100%" }}>Diskusikan </span><em style={{ fontFamily: "Inter", fontWeight: 400, fontStyle: "italic", fontSize: "76px", color: "#D93B2B", lineHeight: "100%" }}>bisnis</em></div>
          <div style={{ fontFamily: "Inter", fontWeight: 200, fontSize: "76px", color: "#1A1410", lineHeight: "100%" }}>dengan lebih</div>
          <div style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "76px", color: "#1A1410", lineHeight: "100%" }}>Terstruktur</div>
        </div>

        <p className="anim-fade-up delay-200" style={{ fontFamily: "Inter", fontWeight: 400, fontSize: "17px", color: "#9A7B73", lineHeight: "100%", margin: "0 0 40px 0", maxWidth: "598px" }}>
          RedGo AI bersama Anda mengurai ide, strategi, dan keputusan. Mulai diskusikan bisnis tanpa distraksi.
        </p>

        <button className="anim-fade-up delay-300 btn-hover" onClick={onGoToLogin} style={{ width: "250px", height: "52px", background: "#D93B2B", border: "none", borderRadius: "10px", cursor: "pointer", marginBottom: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "Inter", fontWeight: 700, fontSize: "15px", color: "#FFFFFF" }}>Mulai Sekarang</span>
        </button>

        <div className="anim-fade-up delay-400" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex" }}>
            {[{ bg: "#E4A69D", initial: "A" }, { bg: "#EDB8B0", initial: "B" }, { bg: "#F5C9C3", initial: "J" }, { bg: "#FDDBD6", initial: "D" }].map((a, i) => (
              <div key={i} style={{ width: "32px", height: "32px", borderRadius: "50%", background: a.bg, border: "2.5px solid #FDFAF7", marginLeft: i === 0 ? 0 : "-8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#C0392B", fontFamily: "Inter", zIndex: i + 1, position: "relative" }}>{a.initial}</div>
            ))}
          </div>
          <div>
            <p style={{ margin: 0, fontFamily: "Inter", fontWeight: 700, fontSize: "13px", color: "#1A1410" }}>500+ owner bisnis</p>
            <p style={{ margin: "4px 0 0 0", fontFamily: "Inter", fontWeight: 400, fontSize: "13px", color: "#9A7B73" }}>sudah berpikir bersama Ready</p>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: "720px", top: "60px", bottom: "60px", width: "1px", background: "linear-gradient(to bottom, transparent, #E8D5D0 20%, #E8D5D0 80%, transparent)" }} />

      <div style={{ position: "absolute", left: "760px", right: "56px", top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ChatMock />
      </div>
    </section>
  )
}

export default HeroSection;