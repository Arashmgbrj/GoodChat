'use client'

import { useState } from "react";

export default function IpAlert() {
  const [ips, setIps] = useState([
    "192.168.1.10",
    "192.168.1.15",
    "192.168.1.20",
  ]);

  const [selectedIp, setSelectedIp] = useState<string | null>(null);

  const handleDelete = () => {
    if (selectedIp) {
      setIps(ips.filter((ip) => ip !== selectedIp));
      setSelectedIp(null);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(119, 47, 58, 0.85)",
        padding: "30px 40px",
        width: "400px",
        borderRadius: "20px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
        color: "#fff",
        fontFamily: "Inter, sans-serif",
        zIndex: 10000,
        textAlign: "center",
      }}
    >
      <h3 style={{ marginBottom: "15px", fontSize: "18px" }}>⚠️ هشدار</h3>
      <p style={{ marginBottom: "15px", lineHeight: "1.5" }}>
        بیش از 3 IP به این سیستم وصل هستند. لطفاً یکی را حذف کنید.
      </p>
      <ul style={{ textAlign: "left", paddingLeft: "20px", marginBottom: "20px" }}>
        {ips.map((ip) => (
          <li key={ip} style={{ marginBottom: "8px",listStyle:'none' }}>
            <label>
              <input
                type="radio"
                name="selectedIp"
                value={ip}
                checked={selectedIp === ip}
                onChange={() => setSelectedIp(ip)}
                style={{ marginRight: "8px" }}
              />
              {ip}
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={handleDelete}
        disabled={!selectedIp}
        style={{
          backgroundColor: selectedIp ? "#ff4b2b" : "#888",
          border: "none",
          padding: "10px 20px",
          borderRadius: "12px",
          color: "#fff",
          fontWeight: "600",
          cursor: selectedIp ? "pointer" : "not-allowed",
          transition: "0.3s",
        }}
      >
        حذف IP انتخاب شده
      </button>
    </div>
  );
}
