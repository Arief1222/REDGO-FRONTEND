// features/auth/components/LeftSidebarPart.tsx
import Maskot from "/redgo.jpg";

const LeftSidebarPart = () => {
  return (
    <img
      src={Maskot}
      alt="Ready maskot"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center 20%",
      }}
    />
  );
};

export default LeftSidebarPart;