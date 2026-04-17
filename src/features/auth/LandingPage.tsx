// features/auth/LandingPage.tsx
import NavBar from "./components/NavBar"
import HeroSection from "./components/HeroSection"
import FeaturesSection from "./components/FeaturesSection"
import PricingSection from "./components/PricingSection"  // ✅ NEW
import CtaSection from "./components/CtaSection"
import FooterSection from "./components/FooterSection"

// ─── Logo ─────────────────────────────────────────────────────────────────────
export const RedGoLogo = ({ dark = false }: { dark?: boolean }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
    <div style={{
      width: "28px", height: "28px", background: "#D93B2B", borderRadius: "7px",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    </div>
    <span style={{ fontWeight: 800, fontSize: "16px", color: dark ? "white" : "#1A1410", letterSpacing: "-0.3px" }}>
      RedGo <span style={{ color: "#D93B2B" }}>AI</span>
    </span>
  </div>
);

// ─── Landing Page ─────────────────────────────────────────────────────────────
interface LandingPageProps {
  onGoToLogin: () => void;
}

const LandingPage = ({ onGoToLogin }: LandingPageProps) => (
  <div style={{ fontFamily: "Inter, sans-serif", background: "#FDFAF7", color: "#1A1410", overflowX: "hidden" }}>

    {/* NAVBAR */}
    <NavBar onGoToLogin={onGoToLogin} />

    {/* HERO */}
    <HeroSection onGoToLogin={onGoToLogin} />

    {/* FEATURES */}
    <FeaturesSection />

    {/* PRICING ✅ */}
    <PricingSection onGoToLogin={onGoToLogin} />

    {/* CTA + TESTIMONIALS */}
    <CtaSection onGoToLogin={onGoToLogin} />

    {/* FOOTER */}
    <FooterSection />

  </div>
);

export default LandingPage;