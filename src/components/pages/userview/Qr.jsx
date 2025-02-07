import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavigationButton } from "../../../style/jsx/button";
import "../../../style/background_picture.css";

const Qr = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { photoUrl } = location.state || {};
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    console.log("전달된된 photoUrl:", photoUrl);
    if (photoUrl) {
      const googleChartAPI = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        photoUrl
      )}&size=200x200`;
      setQrCodeUrl(googleChartAPI);
    }
  }, [photoUrl]);

  return (
    <div className="start-page">
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>QR Code</h1>
        {qrCodeUrl ? (
          <img src={qrCodeUrl} alt="QR Code" />
        ) : (
          <p>QR 코드를 생성할 수 없습니다.</p>
        )}
        <NavigationButton onClick={() => navigate("/userview/last")}>
          Next
        </NavigationButton>
      </div>
    </div>
  );
};

export default Qr;
