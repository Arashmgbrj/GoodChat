"use client";

import React, { useEffect, useState, useRef } from "react";
import Script from "next/script";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./style1.css";

// رفع مشکل آیکون‌های پیش‌فرض Leaflet
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// کامپوننت نقشه
function MapComponent() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const position = [33.886653, 48.749667] as [number, number];

  if (!isClient) {
    return <div className="map-placeholder">در حال بارگذاری نقشه...</div>;
  }

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: "400px", width: "100%", borderRadius: "8px" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={defaultIcon}>
        <Popup>
          <strong>تیم Good</strong><br />
          بروجرد, خیابان چمران, بوستان 17, پلاک 19
        </Popup>
      </Marker>
    </MapContainer>
  );
}

const AboutPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [currentIndex, setCurrentIndex] = useState(3);
  const [isClient, setIsClient] = useState(false);
  const coverflowRef = useRef<HTMLDivElement>(null);
  const dotsContainerRef = useRef<HTMLDivElement>(null);

  // === توابع کمکی برای کوکی ===
  function getCookie(cname: string) {
    if (typeof document === "undefined") return "";
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let c of ca) {
      c = c.trim();
      if (c.indexOf(name) === 0) return c.substring(name.length);
    }
    return "";
  }

  function setCookie(cname: string, cvalue: string, exdays: number) {
    if (typeof document === "undefined") return;
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  // === کاروسل منطبق با React ===
  useEffect(() => {
    setIsClient(true);
    
    const updateCoverflow = () => {
      if (!coverflowRef.current) return;
      
      const items = coverflowRef.current.querySelectorAll(".coverflow-item") as NodeListOf<HTMLElement>;
      
      items.forEach((item, index) => {
        const offset = index - currentIndex;
        item.style.transform = `translateX(${offset * 220}px)`;
        item.style.opacity = index === currentIndex ? "1" : "0.5";
      });
    };

    updateCoverflow();
  }, [currentIndex]);

  // === ساخت دات‌ها ===
  useEffect(() => {
    if (!isClient || !dotsContainerRef.current || !coverflowRef.current) return;
    
    // پاک کردن دات‌های قبلی
    dotsContainerRef.current.innerHTML = "";
    
    const items = coverflowRef.current.querySelectorAll(".coverflow-item");
    
    items.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.className = "dot";
      if (index === currentIndex) {
        dot.classList.add("active");
      }
      dot.onclick = () => goToIndex(index);
      dotsContainerRef.current?.appendChild(dot);
    });
  }, [isClient, currentIndex]);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  const navigate = (direction: number) => {
    if (!coverflowRef.current) return;
    const items = coverflowRef.current.querySelectorAll(".coverflow-item");
    const newIndex = (currentIndex + direction + items.length) % items.length;
    setCurrentIndex(newIndex);
  };

  const toggleAutoplay = () => {
    console.log("Toggle autoplay");
  };

  // === تنظیم توابع global و اعتبارسنجی کاربر ===
  useEffect(() => {
    if (!isClient) return;

    (window as any).navigate = navigate;
    (window as any).toggleAutoplay = toggleAutoplay;
    (window as any).handleSubmit = (event: Event) => {
      event.preventDefault();
      console.log("Form submitted");
    };

    async function validateUser() {
      const token = getCookie("token");
      if (!token) {
        return;
      }

      try {
        const res = await axios.post("/api/users/aut/check_token", { token });
        if (res.status === 200) {
          setIsLogin(true);
          setEmail(res.data.user.email);
        }
      } catch (error) {
        console.error("Token validation failed:", error);
      }
    }

    validateUser();
  }, [isClient]);

  const hamber = () => {
    if (!isClient) return;
    const mobileNav = document.getElementsByClassName("mobile-nav")[0] as HTMLElement;
    if (mobileNav) {
      mobileNav.classList.toggle("active");
    }
  };

  const logout = () => {
    setCookie("token", "", 0);
    window.location.href = "/register";
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* === بارگذاری JS اصلی 3D Coverflow === */}
      <Script
        src="/js/templatemo-3d-coverflow-scripts.js"
        strategy="afterInteractive"
      />

      {/* === Header / Navbar === */}
      <header className="glass">
        <nav>
          <a
            href="/"
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "25px",
            }}
          >
            <div className="d-flex flex-column align-items-center">
              <span style={{ color: "#e254eddb" }}>GoodChat</span>
            </div>
          </a>

          <ul className="nav-links d-xl-flex d-none align-items-center">
            <li>
              <a href="/">خانه</a>
            </li>
            <li>
              <a href="/about">درباره ی ما</a>
            </li>

            {isLogin ? (
              <>
                <li>
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={logout}
                  >
                    <img src="/img/log-out.png" alt="" width={20} height={20} />
                  </div>
                </li>

                <li>
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src="/img/person.gif"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50px",
                      }}
                      alt="User"
                    />
                    <span
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "10px",
                      }}
                    >
                      {email}
                    </span>
                  </div>
                </li>
              </>
            ) : (
              <li>
                <a href="/register">ورود/عضویت</a>
              </li>
            )}
          </ul>

          <div className="mobile-menu-toggle" onClick={hamber}>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>
        </nav>

        <div className="mobile-nav">
          <a href="/">خانه</a>
          <a href="/about">درباره ی ما</a>

          {isLogin ? (
            <>
              <div
                className="d-flex flex-column align-items-center"
                style={{ cursor: "pointer" }}
                onClick={logout}
              >
                <img src="/img/log-out.png" alt="" width={20} height={20} />
              </div>

              <div
                className="d-flex flex-column align-items-center"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <img
                  src="/img/person.gif"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50px",
                  }}
                  alt="User"
                />
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "10px",
                  }}
                >
                  {email}
                </span>
              </div>
            </>
          ) : (
            <a
              href="/register"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ورود/عضویت
            </a>
          )}
        </div>
      </header>

      {/* === Home Section: 3D Coverflow === */}
      <section id="home" className="section">
        <div className="coverflow-wrapper">
          <div className="info">
            <h2 id="current-title">نمونه کارهای ما</h2>
            <p id="current-description">اعتماد شما باعث افتخار ما است</p>
          </div>

          <div className="coverflow-container" tabIndex={0}>
            <div className="coverflow" id="coverflow" ref={coverflowRef}>
              {["se", "se2", "se3", "se4"].map((name, index) => (
                <div className="coverflow-item" data-index={index} key={index}>
                  <div className="cover image-loading">
                    <img
                      src={`/images/${name}.png`}
                      alt={name.replace(/-/g, " ")}
                      loading="lazy"
                    />
                  </div>
                  <div className="reflection"></div>
                </div>
              ))}
            </div>

            <button
              className="nav-button prev"
              onClick={() => navigate(-1)}
            ></button>
            <button
              className="nav-button next"
              onClick={() => navigate(1)}
            ></button>

            <div className="dots-container" id="dots" ref={dotsContainerRef}></div>

            <button
              className="play-pause-button"
              id="playPauseBtn"
              onClick={toggleAutoplay}
            ></button>
          </div>
        </div>
      </section>

      {/* === About Section: تیم Good و اهداف === */}
      <section id="about" className="section">
        <div className="about-content">
          <div className="about-header">
            <h2>درباره تیم Good</h2>
            <p>
              تیم <strong>Good</strong> یک گروه جوان و متخصص در طراحی و توسعه وب
              و اپلیکیشن است. ما با دانش روز و تمرکز بر کیفیت، پروژه‌هایی امن و
              حرفه‌ای ارائه می‌دهیم.
            </p>
            <p>
              هدف ما ایجاد تجربه‌ای منحصربه‌فرد برای کاربران و ارائه راهکارهای
              آنلاین مطمئن و امن است. با پشتکار و شفافیت، مسیر رشد و توسعه را با
              قدرت ادامه می‌دهیم.
            </p>
          </div>

          <div className="about-main">
            <div className="about-visual">
              <div className="showcase-display">
                <div className="showcase-main">
                  <h3 className="showcase-title">خدمات ما</h3>
                  <p className="showcase-subtitle">
                    طراحی وبسایت، اپلیکیشن، فروشگاه آنلاین و درگاه‌های پرداخت
                    امن
                  </p>
                  <ul className="feature-list">
                    <li>ایجاد فروشگاه آنلاین با سیستم پرداخت امن</li>
                    <li>توسعه وبسایت واکنش‌گرا و حرفه‌ای</li>
                    <li>بهینه‌سازی تجربه کاربری و رابط کاربری (UX/UI)</li>
                    <li>پشتیبانی ۲۴/۷ و آموزش استفاده از سیستم‌ها</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="about-info enhanced">
              <h3>چرا مشتری‌ها و سازمان‌ها باید به ما اعتماد کنند؟</h3>

              <ul className="feature-list">
                <li>
                  ✅ <strong>تیم متخصص و باتجربه:</strong> توسعه نرم‌افزار و
                  امنیت اطلاعات با استانداردهای روز
                </li>
                <li>
                  ✅ <strong>تجربه موفق:</strong> پروژه‌های مشابه با رضایت کامل
                  مشتریان و سازمان‌ها
                </li>
                <li>
                  ✅ <strong>شفافیت مالی:</strong> مدیریت حرفه‌ای و گزارش‌دهی
                  دقیق
                </li>
                <li>
                  ✅ <strong>راهکارهای امن و قابل اعتماد:</strong> ارائه
                  سرویس‌ها و پرداخت‌های مطمئن
                </li>
                <li>
                  ✅ <strong>پشتیبانی فنی:</strong> پاسخگویی سریع و پشتیبانی
                  ۲۴/۷
                </li>
              </ul>

              <p className="trust-text">
                با اعتماد به تیم ما، شما به یک گروه متعهد و توانمند دسترسی پیدا
                می‌کنید که تجربه‌ای امن، مطمئن و حرفه‌ای برای کاربران و
                سازمان‌ها فراهم می‌کند.
              </p>

              <a
                href="#contact"
                className="cta-button"
                style={{ marginTop: "15px", display: "inline-block" }}
              >
                تماس با ما
              </a>
            </div>
          </div>
          <div className="stats-section chat-stats">
            {[
              { number: "Real-time", label: "پاسخگویی سریع" },
              { number: "99.9%", label: "در دسترس بودن" },
              { number: "AI-Powered", label: "هوش مصنوعی پیشرفته" },
              { number: "∞", label: "قابلیت شخصی‌سازی" },
            ].map((s, i) => (
              <div className="stat-item" key={i}>
                <div className="stat-number">{s.number}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* بخش اطلاعات تماس و نقشه */}
          <div
            className="contact-info-section"
            style={{ backgroundColor: "#161621" }}
          >
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div className="contact-content">
                  <h4>ایمیل</h4>
                  <p>info@good-chat-ai.ir </p>
                  <p>support@good-chat-ai.ir </p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-content">
                  <h4>تلفن‌های تماس</h4>
                  <p>0937-662-9881 (پشتیبانی)</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-content">
                  <h4>آدرس</h4>
                  <p>بروجرد, خیابان چمران, بوستان 17, پلاک 19</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🕒</div>
                <div className="contact-content">
                  <h4>ساعات کاری</h4>
                  <p>شنبه تا چهارشنبه: ۸:۰۰ - ۱۷:۰۰</p>
                  <p>پنجشنبه: ۸:۰۰ - ۱۴:۰۰</p>
                </div>
              </div>
            </div>
            
            <div className="map-section">
              <h4>موقعیت ما روی نقشه</h4>
              <div className="map-container">
                <MapComponent />
              </div>
            </div>
          </div>

       
        </div>
      </section>

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
                GoodTeam
            </a>{" "}
            | بهبود یافته با فناوری Good Chat AI |
          </div>
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
              />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AboutPage;