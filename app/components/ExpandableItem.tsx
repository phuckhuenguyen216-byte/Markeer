"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface ExpandableItemProps {
  title: string;
  children: React.ReactNode;
}

export default function ExpandableItem({
  title,
  children,
}: ExpandableItemProps) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-full
          flex items-center justify-between
          px-4 py-3
          text-left
          font-medium
          text-gray-900
          hover:bg-black/5
        "
      >
        <span>{title}</span>

        <ChevronDown
          size={18}
          className={`
            transition-transform duration-300 ease-in-out
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Animated wrapper */}
      <div
        style={{
          maxHeight: open ? height + 24 : 0,
        }}
        className="
          overflow-hidden
          transition-[max-height] duration-500 ease-in-out
        "
      >
        {/* Inner content */}
        <div
          ref={contentRef}
          className={`
            mx-4
            mt-3
            mb-4
            rounded-md
            border
            border-gray-200
            bg-white
            px-4
            py-3
            text-sm
            text-gray-700
            space-y-3
            transition-all duration-300 ease-in-out
            ${
              open
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2"
            }
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
