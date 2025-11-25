"use client";

import { useEffect, useState } from "react";

export default function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && (
        <div id="preloader">
          <div className="loader"></div>
        </div>
      )}
      {!loading && children}
    </>
  );
}
