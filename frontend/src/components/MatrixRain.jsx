import { useEffect, useRef } from 'react';

const CHARS = 'アイウエオカキクケコサシスセソ01アイウエオ<>{}[]/;=+-*&%$#@!'.split('');

function MatrixRain({ onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(13, 17, 23, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#5CDBD3';
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * fontSize;
        ctx.fillText(char, x, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    const interval = setInterval(draw, 40);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[300] bg-[#0D1117]">
      <canvas ref={canvasRef} className="w-full h-full" />
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-[#5CDBD3] font-mono text-sm border border-[#5CDBD3]/30 rounded-lg px-3 py-1.5 hover:bg-[#5CDBD3]/10 transition"
      >
        ✕ close (or press esc)
      </button>
    </div>
  );
}

export default MatrixRain;