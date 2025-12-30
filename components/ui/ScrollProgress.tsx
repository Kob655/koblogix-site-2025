import React, { useEffect, useState } from 'react';

const ScrollProgress: React.FC = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTotal = document.documentElement.scrollTop;
      const heightTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTotal / heightTotal) * 100;
      setWidth(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-transparent pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-100 ease-out"
        style={{ width: `${width}%` }}
      ></div>
    </div>
  );
};

export default ScrollProgress;