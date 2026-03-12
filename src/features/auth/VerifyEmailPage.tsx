// features/auth/VerifyEmailPage.tsx
import { useRef } from 'react';
import { useVerifyEmail } from './hooks/useVerifyEmail';
import { ROUTES } from '@/app/constants/router';
import { useNavigate } from 'react-router';
import LeftSidebarPart from './components/LeftSidebarPart';

const ChevronLeft = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
)

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const {
    email,
    otp,
    setOtp,
    isVerifying,
    isResending,
    isSuccess,
    handleVerify,
    handleResend,
  } = useVerifyEmail();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = otp.padEnd(6, '').split('').slice(0, 6);

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    const newOtp = newDigits.join('');

    // Only store actual digits, no padding
    setOtp(newOtp.replace(/\s/g, ''));

    // Move to next box
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 filled — pass newOtp directly to avoid stale state
    const cleanOtp = newOtp.replace(/\s/g, '');
    if (cleanOtp.length === 6 && /^\d{6}$/.test(cleanOtp)) {
      setTimeout(() => handleVerify(cleanOtp), 100);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = '';
        setOtp(newDigits.join('').replace(/ /g, ''));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setOtp(newDigits.join('').replace(/ /g, ''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    setOtp(pasted);
    const lastIdx = Math.min(pasted.length, 5);
    inputRefs.current[lastIdx]?.focus();
    if (pasted.length === 6 && /^\d{6}$/.test(pasted)) {
      setTimeout(() => handleVerify(pasted), 100);
    }
  };

  return (
    <div style={{
      display: "flex", height: "100vh", width: "100%",
      fontFamily: "'Plus Jakarta Sans', 'DM Sans', 'Helvetica Neue', sans-serif",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(229,62,62,0.25); }
          70% { box-shadow: 0 0 0 8px rgba(229,62,62,0); }
          100% { box-shadow: 0 0 0 0 rgba(229,62,62,0); }
        }
        .otp-input {
          width: 48px; height: 56px;
          border: 2px solid #f0f0f0;
          border-radius: 14px;
          background: #f9fafb;
          font-size: 22px; font-weight: 800;
          text-align: center;
          color: #0f0f0f;
          outline: none;
          transition: all 0.18s ease;
          font-family: inherit;
          caret-color: #e53e3e;
        }
        .otp-input:focus {
          border-color: #e53e3e;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(229,62,62,0.08);
        }
        .otp-input.filled {
          border-color: #e53e3e;
          background: #fff5f5;
          color: #e53e3e;
        }
        .otp-input.success {
          border-color: #10b981;
          background: #f0fdf4;
          color: #10b981;
          animation: pulse-ring 0.6s ease;
        }
        .resend-btn {
          background: none; border: none; cursor: pointer;
          color: #e53e3e; font-size: 13px; font-weight: 600;
          font-family: inherit; padding: 0;
          transition: opacity 0.15s;
        }
        .resend-btn:disabled { color: #d1d5db; cursor: not-allowed; }
        .resend-btn:hover:not(:disabled) { opacity: 0.75; }
      `}</style>

      {/* ── Left: White Form Panel ── */}
      <div style={{
        width: "50%", background: "#fff",
        display: "flex", flexDirection: "column",
        position: "relative", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 20% 80%, rgba(229,62,62,0.03) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        {/* Top bar */}
        <div style={{
          padding: "28px 48px",
          display: "flex", alignItems: "center",
          position: "relative", zIndex: 1,
        }}>
          <button
            onClick={() => navigate(`${ROUTES.AUTH.LOGIN_1}?direct=1`)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#9ca3af", fontSize: "12px", fontFamily: "inherit",
              fontWeight: 600, display: "flex", alignItems: "center", gap: "5px",
              padding: "6px 0", transition: "color 0.15s", letterSpacing: "0.01em",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#374151")}
            onMouseLeave={e => (e.currentTarget.style.color = "#9ca3af")}
          >
            <ChevronLeft />
            Kembali ke Login
          </button>
        </div>

        {/* Form area — centered */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "0 72px",
          position: "relative", zIndex: 1,
        }}>
          <div style={{ maxWidth: "340px", width: "100%", margin: "0 auto", animation: "fadeUp 0.4s ease both" }}>

            {/* Icon */}
            <div style={{
              width: "52px", height: "52px", borderRadius: "16px",
              background: "#fff5f5", display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: "24px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>

            <h1 style={{
              fontSize: "26px", fontWeight: 800, letterSpacing: "-0.8px",
              color: "#0f0f0f", lineHeight: 1.2, marginBottom: "8px",
            }}>
              {isSuccess ? "Email terverifikasi! 🎉" : "Cek email Anda"}
            </h1>
            <p style={{ fontSize: "14px", color: "#9ca3af", fontWeight: 400, lineHeight: 1.6, marginBottom: "32px" }}>
              {isSuccess
                ? "Mengarahkan ke halaman login..."
                : <>Kami mengirim kode 6 digit ke <strong style={{ color: "#374151" }}>{email || "email kamu"}</strong>. Masukkan kode di bawah.</>
              }
            </p>

            {/* OTP Boxes */}
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "28px" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  className={`otp-input${isSuccess ? " success" : digits[i] && digits[i] !== ' ' ? " filled" : ""}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digits[i] && digits[i] !== ' ' ? digits[i] : ''}
                  onChange={e => handleDigitChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  onFocus={e => e.target.select()}
                  disabled={isVerifying || isSuccess}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {/* Loading indicator */}
            {isVerifying && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "8px", marginBottom: "16px",
                color: "#9ca3af", fontSize: "13px", fontWeight: 500,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
                  </path>
                </svg>
                Memverifikasi...
              </div>
            )}

            {/* Resend */}
            <p style={{ fontSize: "13px", color: "#9ca3af", textAlign: "center" }}>
              Tidak dapat kode?{" "}
              <button
                className="resend-btn"
                onClick={handleResend}
                disabled={isResending || isSuccess || !email}
              >
                {isResending ? "Mengirim..." : "Kirim ulang"}
              </button>
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ padding: "20px 48px 28px", textAlign: "center", position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "11px", color: "#d1d5db", lineHeight: 1.7 }}>
            Kode berlaku selama 10 menit. Periksa folder spam jika tidak menerima email.
          </p>
        </div>
      </div>

      {/* ── Right: Brand Panel ── */}
      <div style={{ width: "50%", position: "relative", overflow: "visible", flexShrink: 0 }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(145deg, #ffe5e5 0%, #ffc7c7 40%, #ffaaaa 70%, #ff8888 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 55% 35%, rgba(255,255,255,0.5) 0%, transparent 60%)",
        }} />
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: "-80px", width: "160px",
          background: "linear-gradient(to right, #fff 0%, #fff8f8 35%, rgba(255,232,232,0.6) 65%, transparent 100%)",
          zIndex: 2, pointerEvents: "none",
        }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <LeftSidebarPart />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;