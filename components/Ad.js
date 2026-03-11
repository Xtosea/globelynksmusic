// components/Ad.js
import { useEffect } from "react";

export default function Ad({ adId, scriptSrc, title = "💰 Sponsored" }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = scriptSrc;

    const adDiv = document.getElementById(`container-${adId}`);
    if (adDiv) adDiv.appendChild(script);

    return () => {
      if (adDiv) adDiv.innerHTML = ""; // Cleanup
    };
  }, [adId, scriptSrc]);

  return (
    <div className="card" style={{ textAlign: "center" }}>
      <h2>{title}</h2>
      <div id={`container-${adId}`} />
    </div>
  );
}