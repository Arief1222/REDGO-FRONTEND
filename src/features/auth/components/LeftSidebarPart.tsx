import Bgimg from "/src/assets/images/logos/logo-icon.svg";
import { Button } from 'src/shared/components/theme-ui';

const LeftSidebarPart = () => {
  return (
    <>
      {/* Background decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "10%",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          height: "100%",
          padding: "0 56px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Logo / Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "48px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "white",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={Bgimg} alt="logo" style={{ width: "22px", height: "22px" }} />
          </div>
          <span
            style={{
              color: "white",
              fontWeight: 800,
              fontSize: "20px",
              letterSpacing: "-0.5px",
            }}
          >
            RedGo <span style={{ fontWeight: 400, opacity: 0.85 }}>AI</span>
          </span>
        </div>

        {/* Headline */}
        <h2
          style={{
            color: "white",
            fontSize: "42px",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-1px",
            marginBottom: "20px",
            maxWidth: "420px",
          }}
        >
          Diskusikan{" "}
          <span
            style={{
              fontStyle: "italic",
              color: "rgba(255,255,255,0.75)",
            }}
          >
            bisnis
          </span>{" "}
          dengan lebih{" "}
          <span
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            Terstruktur
            <span
              style={{
                position: "absolute",
                bottom: "2px",
                left: 0,
                width: "100%",
                height: "3px",
                background: "rgba(255,255,255,0.4)",
                borderRadius: "2px",
              }}
            />
          </span>
        </h2>

        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: "15px",
            lineHeight: 1.7,
            maxWidth: "380px",
            marginBottom: "36px",
            fontWeight: 400,
          }}
        >
          RedGo AI bersama Anda mengurai ide, strategi, dan keputusan.
          Mulai strukturkan bisnis tanpa distraksi.
        </p>

        <Button
          className="mt-2"
          color={"primary"}
          style={{
            background: "white",
            color: "#e53e3e",
            fontWeight: 700,
            fontSize: "15px",
            padding: "12px 32px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          Mulai Sekarang
        </Button>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "40px",
            marginTop: "52px",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: "32px",
            width: "100%",
            maxWidth: "420px",
          }}
        >
          <div>
            <p
              style={{
                color: "white",
                fontWeight: 800,
                fontSize: "26px",
                letterSpacing: "-0.5px",
                lineHeight: 1,
                marginBottom: "4px",
              }}
            >
              800+
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: 500 }}>
              bisnis telah bergabung
            </p>
          </div>
          <div>
            <p
              style={{
                color: "white",
                fontWeight: 800,
                fontSize: "26px",
                letterSpacing: "-0.5px",
                lineHeight: 1,
                marginBottom: "4px",
              }}
            >
              5×
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: 500 }}>
              lebih cepat ambil keputusan
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeftSidebarPart;