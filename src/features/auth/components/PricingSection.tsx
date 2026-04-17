// features/auth/components/PricingSection.tsx
import { useState } from "react";
import { Check, Clock, Crown, Lock, Zap, LogIn, X } from "lucide-react";

const FREE_FEATURES = [
  { icon: Zap,   text: "Percakapan harian terbatas" },
  { icon: Lock,  text: "Akses Mode Probe" },
  { icon: Crown, text: "Mode Thrive dengan fitur terbatas" },
];

const PREMIUM_FEATURES = [
  { icon: Zap,   text: "Percakapan tanpa batas setiap hari" },
  { icon: Lock,  text: "Akses semua fitur premium" },
  { icon: Crown, text: "Prioritas fitur eksklusif baru" },
];

type PaymentMethod = "qris" | "va";

interface Props {
  onGoToLogin: () => void;
}

export default function PricingSection({ onGoToLogin }: Props) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("qris");

  return (
    <>
      <section style={{
        background: "linear-gradient(160deg, #C8281A 0%, #D93B2B 40%, #B02010 100%)",
        padding: "90px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: 320, height: 320,
          background: "rgba(255,255,255,0.07)", borderRadius: "50%",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: 240, height: 240,
          background: "rgba(255,255,255,0.05)", borderRadius: "50%",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 style={{
              fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800,
              color: "#fff", margin: "0 0 12px", letterSpacing: "-0.03em", lineHeight: 1.15,
            }}>
              Pilih paket yang sesuai
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, margin: 0 }}>
              Mulai gratis, upgrade kapan saja
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
            alignItems: "stretch",
          }}>
            <PricingCard
              title="Free"
              price={null}
              subtitle="Untuk mencoba RedGo AI"
              features={FREE_FEATURES}
              ctaLabel="Mulai Gratis"
              isPremium={false}
              onSelect={onGoToLogin}
            />
            <PricingCard
              title="Premium"
              price={80000}
              subtitle="≈ Rp 26.700 per bulan · Bayar sekali, nikmati 3 bulan"
              features={PREMIUM_FEATURES}
              ctaLabel="Berlangganan Sekarang"
              isPremium={true}
              onSelect={() => setShowCheckout(true)}
              badge="Paling Populer"
            />
          </div>

          <p style={{
            textAlign: "center", color: "rgba(255,255,255,0.4)",
            fontSize: 12, marginTop: 32,
          }}>
            Pembayaran aman via Midtrans · Virtual Account & QRIS tersedia
          </p>
        </div>
      </section>

      {/* ─── Checkout Modal ─────────────────────────────────────────────── */}
      {showCheckout && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowCheckout(false); }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px 16px",
            backdropFilter: "blur(4px)",
          }}
        >
          <div style={{
            background: "#fff",
            borderRadius: 28,
            padding: "32px 28px",
            maxWidth: 420,
            width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            position: "relative",
            animation: "slideUp 0.2s ease",
          }}>
            {/* Close button */}
            <button
              onClick={() => setShowCheckout(false)}
              style={{
                position: "absolute", top: 16, right: 16,
                width: 32, height: 32, borderRadius: "50%",
                border: "none", background: "#F5F5F5",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={16} color="#888" />
            </button>

            {/* Title */}
            <h2 style={{
              textAlign: "center", fontSize: 18, fontWeight: 700,
              color: "#1A1410", margin: "0 0 24px",
            }}>
              Checkout Premium Plan
            </h2>

            {/* Icon + Price */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 20,
                background: "rgba(217,59,43,0.1)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                marginBottom: 14,
              }}>
                <Crown size={30} color="#D93B2B" />
              </div>
              <br/>
              <div style={{ fontSize: 38, fontWeight: 800, color: "#1A1410", letterSpacing: "-0.03em" }}>
                Rp 80.000
              </div>
              <br/>
              <div style={{ fontSize: 13, color: "#999", marginTop: 4 }}>
                Durasi: 3 bulan
              </div>
              
            </div>

            <div style={{ height: 1, background: "#F0F0F0", margin: "20px 0" }} />

            <p style={{ fontSize: 13, color: "#999", margin: "0 0 12px" }}>
              Pilih metode pembayaran
            </p>

            {/* QRIS */}
            <PaymentOption
              selected={selectedMethod === "qris"}
              onSelect={() => setSelectedMethod("qris")}
              icon={
                <img src="/qris-logo.png" alt="QRIS" style={{ width: 52, height: "auto" }} />
              }
              label="QRIS"
            />

            {/* Virtual Account */}
            <PaymentOption
              selected={selectedMethod === "va"}
              onSelect={() => setSelectedMethod("va")}
              icon={
                <div style={{
                  width: 44, height: 28, borderRadius: 6, background: "#E8F5E9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
              }
              label="Virtual Account"
            />

            {/* CTA */}
            <button
              onClick={() => { setShowCheckout(false); onGoToLogin(); }}
              style={{
                width: "100%", padding: "16px 0", borderRadius: 16,
                border: "none", cursor: "pointer",
                background: "linear-gradient(90deg, #D93B2B, #FF5A47)",
                color: "#fff", fontWeight: 700, fontSize: 15,
                marginTop: 6,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "linear-gradient(90deg, #C03020, #E84A37)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "linear-gradient(90deg, #D93B2B, #FF5A47)";
              }}
            >
              <LogIn size={16} />
              Login &amp; Lanjutkan Pembayaran
            </button>

            <p style={{
              textAlign: "center", fontSize: 12, color: "#aaa",
              margin: "14px 0 0", lineHeight: 1.6,
            }}>
              Setelah login Anda dapat melanjutkan ke halaman checkout untuk pembayaran fitur Premium.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

// ─── PricingCard ──────────────────────────────────────────────────────────────

function PricingCard({
  title, price, subtitle, features, ctaLabel, isPremium, onSelect, badge,
}: {
  title: string;
  price: number | null;
  subtitle: string;
  features: { icon: any; text: string }[];
  ctaLabel: string;
  isPremium: boolean;
  onSelect: () => void;
  badge?: string;
}) {
  return (
    <div style={{
      position: "relative", background: "#fff", borderRadius: 28, overflow: "hidden",
      boxShadow: isPremium
        ? "0 20px 60px rgba(0,0,0,0.25), 0 0 0 2px rgba(255,255,255,0.3)"
        : "0 8px 32px rgba(0,0,0,0.15)",
      display: "flex", flexDirection: "column",
    }}>
      {badge && (
        <div style={{
          position: "absolute", top: 20, right: 20,
          background: "linear-gradient(90deg, #D93B2B, #FF5A47)",
          borderRadius: 100, padding: "4px 14px",
          fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "0.06em",
          boxShadow: "0 4px 12px rgba(217,59,43,0.4)",
        }}>
          ★ {badge}
        </div>
      )}

      {isPremium && (
        <div style={{ height: 6, background: "linear-gradient(90deg, #D93B2B, #FF6B5A)" }} />
      )}

      <div style={{ padding: "28px 28px 0" }}>
        <div style={{
          width: 52, height: 52, borderRadius: 16, marginBottom: 16,
          background: isPremium ? "rgba(217,59,43,0.1)" : "rgba(0,0,0,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Crown size={24} color={isPremium ? "#D93B2B" : "#888"} />
        </div>

        <div style={{
          display: "inline-block", marginBottom: 16,
          border: `1px solid ${isPremium ? "rgba(217,59,43,0.25)" : "rgba(0,0,0,0.1)"}`,
          borderRadius: 100, padding: "3px 14px",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          color: isPremium ? "#D93B2B" : "#888",
        }}>
          {title}
        </div>

        <div style={{ marginBottom: 6 }}>
          {price === null ? (
            <span style={{ fontSize: 40, fontWeight: 800, color: "#1A1410", letterSpacing: "-0.03em" }}>
              Gratis
            </span>
          ) : (
            <>
              <span style={{ fontSize: 40, fontWeight: 800, color: "#1A1410", letterSpacing: "-0.03em" }}>
                Rp {price.toLocaleString("id-ID")}
              </span>
              <span style={{ color: "#999", fontSize: 14, marginLeft: 6 }}>/ 3 bulan</span>
            </>
          )}
        </div>
        <p style={{ color: "#999", fontSize: 12, margin: "0 0 20px" }}>{subtitle}</p>

        <div style={{ height: 1, background: "#F0F0F0", marginBottom: 20 }} />

        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          {features.map(({ icon: Icon, text }) => (
            <li key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: isPremium ? "rgba(217,59,43,0.08)" : "rgba(0,0,0,0.04)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={15} color={isPremium ? "#D93B2B" : "#888"} />
              </div>
              <span style={{ color: "#333", fontSize: 14, flex: 1 }}>{text}</span>
              {isPremium && <Check size={15} color="#22C55E" strokeWidth={3} />}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ padding: "0 28px 28px", marginTop: "auto" }}>
        {isPremium && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#FFFBEB", border: "1px solid #FDE68A",
            borderRadius: 12, padding: "10px 14px", marginBottom: 14,
          }}>
            <Clock size={14} color="#D97706" />
            <span style={{ color: "#92400E", fontSize: 12, fontWeight: 500 }}>
              Harga spesial · Terbatas untuk early adopter
            </span>
          </div>
        )}
        <button
          onClick={onSelect}
          style={{
            width: "100%", padding: "15px 0", borderRadius: 16,
            border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: 14, transition: "all 0.2s",
            background: isPremium ? "linear-gradient(90deg, #D93B2B, #FF5A47)" : "rgba(0,0,0,0.06)",
            color: isPremium ? "#fff" : "#555",
            boxShadow: isPremium ? "0 6px 20px rgba(217,59,43,0.35)" : "none",
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            if (isPremium) btn.style.background = "linear-gradient(90deg, #C03020, #E84A37)";
            else { btn.style.background = "rgba(0,0,0,0.1)"; btn.style.color = "#222"; }
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget as HTMLButtonElement;
            if (isPremium) btn.style.background = "linear-gradient(90deg, #D93B2B, #FF5A47)";
            else { btn.style.background = "rgba(0,0,0,0.06)"; btn.style.color = "#555"; }
          }}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

// ─── PaymentOption ────────────────────────────────────────────────────────────

function PaymentOption({
  selected, onSelect, icon, label,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        border: `1.5px solid ${selected ? "#D93B2B" : "#E8E8E8"}`,
        borderRadius: 14, padding: "14px 16px",
        cursor: "pointer", marginBottom: 10,
        transition: "border-color 0.15s",
      }}
    >
      <div style={{
        width: 20, height: 20, borderRadius: "50%",
        border: `2px solid ${selected ? "#D93B2B" : "#ccc"}`,
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "border-color 0.15s",
      }}>
        {selected && (
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#D93B2B" }} />
        )}
      </div>
      <div style={{
        width: 44, height: 28,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 15, fontWeight: 500, color: "#1A1410" }}>{label}</span>
    </div>
  );
}