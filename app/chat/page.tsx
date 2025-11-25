"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./style.css";

interface Message {
  text: string;
  who: "user" | "bot";
  fileUrl?: string;
  fileName?: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [thinkingMode, setThinkingMode] = useState(false);
  const [userName, setUserName] = useState("person");
  const [count, setCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(
    null
  );
  const pupilLeftRef = useRef<SVGCircleElement | null>(null);
  const pupilRightRef = useRef<SVGCircleElement | null>(null);
  const robotHeadRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  function getCookie(cname: string) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1);
      if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return "";
  }

  useEffect(() => {
    async function validateAndCheck() {
      const token = getCookie("token");
      if (!token) return router.push("/register");

      try {
        const res = await axios.post("/api/users/aut/check_token", { token });
        if (res.status !== 200) router.push("/register");
      } catch {
        router.push("/register");
      }

      try {
        const response = await axios.post("/api/chat/check_account", { token });
        if (response.status === 200) {
          setUserName(response.data.username);
          setCount(response.data.count);
          appendMessage("خب بیا شروع کنیم هرچی دوست داری بپرس😊", "bot");
        } else if (response.status === 203) {
          setUserName(response.data.username);
          setCount(response.data.count);
          appendMessage("اتمام اشتراک لطفا به صفحه پرداخت بروید😊", "bot");
          setTimeout(() => (window.location.href = "/payment"), 1000);
        }
      } catch (error) {
        console.log(error);
        appendMessage("مشکل در برقراری ارتباط", "bot");
      }
    }

    validateAndCheck();
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const appendMessage = (
    text: string,
    who: "user" | "bot",
    fileUrl?: string,
    fileName?: string
  ) => {
    setMessages((prev) => [...prev, { text, who, fileUrl, fileName }]);
  };

  const handleSend = async () => {
    if (!message.trim() && attachedFiles.length === 0) return;

    appendMessage(message, "user");

    setThinkingMode(true);
    const formData = new FormData();
    formData.append("message", message);
    formData.append("token", getCookie("token"));
    attachedFiles.forEach((file) => formData.append("file", file));
    const filesToSend = [...attachedFiles];
    setAttachedFiles([]);

    filesToSend.forEach((file) => {
      const fileUrl = URL.createObjectURL(file);
      appendMessage("", "user", fileUrl, file.name);
    });

    try {
      const res = await fetch("/api/chat/ask", {
        method: "POST",
        body: formData,
      });
      if (!res.body) throw new Error("No stream");

      const reader = res.body.getReader();
      readerRef.current = reader;

      appendMessage("", "bot");
      const botMessageIndex = messages.length + filesToSend.length;
      let botMessage = "";
      const decoder = new TextDecoder();
      appendMessage(message, "user");

      while (true) {
        if (!readerRef.current) break;
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        botMessage += chunk;

        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[botMessageIndex] = {
            ...newMessages[botMessageIndex],
            text: botMessage,
            who: "bot",
          };
          setCount(count - 1);

          return newMessages;
        });
      }
    } catch (error) {
      console.error(error);
      appendMessage("خطایی در پاسخ رخ داد", "bot");
    } finally {
      setThinkingMode(false);
      readerRef.current = null;
    }
  };

  const handleStop = () => {
    if (readerRef.current) {
      readerRef.current.cancel();
      readerRef.current = null;
      setThinkingMode(false);
      appendMessage("✅ پاسخ متوقف شد.", "bot");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (
        !robotHeadRef.current ||
        !pupilLeftRef.current ||
        !pupilRightRef.current
      )
        return;
      const rect = robotHeadRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const maxMove = 4;
      const dx = Math.cos(angle) * maxMove;
      const dy = Math.sin(angle) * maxMove;
      pupilLeftRef.current.setAttribute("cx", String(40 + dx));
      pupilLeftRef.current.setAttribute("cy", String(55 + dy));
      pupilRightRef.current.setAttribute("cx", String(80 + dx));
      pupilRightRef.current.setAttribute("cy", String(55 + dy));
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="d-flex flex-column chat-bg"
      style={{ height: "100vh", width: "100%" }}
    >
      {/* هدر */}
      <div
        className="px-3 py-2 border-bottom d-flex align-items-center"
        style={{
          gap: "0.75rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          direction:'rtl'
        }}
      >
        <div style={{display:'flex',alignItems:'center',flexDirection:'column'}}>
          <img
            src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f4ac.png"
            alt="bot"
            width="40"
            height="40"
            style={{ borderRadius: 8 }}
          />

          <div className="username">{userName}</div>
          <div
            className="text-muted small d-mg-none d-inline"
            style={{ color: "white" }}
          >
            {" "}
            <span style={{ color: "white" }}>پایه چت هستی؟</span>
          </div>
        </div>

        <div className="d-flex flex-row justify-content-between w-100 align-items-center">
          <div className="d-flex flex-column align-items-center justify-content-center" style={{display:'flex',alignItems:'center',flexDirection:'column'}}>
            <div
              id="robot-head"
              ref={robotHeadRef}
              style={{ width: 60, height: 60 }}
            >
              <svg viewBox="0 0 120 120" width="60" height="60">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="#d1d5db"
                  stroke="#4b5563"
                  strokeWidth="4"
                />
                <circle
                  cx="40"
                  cy="55"
                  r="12"
                  fill="#fff"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <circle
                  ref={pupilLeftRef}
                  cx="40"
                  cy="55"
                  r="6"
                  fill="#1f2937"
                />
                <circle
                  cx="80"
                  cy="55"
                  r="12"
                  fill="#fff"
                  stroke="#374151"
                  strokeWidth="2"
                />
                <circle
                  ref={pupilRightRef}
                  cx="80"
                  cy="55"
                  r="6"
                  fill="#1f2937"
                />
                <path
                  d="M40 80 Q60 100 80 80"
                  stroke="#374151"
                  strokeWidth="4"
                  fill="transparent"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="req" style={{ textAlign: "center" }}>
              تعداد درخواست های باقی مانده: {count}
            </div>
          </div>
        </div>
      </div>

      <div
        id="messages"
        className="messages flex-1 overflow-auto p-3"
        style={{ background: "#f3f6fb",height:'100%' }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`d-flex align-items-start mb-2 ${
              msg.who === "user"
                ? "justify-content-end"
                : "justify-content-start"
            }`}
            style={{ direction: "rtl" }}
          >
            <div
              className={`message p-2`}
              style={{
                maxWidth: "70%",
                borderRadius: "10px",
                backgroundColor: msg.who === "user" ? "#007bff" : "#e5e5ea",
                color: msg.who === "user" ? "white" : "black",
                wordBreak: "break-word",
                direction: "rtl",
              }}
            >
              {msg.fileUrl ? (
                <>
                  <div style={{ color: "black" }}>{msg.text}</div>
                  {/\.(jpg|jpeg|png|gif|webp)$/i.test(msg.fileUrl) ? (
                    <img
                      src={msg.fileUrl}
                      alt={msg.fileName || "image"}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "10px",
                        marginTop: "5px",
                      }}
                    />
                  ) : (
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        background: msg.who === "user" ? "#0056b3" : "#007bff",
                        color: "white",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        textDecoration: "none",
                        marginTop: "5px",
                      }}
                    >
                      {msg.fileName || "دانلود فایل"}
                    </a>
                  )}
                </>
              ) : msg.who === "bot" && msg.text.includes("```") ? (
                <SyntaxHighlighter
                  language="javascript"
                  style={coy}
                  showLineNumbers
                  wrapLines
                  lineProps={{
                    style: {
                      wordBreak: "break-word",
                      fontSize: "14px",
                      direction: "rtl",
                    },
                  }}
                  customStyle={{
                    borderRadius: "8px",
                    padding: "10px",
                    backgroundColor: "#1e1e2f",
                    fontFamily: "Fira Code, monospace",
                    direction: "rtl",
                    textAlign: "left",
                    color: "white",
                  }}
                >
                  {msg.text.replace(/```/g, "")}
                </SyntaxHighlighter>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {thinkingMode && (
          <div className="d-flex justify-content-start mb-2">
            <div
              className="message p-2"
              style={{ backgroundColor: "#e5e5ea", borderRadius: "10px" }}
            >
              <div className="spinner"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div
        className="composer d-flex align-items-center p-2 border-top flex-column"
        style={{
          color:'white',
          position: "fixed",
          left: 0,
          bottom: 0,
          width: "100%",
        }}
      >
        {attachedFiles.length > 0 && (
          <div
            className="attached-files mb-2 d-flex flex-wrap"
            style={{ gap: "8px", width: "100%" }}
          >
            {attachedFiles.map((file, index) => {
              const fileUrl = URL.createObjectURL(file);
              return (
                <div
                  key={index}
                  className="d-flex align-items-center"
                  style={{ gap: "5px" }}
                >
                  {/\.(jpg|jpeg|png|gif|webp)$/i.test(file.name) ? (
                    <img
                      src={fileUrl}
                      alt={file.name}
                      style={{
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                        borderRadius: 5,
                      }}
                    />
                  ) : (
                    <span>{file.name}</span>
                  )}
                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      setAttachedFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <img src="/img/delete.png" alt="" width={20} height={20} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div
          className="input-area d-flex align-items-center flex-grow-1 bg-light rounded-pill px-2"
          style={{ width: "100%",direction:"rtl" }}
        >
          <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple
            onChange={(e) =>
              e.target.files && setAttachedFiles(Array.from(e.target.files))
            }
          />
          <button
            className="btn btn-sm btn-link"
            onClick={() => fileInputRef.current?.click()}
            style={{cursor:'pointer',borderRadius:"50px"}}
          >
            <img src="/img/selectfiel.png" alt="" width={20} height={20} />
          </button>

          <textarea
            className="flex-grow-1 border-0 bg-transparent"
            rows={1}
            style={{ color: "white", width: "100%" }}
            placeholder="متنی بنویس یا فایل بفرست..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="btn btn-primary btn-sm ms-2" onClick={handleSend} style={{cursor:'pointer',borderRadius:"50px"}}>
            <img src="/img/send.png" alt="" width={20} height={20} />
          </button>
          {thinkingMode && (
            <button
              className="btn btn-primary btn-sm ms-2"
              onClick={handleStop}
            >
              <img src="/img/stop.png" alt="" width={20} height={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
