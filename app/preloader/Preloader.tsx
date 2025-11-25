'use client';
import { useState, useEffect } from 'react';

export default function Preloader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="preloader">
        <div className="spinner"></div>
        <h1 style={{color:'white'}}>GoodChat / چت زیبا</h1>
      </div>
    );
  }

  return <>{children}</>;
}
