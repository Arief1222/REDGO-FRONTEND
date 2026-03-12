// features/auth/TosPage.tsx
import { Link } from "react-router"
import { ROUTES } from "@/app/constants/router"

const sections = [
  {
    title: "1. Use of the Services",
    body: "RedGo AI provides an artificial intelligence platform designed to help users explore ideas, discuss strategies, and analyze business situations through conversational interaction.\n\nYou agree to use the Services only in compliance with these Terms and applicable laws. You must not misuse the Services or attempt to access them using methods other than the interface provided.",
  },
  {
    title: "2. User Accounts",
    body: "Some features of the Services require you to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.\n\nYou agree to provide accurate and complete information when creating your account and to keep that information updated.",
  },
  {
    title: "3. User Inputs",
    body: "When using RedGo AI, you may submit prompts, questions, messages, or other content through the platform (\"User Inputs\").\n\nYou retain ownership of the content you submit. By submitting User Inputs, you grant RedGo AI the right to process that content for the purpose of operating the Services, generating responses, maintaining system functionality, and improving the platform.\n\nYou are responsible for the content you submit and should avoid sharing confidential or sensitive information.",
  },
  {
    title: "4. AI-Generated Outputs",
    body: "RedGo AI uses artificial intelligence systems to generate responses (\"Outputs\") based on the inputs provided by users.\n\nOutputs are generated automatically and may not always be accurate, complete, or suitable for specific business decisions. RedGo AI does not guarantee the reliability of AI-generated outputs.\n\nUsers are responsible for evaluating and using any information generated through the Services.",
  },
  {
    title: "5. Acceptable Use",
    body: "You agree not to use the Services to:\n\n• Violate any applicable laws or regulations\n• Attempt to gain unauthorized access to the platform\n• Disrupt or interfere with the operation of the Services\n• Submit harmful, abusive, or malicious content\n• Use the system for spam, fraud, or deceptive activities\n\nRedGo AI reserves the right to suspend or terminate access if these Terms are violated.",
  },
  {
    title: "6. Intellectual Property",
    body: "The RedGo AI platform, including its software, design, and underlying technology, is owned by RedGo AI and protected by applicable intellectual property laws.\n\nYou may not copy, distribute, modify, reverse engineer, or create derivative works based on the Services without prior written permission.",
  },
  {
    title: "7. Service Availability",
    body: "RedGo AI updates and improves the Services over time. Features may change, be modified, or be discontinued as part of ongoing development.",
  },
  {
    title: "8. Termination",
    body: "RedGo AI reserves the right to suspend or terminate access to the Services if a user violates these Terms or uses the platform in a manner that may harm the service or other users.",
  },
  {
    title: "9. Limitation of Liability",
    body: "To the maximum extent permitted by law, RedGo AI shall not be liable for any indirect, incidental, or consequential damages resulting from the use of the Services or reliance on AI-generated outputs.\n\nUse of the Services is at your own discretion and risk.",
  },
  {
    title: "10. Changes to the Terms",
    body: "RedGo AI may update these Terms from time to time. Updated versions will be posted on this page with a revised date.\n\nContinued use of the Services after updates indicates acceptance of the revised Terms.",
  },
  {
    title: "11. Contact",
    body: "If you have questions regarding these Terms, please contact:\n\nEmail: hello@zenzelab.com",
  },
]

const TosPage = () => (
  <div style={{
    minHeight: "100vh",
    background: "#fafafa",
    fontFamily: "'Plus Jakarta Sans', 'DM Sans', 'Helvetica Neue', sans-serif",
    color: "#222",
  }}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    `}</style>

    {/* Nav */}
    <div style={{
      padding: "20px 48px",
      background: "#fff",
      boxShadow: "0 1px 0 #f0f0f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <img src="/maskot.png" alt="RedGo AI" style={{ width: "32px", height: "32px", objectFit: "contain", borderRadius: "6px" }} />
        <span style={{ fontWeight: 800, fontSize: "15px", letterSpacing: "-0.3px" }}>
          RedGo <span style={{ color: "#e53e3e" }}>AI</span>
        </span>
      </div>
      <Link to={`${ROUTES.AUTH.LOGIN_1}?direct=1`} style={{
        fontSize: "13px",
        color: "#9ca3af",
        textDecoration: "none",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}>
        ← Kembali ke Login
      </Link>
    </div>

    {/* Content */}
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "56px 24px 100px" }}>
      {/* Header */}
      <div style={{ marginBottom: "52px" }}>
        <p style={{
          fontSize: "11px", color: "#e53e3e", marginBottom: "10px",
          textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700,
        }}>
          Legal
        </p>
        <h1 style={{
          fontSize: "38px", fontWeight: 800,
          letterSpacing: "-1.2px", marginBottom: "10px",
          color: "#0f0f0f", lineHeight: 1.15,
        }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: "13px", color: "#9ca3af", fontWeight: 500 }}>
          Last updated: March 08, 2026
        </p>
        <div style={{
          marginTop: "24px", padding: "18px 20px",
          background: "#fff8f8",
          border: "1px solid #fee2e2",
          borderRadius: "12px",
          fontSize: "13px", color: "#555", lineHeight: 1.7,
        }}>
          These Terms of Service ("Terms") govern your access to and use of the <strong>RedGo AI</strong> website and services (the "Services"). By accessing or using the Services, you agree to these Terms. If you do not agree with these Terms, you must not use the Services.
        </div>
      </div>

      {/* Sections */}
      {sections.map(({ title, body }) => (
        <div key={title} style={{ marginBottom: "36px" }}>
          <h2 style={{
            fontSize: "15px", fontWeight: 700,
            marginBottom: "10px", color: "#111",
            letterSpacing: "-0.2px",
          }}>
            {title}
          </h2>
          {body.split("\n\n").map((para, i) => (
            <p key={i} style={{
              fontSize: "14px", color: "#555",
              lineHeight: 1.85, marginBottom: "10px",
              whiteSpace: "pre-line",
            }}>
              {para}
            </p>
          ))}
          <div style={{ marginTop: "24px", height: "1px", background: "#f3f4f6" }} />
        </div>
      ))}
    </div>
  </div>
)

export default TosPage