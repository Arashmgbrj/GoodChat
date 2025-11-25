"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import axios from "axios";

const Page: React.FC = () => {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [ips, setIps] = useState<string[]>([]);
  const [timer, setTimer] = useState(0);
  const [isIpProblem, setIsIpProblem] = useState(false);
  const [selectedIp, setSelectedIp] = useState<string | null>(null);

  const router = useRouter();

  // Refs ربات
  const cardRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const pupilLRef = useRef<HTMLDivElement>(null);
  const pupilRRef = useRef<HTMLDivElement>(null);
  const armLRef = useRef<HTMLDivElement>(null);
  const armRRef = useRef<HTMLDivElement>(null);
  const legLRef = useRef<HTMLDivElement>(null);
  const legRRef = useRef<HTMLDivElement>(null);
  const antennaRef = useRef<HTMLDivElement>(null);
  const mouthPathRef = useRef<SVGPathElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // تایمر ارسال مجدد
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // بررسی token موجود
  useEffect(() => {
    async function validateAlready() {
      const token = getCookie("token");
      if (!token) {
         console.log('');
        return;
      }
      try {
        const res = await axios.post("/api/users/aut/check_token", { token });
        if (res.status === 200) window.location.href = "/payment";
        else console.log('');
      } catch {
         console.log('');
      }
    }
    validateAlready();
  }, []);

  function setCookie(cname: string, cvalue: string, exdays: number) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    document.cookie = `${cname}=${cvalue};expires=${d.toUTCString()};path=/`;
  }

  function getCookie(cname: string) {
    const name = `${cname}=`;
    const decoded = decodeURIComponent(document.cookie);
    const ca = decoded.split(";");
    for (let c of ca) {
      c = c.trim();
      if (c.indexOf(name) === 0) return c.substring(name.length);
    }
    return "";
  }

  // حرکت ربات و چشم‌ها
  useEffect(() => {
    const card = cardRef.current;
    const robot = robotRef.current;
    const pupilL = pupilLRef.current;
    const pupilR = pupilRRef.current;
    const armL = armLRef.current;
    const armR = armRRef.current;
    const legL = legLRef.current;
    const legR = legRRef.current;
    const antenna = antennaRef.current;

    if (!card || !robot || !pupilL || !pupilR || !armL || !armR || !legL || !legR || !antenna)
      return;

    const MAX_EYE_MOVE = 10;
    const MAX_ARM_ROT = 15;
    const MAX_LEG_ROT = 10;

    function clamp(v: number, min: number, max: number) {
      return Math.max(min, Math.min(max, v));
    }

    const onMove = (e: MouseEvent | TouchEvent) => {
      let x = 0,
        y = 0;
      if ("clientX" in e) {
        x = e.clientX;
        y = e.clientY;
      } else if (e.touches && e.touches[0]) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      }

      const movePupil = (pupil: HTMLElement) => {
        const rect = pupil.parentElement!.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        const angle = Math.atan2(dy, dx);
        const dist = Math.min(MAX_EYE_MOVE, Math.hypot(dx, dy) / 10);
        pupil.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
      };

      movePupil(pupilL);
      movePupil(pupilR);

      const rect = robot.getBoundingClientRect();
      const dx = x - (rect.left + rect.width / 2);

      armL.style.transform = `rotate(${clamp(dx / 10, -MAX_ARM_ROT, MAX_ARM_ROT)}deg)`;
      armR.style.transform = `rotate(${clamp(-dx / 10, -MAX_ARM_ROT, MAX_ARM_ROT)}deg)`;
      legL.style.transform = `rotate(${clamp(dx / 20, -MAX_LEG_ROT, MAX_LEG_ROT)}deg)`;
      legR.style.transform = `rotate(${clamp(-dx / 20, -MAX_LEG_ROT, MAX_LEG_ROT)}deg)`;
      antenna.style.transform = `translateX(-50%) rotate(${clamp(dx / 7, -25, 25)}deg)`;
    };

    const onLeave = () => {
      pupilL.style.transform = "translate(0,0)";
      pupilR.style.transform = "translate(0,0)";
      armL.style.transform = "rotate(0deg)";
      armR.style.transform = "rotate(0deg)";
      legL.style.transform = "rotate(0deg)";
      legR.style.transform = "rotate(0deg)";
      antenna.style.transform = "translateX(-50%) rotate(0deg)";
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    card.addEventListener("touchmove", onMove as EventListener, { passive: true });
    card.addEventListener("touchend", onLeave);

    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
      card.removeEventListener("touchmove", onMove as EventListener);
      card.removeEventListener("touchend", onLeave);
    };
  }, []);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mouth = mouthPathRef.current;
    const status = statusRef.current;
    if (!mouth || !status) return;

    if (!validateEmail(email)) {
      mouth.setAttribute("d", "M15 24 C40 10 80 10 105 24");
      status.textContent = "ایمیل نامعتبر!";
      status.style.color = "red";
      return;
    }

    try {
      const res = await axios.post("/api/users/aut/register", { email });
      if (res.status === 200) {
        setStep("code");
        setTimer(30);
        mouth.setAttribute("d", "M15 20 C40 32 80 32 105 20");
        status.textContent = "ایمیل ارسال شد :)";
        status.style.color = "green";
      }
    } catch {
      mouth.setAttribute("d", "M15 24 C40 10 80 10 105 24");
      status.textContent = "خطا در ارسال ایمیل!";
      status.style.color = "red";
    }
  };

  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    const mouth = mouthPathRef.current;
    const status = statusRef.current;
    if (!mouth || !status) return;

    if (fullCode.length !== 4) {
      mouth.setAttribute("d", "M15 24 C40 10 80 10 105 24");
      status.textContent = "کد باید ۴ رقم باشد!";
      status.style.color = "red";
      return;
    }

    try {
      const res = await axios.post("/api/users/aut/active_code", { email, code: fullCode });
      if (res.status === 200) {
        mouth.setAttribute("d", "M15 20 C40 32 80 32 105 20");
        status.textContent = "کد صحیح است :)";
        status.style.color = "green";
        setCookie("token", String(res.data.token), 5);
        window.location.href = "/payment";
      } else {
        mouth.setAttribute("d", "M15 24 C40 10 80 10 105 24");
        status.textContent = "کد نادرست است!";
        status.style.color = "red";
      }
    } catch (err: any) {
      if (err.response?.status === 402) {
        const data = err.response?.data["ips"];
        setIps(data.slice(0, 3));
        setIsIpProblem(true);
        mouth.setAttribute("d", "M15 24 C40 10 80 10 105 24");
        status.textContent = "محدودیت IP";
        status.style.color = "red";
      } else {
        mouth.setAttribute("d", "M15 24 C40 10 80 10 105 24");
        status.textContent = "خطا در سرور!";
        status.style.color = "red";
      }
    }
  };

  const handleResend = () => setStep("email");

  const handleDelete = async () => {
    if (!selectedIp) return;
    const mouth = mouthPathRef.current;
    const status = statusRef.current;
    if (!mouth || !status) return;

    try {
      setIps((prev) => prev.filter((ip) => ip !== selectedIp));
      const res = await axios.post("/api/users/aut/deleteip", { code, email, selectedIp });
      if (res.status === 200 && res.data?.token) setCookie("token", res.data.token, 5);

      mouth.setAttribute("d", "M15 20 C40 32 80 32 105 20");
      status.textContent = "خوش آمدید :)";
      status.style.color = "green";
      setIsIpProblem(false);
      window.location.href = "/chat";
    } catch {
      mouth.setAttribute("d", "M15 24 C40 10 80 10 105 24");
      status.textContent = "خطا در سرور!";
      status.style.color = "red";
    } finally {
      setSelectedIp(null);
    }
  };

  return (
    <div className="container" ref={cardRef} style={{width:"80%"}}>
      {/* ربات */}
      <div className="robot-wrap">
        <div className="robot" ref={robotRef}>
          <div className="antenna" ref={antennaRef}></div>
          <div className="head">
            <div className="eye left">
              <div className="pupil" ref={pupilLRef}></div>
            </div>
            <div className="eye right">
              <div className="pupil" ref={pupilRRef}></div>
            </div>
            <div className="mouth">
              <svg viewBox="0 0 120 30" preserveAspectRatio="none">
                <path ref={mouthPathRef} d="M15 18 C40 22 80 22 105 18" />
              </svg>
            </div>
          </div>
          <div className="body"></div>
          <div className="arm left" ref={armLRef}></div>
          <div className="arm right" ref={armRRef}></div>
          <div className="leg left" ref={legLRef}></div>
          <div className="leg right" ref={legRRef}></div>
        </div>
      </div>

      {/* هشدار IP */}
      {isIpProblem && (
        <div className="ip-warning" style={{backgroundColor:'#ff325a52',border:'1px solid white' , borderRadius:"50px",padding:'20px'}}>
          <h3>⚠️ هشدار</h3>
          <p>بیش از 3 IP به این سیستم وصل هستند. لطفاً یکی را حذف کنید.</p>
          <ul>
            {ips.map((ip) => (
              <li key={ip}>
                <label>
                  <input
                    type="radio"
                    name="selectedIp"
                    value={ip}
                    checked={selectedIp === ip}
                    onChange={() => setSelectedIp(ip)}
                  />
                  {ip}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={handleDelete} disabled={!selectedIp}>
            حذف IP انتخاب شده
          </button>
        </div>
      )}

      {/* فرم ایمیل */}
      {step === "email" && (
        <form onSubmit={handleEmailSubmit}>
          <label>آدرس ایمیل</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit">ارسال ایمیل</button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={handleCodeSubmit}>
          <label>کد فعال‌سازی</label>
          <div style={{ display: "flex", gap: "10px" }}>
            {code.map((c, i) => (
              <input key={i} type="text" maxLength={1} value={c} onChange={(e) => handleCodeChange(e.target.value, i)} style={{width:"100%"}} />
            ))}
          </div>
          <button type="submit">تأیید</button>
          <button type="button" onClick={handleResend} disabled={timer > 0}>
            {timer > 0 ? `ارسال مجدد (${timer})` : "ارسال مجدد ایمیل"}
          </button>
        </form>
      )}

      <div className="status" ref={statusRef}>
        اطلاعات را وارد کنید
      </div>
    </div>
  );
};

export default Page;
