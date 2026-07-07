/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';

interface SignatureCanvasProps {
  onSave: (dataUrl: string) => void;
  onClear?: () => void;
  placeholder?: string;
  isDarkMode?: boolean;
}

export default function SignatureCanvas({ onSave, onClear, placeholder = "Draw your signature here...", isDarkMode = false }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Support Retina displays
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // Dark ink for light mode, light ink for dark mode
    ctx.strokeStyle = isDarkMode ? '#fcfaf7' : '#272421';
    ctx.lineWidth = 2.5;

    // Reset state on resize
    setIsEmpty(true);
  }, [isDarkMode]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // Check if TouchEvent
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent scrolling on touch devices when signing
    if (e.cancelable) {
      e.preventDefault();
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    if (e.cancelable) {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    saveSignature();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    if (onClear) onClear();
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return;

    // Return signature data URL
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="flex flex-col w-full">
      <div 
        id="signature-box"
        className={`relative h-44 rounded-lg border-2 border-dashed overflow-hidden transition-colors ${
          isDarkMode 
            ? 'bg-cocoa-surface border-espresso hover:border-sand/40' 
            : 'bg-white border-sand hover:border-espresso/30'
        }`}
      >
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-center p-4">
            <span className={`text-sm font-medium ${isDarkMode ? 'text-alabaster/40' : 'text-espresso/40'}`}>
              {placeholder}
            </span>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className="signature-canvas w-full h-full block"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      
      <div className="flex justify-end mt-2">
        <button
          type="button"
          id="btn-clear-signature"
          onClick={clearCanvas}
          className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
            isDarkMode 
              ? 'text-alabaster/60 hover:text-alabaster hover:bg-cocoa-surface-light' 
              : 'text-espresso/60 hover:text-espresso hover:bg-sand/30'
          }`}
        >
          Clear Ink
        </button>
      </div>
    </div>
  );
}
