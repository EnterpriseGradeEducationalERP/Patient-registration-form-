// components/SignatureCanvas.jsx
import React, { useRef, useEffect } from 'react';

const SignatureCanvas = ({ onSignatureChange }) => {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize canvas size
    const initCanvas = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctxRef.current = ctx;
      
      // Set canvas size
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      // Only resize if dimensions changed
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }
      
      // Set drawing styles
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#000000';

      // Load saved signature
      const savedSignature = localStorage.getItem('global_signature');
      if (savedSignature) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, rect.width, rect.height);
          ctx.drawImage(img, 0, 0, rect.width, rect.height);
          onSignatureChange?.(savedSignature);
        };
        img.onerror = () => {
          // If image fails to load, clear it
          localStorage.removeItem('global_signature');
        };
        img.src = savedSignature;
      }
    };

    // Initialize on mount and resize
    initCanvas();
    
    const handleResize = () => {
      initCanvas();
    };
    
    window.addEventListener('resize', handleResize);

    // Event handlers
    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const startDrawing = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const ctx = ctxRef.current;
      if (!ctx) return;
      
      isDrawingRef.current = true;
      const pos = getMousePos(e);
      lastPosRef.current = pos;
      
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    };

    const draw = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!isDrawingRef.current) return;
      const ctx = ctxRef.current;
      if (!ctx) return;
      
      const pos = getMousePos(e);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      lastPosRef.current = pos;
    };

    const stopDrawing = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!isDrawingRef.current) return;
      const ctx = ctxRef.current;
      if (!ctx) return;
      
      isDrawingRef.current = false;
      ctx.closePath();
      
      // Save signature immediately after stopping
      const signatureData = canvas.toDataURL('image/png');
      localStorage.setItem('global_signature', signatureData);
      onSignatureChange?.(signatureData);
    };

    // Add event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchcancel', stopDrawing);

    return () => {
      // Cleanup
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
      canvas.removeEventListener('touchcancel', stopDrawing);
    };
  }, [onSignatureChange]);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (ctx && canvas) {
      // Clear the canvas
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
    }
    // Clear from localStorage
    localStorage.removeItem('global_signature');
    // Reset drawing state
    isDrawingRef.current = false;
    // Notify parent component
    onSignatureChange?.(null);
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="w-full h-40 border border-gray-300 rounded-md cursor-crosshair bg-white"
        style={{ touchAction: 'none' }}
      />
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={clearSignature}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
        >
          Clear Signature
        </button>
      </div>
    </div>
  );
};

export default SignatureCanvas;