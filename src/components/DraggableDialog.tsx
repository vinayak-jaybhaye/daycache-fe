import { GripVertical, X } from "lucide-react";
import type React from "react";
import { useState, useRef, type MouseEventHandler } from "react";

interface DraggableDialogProps<T = any> {
  visible: boolean;
  toggleDialog: MouseEventHandler;
  props: T;
  Component: React.FC<T>;
  title: string;
}

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
      className="fixed w-[90%] max-w-md bg-background p-4 rounded-xl shadow-2xl z-50 border border-border animate-fadeIn"
      style={{
        left: `calc(50% + ${position.x}px)`,
        top: `calc(40vh + ${position.y}px)`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        className="flex justify-between items-center mb-4 cursor-move bg-background p-2 rounded-lg"
        onMouseDown={onMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-amber-600" />
          <h2 className="text-xl font-serif font-semibold text-amber-900">
            {title}
          </h2>
        </div>
        <button
          onClick={toggleDialog}
          className="text-amber-700 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="max-h-[60vh] max-w-[50vw] overflow-auto scrollbar-hide">
        <Component {...props} />
      </div>
    </div>
  );
};

export default DraggableDialog;
