"use client";

import axios from "axios";
import { log } from "console";
import { link } from "fs";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

import "./style.css";
import { text } from "stream/consumers";
import Link from "next/link";
const NeuralGlass = () => {
  const [is_login, set_is_login] = useState(false);
  const [email, set_email] = useState("");
  const [name, setName] = useState("");
  const [email_form, setEmail_form] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [send_email, set_send_email] = useState(false);
  function getCookie(cname: string) {
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
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  useEffect(() => {
    async function validateAlready() {
      const token = getCookie("token");
      if (token) {
        try {
          const res = await axios.post("/api/users/aut/check_token", { token });
          if (res.status === 200) {
            set_is_login(true);
            set_email(res.data["user"]["email"]);
          } else set_is_login(false);
        } catch {
          set_is_login(false);
        }
      } else set_is_login(false);
    }
    validateAlready();
  }, []);

  const logout = () => {
    setCookie("token", "", 0);
    window.location.href = "/register";
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    set_send_email(true);

    const formData = {
      name,
      email_form,
      subject,
      message,
    };
    if (name && email_form && subject && message) {
      try {
        const response = await axios.post("/api/contact", { formData });

        if (response.status === 200) {
          alert("پیام شما ثبت شد");
          set_send_email(false);
        }
      } catch (error) {
        alert("خطا در ارسال فرم");
        set_send_email(false);
      }
    } else {
      alert("مقادیر باید پرشوند");
      set_send_email(false);
    }

    setName("");
    setEmail_form("");
    setSubject("");
    setMessage("");
    set_send_email(false);
  };
  const hamber = () => {
    const classnameh =
      document.getElementsByClassName("mobile-nav")[0].className;
    if (classnameh.includes("active")) {
      document
        .getElementsByClassName("mobile-nav")[0]
        .classList.remove("active");
    } else {
      document.getElementsByClassName("mobile-nav")[0].classList.add("active");
    }
  };

  return (
    <>
      <div>
        <div className="neural-background"></div>

        <div className="geometric-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>

        <div className="neural-lines">
          <div className="neural-line"></div>
          <div className="neural-line"></div>
          <div className="neural-line"></div>
        </div>

        {/* Header */}
        <header className="glass">
          <nav>
            <a href="#home" className="logo">
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
                >
                  <animate
                    attributeName="opacity"
                    values="0.8;1;0.8"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx="30"
                  cy="60"
                  r="6"
                  fill="url(#logoGradient)"
                  opacity="0.6"
                >
                  <animate
                    attributeName="opacity"
                    values="0.6;1;0.6"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx="70"
                  cy="65"
                  r="7"
                  fill="url(#logoGradient)"
                  opacity="0.7"
                >
                  <animate
                    attributeName="opacity"
                    values="0.7;1;0.7"
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                </circle>
                <line
                  x1="50"
                  y1="30"
                  x2="30"
                  y2="60"
                  stroke="url(#logoGradient)"
                  strokeWidth="2"
                  opacity="0.6"
                >
                  <animate
                    attributeName="opacity"
                    values="0.6;1;0.6"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </line>
                <line
                  x1="50"
                  y1="30"
                  x2="70"
                  y2="65"
                  stroke="url(#logoGradient)"
                  strokeWidth="2"
                  opacity="0.6"
                >
                  <animate
                    attributeName="opacity"
                    values="0.6;1;0.6"
                    dur="2.2s"
                    repeatCount="indefinite"
                  />
                </line>
                <line
                  x1="30"
                  y1="60"
                  x2="70"
                  y2="65"
                  stroke="url(#logoGradient)"
                  strokeWidth="2"
                  opacity="0.6"
                >
                  <animate
                    attributeName="opacity"
                    values="0.6;1;0.6"
                    dur="2.8s"
                    repeatCount="indefinite"
                  />
                </line>
              </svg>
              <div className="d-flex flex-column align-items-center">
                <span>GoodChat</span>
                <span style={{ fontSize: "10px" }}>چت زیبا</span>
              </div>
            </a>
            <ul className="nav-links d-xl-flex d-none align-items-center">
              <li>
                <a href="#features">قابلیت‌ها</a>
              </li>
              <li>
                <a href="#pricing">تعرفه ها</a>
              </li>

              <li>
                <a href="#contact">تماس با ما</a>
              </li>
              <li>
                <a href="/chat">صفحه چت...</a>
              </li>
              <li>
                <a href="/about"> درباره ی ما</a>
              </li>

              <li>
                {is_login ? (
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      logout();
                    }}
                  >
                    <img src="/img/log-out.png" alt="" width={20} height={20} />
                  </div>
                ) : null}
              </li>
              <li>
                {is_login ? (
                  <div
                    className="d-flex flex-column align-items-center"
                    style={{ cursor: "pointer",display:'flex',alignItems:'center',flexDirection:'column' }}
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
                ) : (
                  <a href="/register">ورود/عضویت</a>
                )}
              </li>
            </ul>
            <div className="mobile-menu-toggle" onClick={hamber}>
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
              <div className="hamburger-line"></div>
            </div>
          </nav>

          <div className="mobile-nav">
            <a href="#features">قابلیت‌ها</a>
            <a href="#pricing">تعرفه ها</a>
            <a href="/chat">صفحه چت ..</a>
            <a href="#contact">تماس با ما </a>
            <a href="/about"> درباره ی ما</a>

            <li>
              {is_login ? (
                <div
                  className="d-flex flex-column align-items-center"
                  style={{ cursor: "pointer",display:'flex',alignItems:'center',justifyContent:'center' }}
                  onClick={() => {
                    logout();
                  }}
                >
                  <img src="/img/log-out.png" alt="" width={20} height={20} />
                </div>
              ) : null}
            </li>
            <li>
              {is_login ? (
                <div
                  className="d-flex flex-column align-items-center"
                  style={{ cursor: "pointer",display:'flex',alignItems:'center',justifyContent:'center' ,flexDirection:'column' }}
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
              ) : (
                <a href="/register" style={{display:'flex',alignItems:'center',justifyContent:'center' }}>ورود/عضویت</a>
              )}
            </li>
          </div>
        </header>

        {/* 🌟 سئوی صفحه با Helmet */}
        <Helmet>
          <title>GoodChat | چت جی‌پی‌تی فارسی | چت بات هوش مصنوعی ایرانی</title>
          <meta
            name="description"
            content="GoodChat، اولین چت جی‌پی‌تی فارسی با هوش مصنوعی ایرانی است. با چت‌بات فارسی ما به زبان طبیعی گفتگو کنید، پاسخ‌های سریع و دقیق بگیرید و از تجربه هوش مصنوعی لذت ببرید."
          />
          <meta
            name="keywords"
            content="goodchat, چت جی پی تی فارسی, chat gpt فارسی, چت‌بات ایرانی, هوش مصنوعی فارسی, gpt ایرانی, چت با هوش مصنوعی, چت جی پی تی ایران"
          />
          <meta name="robots" content="index, follow" />
          <meta property="og:title" content="GoodChat - چت جی‌پی‌تی فارسی" />
          <meta
            property="og:description"
            content="چت جی‌پی‌تی فارسی با هوش مصنوعی ایرانی؛ پاسخ‌های طبیعی، سریع و دقیق با GoodChat."
          />
          <meta property="og:image" content="/img/gpt.jpg" />
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="fa_IR" />
          <link rel="canonical" href="https://goodchat.ir/" />
        </Helmet>

        {/* Section 1: Hero */}
        <section className="hero" id="home">
          <div className="hero-content">
            <div className="hero-subtitle">
              مدل قدرتمند GPT در ایران؛ تجربه یک <strong>چت بات فارسی</strong>{" "}
              با <strong>GoodChat</strong>
            </div>

            <h1>چت جی‌پی‌تی فارسی | چت‌بات ایرانی هوشمند</h1>

            <div className="hero-description">
              <p>
                با <strong>چت جی پی تی فارسی GoodChat</strong>، تجربه‌ای طبیعی و
                هوشمند از گفتگو به زبان فارسی داشته باشید. این{" "}
                <strong>چت بات ایرانی</strong> به شما کمک می‌کند تا با{" "}
                <strong>هوش مصنوعی فارسی</strong> تعامل کنید و پاسخ‌های دقیق و
                سریع دریافت کنید.
              </p>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">99.9%</span>
                <span className="hero-stat-label">دقت پاسخ‌ها</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">∞</span>
                <span className="hero-stat-label">قدرت پردازش</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">0.001</span>
                <span className="hero-stat-label">تاخیر (ms)</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">24/7</span>
                <span className="hero-stat-label">دسترسی همیشگی</span>
              </div>
            </div>

            <div className="cta-buttons">
              <a href="/chat" className="cta-button">
                شروع گفتگو با چت جی‌پی‌تی فارسی
              </a>
              <a href="#features" className="cta-button secondary">
                مشاهده قابلیت‌ها
              </a>
            </div>
          </div>
        </section>

        {/* Section 2: Features */}
        <section className="features" id="features">
          <div className="features-container">
            <h2 className="section-title">
              قابلیت‌های <strong>چت جی‌پی‌تی فارسی GoodChat</strong>
            </h2>

            <div className="diagonal-grid">
              {/* Feature 1 */}
              <div className="feature-row">
                <div className="feature-content glass">
                  <div className="feature-icon">🧠</div>
                  <h3>پردازش هوشمند زبان فارسی</h3>
                  <p>
                    <strong>چت‌بات فارسی GoodChat</strong> با مدل‌های GPT
                    پیشرفته، پاسخ‌هایی طبیعی و هوشمند ارائه می‌دهد و گفتگوها را
                    برای هر کاربر شخصی‌سازی می‌کند.
                  </p>
                </div>
                <div
                  className="feature-visual glass"
                  style={{
                    backgroundImage: `url('/img/gpt.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "300px",
                    height: "200px",
                  }}
                ></div>
              </div>

              {/* Feature 2 */}
              <div className="feature-row">
                <div className="feature-content glass">
                  <div className="feature-icon">⚡</div>
                  <h3>سرعت پاسخگویی بی‌نظیر</h3>
                  <p>
                    الگوریتم‌های بهینه‌ی <strong>GoodChat</strong> باعث می‌شوند{" "}
                    <strong>چت جی پی تی فارسی</strong> در کسری از ثانیه پاسخ
                    دهد، بدون هیچ‌گونه تأخیری در گفتگو.
                  </p>
                </div>
                <div
                  className="feature-visual glass"
                  style={{
                    backgroundImage: `url('/img/speed.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "300px",
                    height: "200px",
                  }}
                ></div>
              </div>

              {/* Feature 3 */}
              <div className="feature-row">
                <div className="feature-content glass">
                  <div className="feature-icon">🌐</div>
                  <h3>چت در موضوعات گوناگون</h3>
                  <p>
                    <strong>چت جی‌پی‌تی ایرانی GoodChat</strong> می‌تواند به
                    صورت هوشمند در زمینه‌های مختلف مانند آموزش، برنامه‌نویسی و
                    مشاوره پاسخ دهد.
                  </p>
                </div>
                <div
                  className="feature-visual glass"
                  style={{
                    backgroundImage: `url('/img/maintance.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "300px",
                    height: "200px",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Pricing */}
        <section className="pricing" id="pricing">
          <h2 className="section-title">تعرفه‌های چت‌بات فارسی GoodChat</h2>
          <div className="pricing-container">
            <div className="timeline-line"></div>

            {[
              {
                plan: "پایه",
                title: "Basic Plan",

                text: "دسترسی محدود به چت‌بات فارسی، پاسخگویی سریع و تجربه اولیه هوش مصنوعی ایرانی.",
                req:'100 درخواست',
                price: "100,000تومان ",
              },
              {
                plan: "استاندارد",
                title: "Standard Plan",
                text: "پردازش پیشرفته متن، پاسخ سریع‌تر و پشتیبانی از چند موضوع همزمان.",
                req:'200 درخواست',
                price: "200,000 تومان  ",
              },
              {
                plan: "حرفه‌ای",
                title: "Pro Plan",
                text: "پاسخ‌های شخصی‌سازی شده، سرعت بالا و تعامل چندکاربره.",
                req:'300 درخواست',

                price: "300,000 تومان",
              },
       
              {
                plan: "ultra",
                title: "ultra Plan",
                text: "پاسخ‌های شخصی‌سازی شده، سرعت بالا و تعامل چندکاربره.",
                req:'400 درخواست',

                price: "400,000 تومان",
              },
       
              {
                plan: "legend",
                title: "legend Plan",
                text: "پاسخ‌های شخصی‌سازی شده، سرعت بالا و تعامل چندکاربره.",
                req:'500 درخواست',

                price: "500,000 تومان",
              },
       
            ].map((p, i) => (
              <Link href={'/payment'}>

              
                 <div key={i} className="timeline-item" style={{display:'flex',alignItems:'center',flexDirection:'column'}}>
                       <div className="timeline-content glass">
                         <div className="timeline-year">{p.plan}</div>
                         <h4>{p.title}</h4>
                         <h4>{p.req}</h4>
                         <p>{p.text}</p>
                         <p>
                           <strong>قیمت: {p.price}</strong>
                         </p>
                       </div>
                       <div className="timeline-dot"></div>
                     </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 4: Contact */}
        <section className="contact" id="contact">
          <div className="contact-container">
            <div className="contact-info glass">
              <h3>ارتباط با GoodChat</h3>
              <p>
                اگر آماده‌ی ورود به دنیای <strong>چت جی پی تی فارسی</strong>{" "}
                هستید، تیم پشتیبانی GoodChat همیشه در کنار شماست.
              </p>
              <div className="social-links">
                <a href="#" className="glass">
                  📡
                </a>
                <a href="#" className="glass">
                  🌐
                </a>
                <a href="#" className="glass">
                  💬
                </a>
                <a href="#" className="glass">
                  📨
                </a>
              </div>
            </div>

            <form className="contact-form glass" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="نام شما"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  placeholder="ایمیل شما"
                  value={email_form}
                  onChange={(e) => setEmail_form(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="موضوع پیام"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <textarea
                  rows={5}
                  placeholder="متن پیام شما"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              {send_email ? (
                <span className="submit-btn">درحال ارسال...</span>
              ) : (
                <button type="submit" className="submit-btn">
                  ارسال پیام
                </button>
              )}
            </form>
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
      </div>
    </>
  );
};

export default NeuralGlass;
