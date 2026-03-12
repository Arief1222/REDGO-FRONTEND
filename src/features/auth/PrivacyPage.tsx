// features/auth/PrivacyPage.tsx
import { Link } from "react-router"
import { ROUTES } from "@/app/constants/router"

const sections = [
  {
    title: "1. What Information Do We Collect?",
    body: "We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.\n\nSocial Media Login Data: We may provide you with the option to register with us using your existing social media account details, like your Google or other social media account. If you choose to register in this way, we will collect certain profile information about you from the social media provider.\n\nUser Inputs and Conversation History: When you interact, we collect and store the messages, prompts, questions, and other information that you submit. This includes conversation history and interactions within the chat interface. This information is used to provide the core functionality of RedGo AI, generate responses, maintain conversation continuity, and improve the performance and reliability of the service.",
  },
  {
    title: "2. How Do We Process Your Information?",
    body: "We process your personal information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. This includes:\n\n• To evaluate and improve our Services, products, marketing, and your experience.\n• To identify usage trends and understand how our Services are being used.\n• To facilitate account creation, authentication, and manage user accounts.\n• To deliver and facilitate delivery of services to the user.\n• To request feedback and contact you about your use of our Services.\n• To send you marketing and promotional communications (you may opt out at any time).",
  },
  {
    title: "3. When and With Whom Do We Share Your Personal Information?",
    body: "We may share your personal information in the following situations:\n\n• Business Transfers: We may share or transfer your information in connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business.\n• Business Partners: We may share your information with our business partners to offer you certain products, services, or promotions.",
  },
  {
    title: "4. Do We Offer Artificial Intelligence-Based Products?",
    body: "Yes. As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies (collectively, \"AI Products\"). These tools are designed to enhance your experience and provide you with innovative solutions. The terms in this Privacy Notice govern your use of the AI Products within our Services.",
  },
  {
    title: "5. How Do We Handle Your Social Logins?",
    body: "Our Services offer you the ability to register and log in using your third-party social media account details (like your Google logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider but will often include your name and email address as well as other information you choose to make public on such a social media platform.\n\nWe will use the information we receive only for the purposes described in this Privacy Notice or that are otherwise made clear to you on the relevant Services.",
  },
  {
    title: "6. How Long Do We Keep Your Information?",
    body: "We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law. No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.\n\nWhen we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or securely store it and isolate it from any further processing until deletion is possible.",
  },
  {
    title: "7. How Do We Keep Your Information Safe?",
    body: "We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.\n\nAlthough we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.",
  },
  {
    title: "8. What Are Your Privacy Rights?",
    body: "You may review, change, or terminate your account at any time.\n\nWithdrawing your consent: If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time by contacting us using the contact details provided below.\n\nAccount Information: You may log in to your account settings to review or change your information, or request account termination. Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information to prevent fraud, troubleshoot problems, assist with investigations, or comply with legal requirements.\n\nIf you have questions or comments about your privacy rights, you may email us at hello@zenzelab.com.",
  },
  {
    title: "9. Controls for Do-Not-Track Features",
    body: "Most web browsers and some mobile operating systems include a Do-Not-Track (\"DNT\") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.",
  },
  {
    title: "10. Do We Make Updates to This Notice?",
    body: "Yes, we will update this notice as necessary to stay compliant with relevant laws. We may update this Privacy Notice from time to time. The updated version will be indicated by an updated \"Revised\" date at the top of this Privacy Notice. If we make material changes, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.",
  },
  {
    title: "11. How Can You Contact Us About This Notice?",
    body: "If you have questions or comments about this notice, you may email us at hello@zenzelab.com.",
  },
]

const PrivacyPage = () => (
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
          Privacy Policy
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
          This Privacy Notice for <strong>RedGo AI</strong> ("we," "us," or "our") describes how and why we might access, collect, store, use, and/or share your personal information when you use our services, including when you visit{" "}
          <a href="http://www.airedgo.com" style={{ color: "#e53e3e" }}>www.airedgo.com</a>,
          use RedGo AI, or engage with us in other related ways.{" "}
          Questions or concerns? Contact us at{" "}
          <a href="mailto:hello@zenzelab.com" style={{ color: "#e53e3e" }}>hello@zenzelab.com</a>.
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

export default PrivacyPage