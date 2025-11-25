"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import "./style.css";
import Link from "next/link";

const NeuralGlass = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const plans = [
    {
      id: 1,
      plan: "پایه",
      title: "Basic Plan",
      text: "دسترسی محدود به چت‌بات فارسی، پاسخگویی سریع و تجربه اولیه هوش مصنوعی ایرانی.",
      req: "100 درخواست",
      price: "100,000تومان",
    },
    {
      id: 2,
      plan: "استاندارد",
      title: "Standard Plan",
      text: "پردازش پیشرفته متن، پاسخ سریع‌تر و پشتیبانی از چند موضوع همزمان.",
      req: "200 درخواست",
      price: "200,000 تومان",
    },
    {
      id: 3,
      plan: "حرفه‌ای",
      title: "Pro Plan",
      text: "پاسخ‌های شخصی‌سازی شده، سرعت بالا و تعامل چندکاربره.",
      req: "300 درخواست",
      price: "300 تومان",
    },
    {
      id: 4,
      plan: "اولترا",
      title: "Ultra Plan",
      text: "پاسخ‌های شخصی‌سازی شده، سرعت بالا و تعامل چندکاربره.",
      req: "400 درخواست",
      price: "400,000 تومان",
    },
    {
      id: 5,
      plan: "لجند",
      title: "legend Plan",
      text: "پاسخ‌های شخصی‌سازی شده، سرعت بالا و تعامل چندکاربره.",
      req: "500 درخواست",
      price: "500,000 تومان",
    },
  ];

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
    async function validateUser() {
      const token = getCookie("token");
      if (!token) {
        window.location.href = "/register";
        return;
      }

      try {
        const res = await axios.post("/api/users/aut/check_token", { token });
        if (res.status === 200) {
          setIsLogin(true);
          setEmail(res.data.user.email);
        } else {
          window.location.href = "/register";
        }
      } catch {
        window.location.href = "/register";
      }
    }

    async function checkPayment() {
      const token = getCookie("token");
      if (!token) {
        setHasActivePlan(false);
        return;
      }

      try {
        const res = await axios.post("/api/payment/check", { token });
        if (res.status === 200) {
          setHasActivePlan(true);
        } else {
          setHasActivePlan(false);
        }
      } catch {
        setHasActivePlan(false);
      }
    }

    validateUser();
    checkPayment();
  }, []);

  const logout = () => {
    setCookie("token", "", 0);
    window.location.href = "/register";
  };

  const hamber = () => {
    const mobileNav = document.getElementsByClassName("mobile-nav")[0];
    mobileNav.classList.toggle("active");
  };

  const handlePlanClick = async (plan: any) => {
    setSelectedPlan(plan);
    setShowModal(true);

    try {
      const token = getCookie("token");
      const res = await axios.post("/api/payment/paying", {
        token,
        plane: plan.id,
      });
      if (res.status === 200) {
        // هدایت به درگاه پرداخت
        window.location.href = res.data.payment_url;
      }
    } catch (error: any) {
      console.error("Payment request error:", error);
      alert("خطا در ایجاد پرداخت. دوباره تلاش کنید.");
    }
  };

  return (
    <>
      {/* Backgrounds */}
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
            <div className="d-flex flex-column align-items-center">
              <span>GoodChat</span>
              <span style={{ fontSize: "10px" }}>چت زیبا</span>
            </div>
          </a>
          <ul className="nav-links d-xl-flex d-none align-items-center">
            <li>
              <a href="/">خانه</a>
            </li>
            {isLogin && (
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
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <img
                      src="/img/person.gif"
                      style={{ width: "30px", height: "30px", borderRadius: "50px" }}
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
            )}
            {!isLogin && (
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
          {isLogin && (
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
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <img
                  src="/img/person.gif"
                  style={{ width: "30px", height: "30px", borderRadius: "50px" }}
                  alt="User"
                />
                <span style={{ color: "white", fontWeight: "bold", fontSize: "10px" }}>
                  {email}
                </span>
              </div>
            </>
          )}
          {!isLogin && (
            <a href="/register" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              ورود/عضویت
            </a>
          )}
        </div>
      </header>

      {/* Pricing Section */}
      {hasActivePlan ? (
        <section className="pricing" id="pricing">
          <h2 className="section-title">تعرفه‌ها</h2>
          <div className="pricing-container" style={{display:'flex' ,flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <div className="timeline-line"></div>
            {plans.map((p, i) => (
              <div
                key={i}
                className="timeline-item"
                style={{ display: "flex", flexDirection: "column", cursor: "pointer" }}
                onClick={() => handlePlanClick(p)}
              >
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
            ))}
          </div>
        </section>
      ) : (
        <div style={{ marginTop: "40%", textAlign: "center" }}>
          <h3 style={{ color: "white" }}>
            پلن شما فعال است و هنوز تمام نشده لطفا به صفحه چت برگردید
          </h3>
          <Link href="/chat" className="glass-btn">
            برگشت به صفحه چت
          </Link>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedPlan && (
        <div className="modal-overlay" style={{display:'flex',alignItems:'center',justifyContent:'center'}} onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>اطلاعات پلن</h2>
            <p>
              <strong>نام پلن:</strong> {selectedPlan.plan}
            </p>
            <p>
              <strong>عنوان:</strong> {selectedPlan.title}
            </p>
            <p>
              <strong>تعداد درخواست:</strong> {selectedPlan.req}
            </p>
            <p>
              <strong>قیمت:</strong> {selectedPlan.price}
            </p>
            <p>
              <strong>توضیحات:</strong> {selectedPlan.text}
            </p>
            <button onClick={() => setShowModal(false)}>درحال انتقال به صفحه پرداخت </button>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-copyright">
            <p>© ۲۰۲۵ Good Chat — تمامی حقوق محفوظ است.</p>
          </div>
          <div className="footer-design">
            طراحی توسط{" "}
            <a href="http://arash-moazami-goodarzi.ir/" target="_blank" rel="noopener noreferrer">
              آرش معظمی گودرزی
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

      {/* Modal CSS */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 10px;
          width: 90%;
          max-width: 400px;
          text-align: right;
        }
        .modal-content button {
          margin-top: 10px;
          padding: 5px 10px;
          border: none;
          background: #9370db;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default NeuralGlass;
