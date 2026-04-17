// features/auth/components/FooterSection.tsx
import { useScrollAnimation } from "../hooks/useScrollAnimation"
import "../components/animations.css"
import { Mail, Instagram } from "lucide-react"



const FooterSection = () => {
  const ref = useScrollAnimation()
  return (
    <>
      <style>{`
        .footer-pad {
          padding: 0 89px !important;
        }

        @media (max-width: 768px) {
          .footer-pad {
            padding: 48px 32px !important;
          }
        }

        @media (max-width: 480px) {
          .footer-pad {
            padding: 40px 20px !important;
          }
        }
      `}</style>

      <footer
        ref={ref as React.RefObject<HTMLElement>}
        className="footer-pad"
        style={{
          width: "100%",
          minHeight: "400px",
          background: "#1A1410",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Logo */}
          <div
            className="anim-fade-up"
            style={{
              width: "44px",
              height: "44px",
              background: "white",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img src="/maskot.png" width="46" height="46" style={{ objectFit: "contain" }} />
          </div>

          {/* Brand */}
          <div className="anim-fade-up delay-100" style={{ fontWeight: 700, fontSize: "22px" }}>
            <span style={{ color: "white" }}>Red</span>
            <span style={{ color: "#D93B2B" }}>Go AI</span>
          </div>

          <div className="anim-fade-up delay-200" style={{ fontSize: "14px", color: "#856B62" }}>
            by ZENZELAB
          </div>

          <br />

          {/* Contact Title */}
          <div className="anim-fade-up delay-300" style={{ fontSize: "14px", color: "#856B62" }}>
            Our Contact
          </div>

          {/* Contact Links */}
          <div
            className="anim-fade-up delay-400"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "14px",
            }}
          >
            {/* Email 1 */}
            <a
              href="mailto:hello@zenzelab."
              style={{
                color: "#C2A9A1",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Mail size={16} />
              hello@zenzelab.com
            </a>

            {/* Email 2 */}
            <a
              href="mailto:operation@airedgo.com"
              style={{
                color: "#C2A9A1",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Mail size={16} />
              operation@airedgo.com
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/redgo.ai"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#C2A9A1",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Instagram size={16} />
              @redgo.ai
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}

export default FooterSection;