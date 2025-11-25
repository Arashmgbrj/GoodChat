"use client";
import Link from "next/link";
import { useEffect } from "react";
import "./notfoundstyle.css";
import "./style.css";

export default function NotFound() {
  useEffect(() => {
    document.title = "صفحه پیدا نشد | GoodChat";
  }, []);

  return (
    <>
      {/* Epic Neural Background */}
      <div className="neural-background"></div>

      {/* Floating Geometric Shapes */}
      <div className="geometric-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      {/* Neural Network Lines */}
      <div className="neural-lines">
        <div className="neural-line"></div>
        <div className="neural-line"></div>
        <div className="neural-line"></div>
      </div>

      {/* Header */}
      <header className="glass">
        <nav>
          <Link href="/" className="logo">
            <svg
              className="logo-icon"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="logoGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" style={{ stopColor: "#e0a3ff" }} />
                  <stop offset="50%" style={{ stopColor: "#ff69b4" }} />
                  <stop offset="100%" style={{ stopColor: "#9370db" }} />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="30"
                r="8"
                fill="url(#logoGradient)"
                opacity="0.8"
              />
              <circle
                cx="30"
                cy="60"
                r="6"
                fill="url(#logoGradient)"
                opacity="0.6"
              />
              <circle
                cx="70"
                cy="65"
                r="7"
                fill="url(#logoGradient)"
                opacity="0.7"
              />
              <line
                x1="50"
                y1="30"
                x2="30"
                y2="60"
                stroke="url(#logoGradient)"
                strokeWidth="2"
              />
              <line
                x1="50"
                y1="30"
                x2="70"
                y2="65"
                stroke="url(#logoGradient)"
                strokeWidth="2"
              />
              <line
                x1="30"
                y1="60"
                x2="70"
                y2="65"
                stroke="url(#logoGradient)"
                strokeWidth="2"
              />
            </svg>
            <div className="d-flex flex-column align-items-center">
              <span>GoodChat</span>
              <span style={{ fontSize: "10px" }}>چت زیبا</span>
            </div>
          </Link>
        </nav>
      </header>

      {/* 404 Section */}
      <section
        className="hero glass"
        style={{
          direction: "rtl",
          textAlign: "center",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: "50px 20px",
        }}
      >
        <h1
          style={{ fontSize: "80px", marginBottom: "10px", color: "#ff69b4" }}
        >
          ۴۰۴
        </h1>
        <h2 style={{ marginBottom: "20px" }}>صفحه مورد نظر یافت نشد 😔</h2>
        <p style={{ maxWidth: "500px", opacity: 0.8, marginBottom: "30px" }}>
          متأسفیم! صفحه‌ای که به دنبال آن هستید وجود ندارد یا ممکن است حذف شده
          باشد.
        </p>

        <div className="cta-buttons">
          <Link href="/" className="cta-button">
            بازگشت به خانه
          </Link>
          <Link href="/chat" className="cta-button secondary">
            رفتن به گفت‌وگو
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-copyright">
            <p>© ۲۰۲۵ Good Chat — تمامی حقوق محفوظ است.</p>
          </div>

          <div className="footer-design">
            طراحی توسط{" "}
            <a
              href="http://arash-moazami-goodarzi.ir/"
              target="_blank"
              rel="noopener noreferrer"
            >
              آرش معظمی گودرزی
            </a>{" "}
            | بهبود یافته با فناوری Good Chat AI |
          </div>

          {/* 🌟 نماد اعتماد الکترونیکی */}
          <div style={{ marginTop: "10px" }}>
            <a
              referrerPolicy="origin"
              target="_blank"
              href="https://trustseal.enamad.ir/?id=659244&Code=jtfCX1mE59GI4Rf0wdVGkUoxNHZmgpgS"
            >
              <img
                referrerPolicy="origin"
                src="https://trustseal.enamad.ir/logo.aspx?id=659244&Code=jtfCX1mE59GI4Rf0wdVGkUoxNHZmgpgS"
                alt="نماد اعتماد الکترونیکی"
                style={{ cursor: "pointer", width: "120px", height: "auto" }}
                data-code="jtfCX1mE59GI4Rf0wdVGkUoxNHZmgpgS"
              />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
