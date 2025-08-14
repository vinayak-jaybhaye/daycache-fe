import { GripVertical, X } from "lucide-react";
import type React from "react";
import { useState, useRef } from "react";
import type { DraggableDialogProps } from "../types";

const DraggableDialog: React.FC<DraggableDialogProps> = ({
  visible,
  toggleDialog,
  props,
  Component,
  title,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);
  const offset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const onMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  if (!visible) return null;

  return (
    <div
      ref={dragRef}
      className="fixed w-[90%] max-w-md rounded-xl z-50 border animate-fadeIn backdrop-blur-sm transition-all duration-200 hover:scale-[1.01]"
      style={{
        left: `calc(50% + ${position.x}px)`,
        top: `calc(40vh + ${position.y}px)`,
        transform: "translate(-50%, -50%)",
        backgroundColor: "var(--color-surface-primary)",
        borderColor: "var(--color-border-primary)",
        boxShadow: "var(--shadow-xl)",
        color: "var(--color-text-primary)",
      }}
    >
      {/* Header with drag handle */}
      <div
        className="flex justify-between items-center p-4 pb-2 cursor-move rounded-t-xl transition-colors duration-150 select-none"
        onMouseDown={onMouseDown}
        style={{
          backgroundColor: "var(--color-surface-secondary)",
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="p-1 rounded-md transition-all duration-150 hover:scale-110"
            style={{
              color: "var(--color-text-secondary)",
              backgroundColor: "var(--color-surface-tertiary)",
            }}
          >
            <GripVertical className="h-4 w-4" />
          </div>
          <h2 
            className="text-lg font-semibold font-serif tracking-wide"
            style={{ color: "var(--color-text-primary)" }}
          >
            {title}
          </h2>
        </div>
        
        <button
          onClick={toggleDialog}
          className="p-2 rounded-full transition-all duration-150 hover:scale-110 hover:rotate-90 group"
          style={{
            color: "var(--color-text-tertiary)",
            backgroundColor: "var(--color-surface-tertiary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-error-100)";
            e.currentTarget.style.color = "var(--color-error-600)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--color-surface-tertiary)";
            e.currentTarget.style.color = "var(--color-text-tertiary)";
          }}
        >
          <X className="h-4 w-4 transition-transform duration-150 group-hover:rotate-90" />
        </button>
      </div>

      {/* Content area */}
      <div 
        className="p-4 pt-2 max-h-[60vh] overflow-auto scrollbar-hide rounded-b-xl"
        style={{
          backgroundColor: "var(--color-surface-primary)",
        }}
      >
        <div 
          className="rounded-lg p-1 transition-all duration-200"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border-secondary)",
          }}
        >
          <Component {...props} />
        </div>
      </div>

      {/* Subtle bottom accent line */}
      <div 
        className="h-1 rounded-b-xl transition-all duration-300"
        style={{
          background: `linear-gradient(90deg, var(--color-primary), var(--color-accent))`,
          opacity: 0.6,
        }}
      />
    </div>
  );
};

export default DraggableDialog;