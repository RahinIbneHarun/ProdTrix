// components/drawingPage/Toolbar.tsx
"use client";

import {
  MousePointer2,
  Hand,
  Pencil,
  PenTool,
  Minus,
  MoveUpRight,
  Square,
  Circle,
  Type,
  StickyNote,
  Video,
  Mic,
  Eraser,
  Highlighter,
  Spline,
  Link,
  Triangle,
  Diamond,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import type { Editor } from "tldraw";

interface Tool {
  id: string;
  label: string;
  icon: any;
  tldrawTool?: string;
}

interface Section {
  title: string;
  tools: Tool[];
}

const SECTIONS: Section[] = [
  {
    title: "NAVIGATE",
    tools: [
      {
        id: "select",
        label: "Select",
        icon: MousePointer2,
        tldrawTool: "select",
      },
      { id: "pan", label: "Pan", icon: Hand, tldrawTool: "hand" },
    ],
  },
  {
    title: "DRAW",
    tools: [
      { id: "pencil", label: "Pencil", icon: Pencil, tldrawTool: "draw" },
      { id: "pen", label: "Pen", icon: PenTool, tldrawTool: "draw" },
      {
        id: "highlighter",
        label: "Highlight",
        icon: Highlighter,
        tldrawTool: "highlight",
      },
      { id: "eraser", label: "Eraser", icon: Eraser, tldrawTool: "eraser" },
    ],
  },
  {
    title: "LINES",
    tools: [
      { id: "line", label: "Line", icon: Minus, tldrawTool: "line" },
      { id: "arrow", label: "Arrow", icon: MoveUpRight, tldrawTool: "arrow" },
      { id: "curve", label: "Curve", icon: Spline, tldrawTool: "draw" },
      { id: "link", label: "Link", icon: Link, tldrawTool: "arrow" },
    ],
  },
  {
    title: "SHAPES",
    tools: [
      { id: "rect", label: "Rectangle", icon: Square, tldrawTool: "rectangle" },
      { id: "circle", label: "Circle", icon: Circle, tldrawTool: "ellipse" },
      {
        id: "triangle",
        label: "Triangle",
        icon: Triangle,
        tldrawTool: "triangle",
      },
      { id: "diamond", label: "Diamond", icon: Diamond, tldrawTool: "diamond" },
    ],
  },
  {
    title: "INSERT",
    tools: [
      { id: "text", label: "Text", icon: Type, tldrawTool: "text" },
      {
        id: "note",
        label: "Sticky Note",
        icon: StickyNote,
        tldrawTool: "note",
      },
      { id: "video", label: "Video", icon: Video },
      { id: "audio", label: "Audio", icon: Mic },
    ],
  },
];

const ToolButton = ({
  tool,
  active,
  expanded,
  onClick,
}: {
  tool: Tool;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
}) => {
  const Icon = tool.icon;
  return (
    <button
      onClick={onClick}
      title={tool.label}
      className={clsx(
        "flex items-center rounded-md transition-colors",
        expanded
          ? "w-full h-10 px-2 gap-2 justify-start"
          : "w-10 h-10 justify-center mx-auto",
        active
          ? "bg-blue-600 text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white",
      )}
    >
      <Icon size={18} className="shrink-0" />
      {expanded && (
        <span className="text-xs font-medium truncate">{tool.label}</span>
      )}
    </button>
  );
};

const SCROLLBAR_HIDDEN =
  "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

export default function Toolbar({ editor }: { editor: Editor | null }) {
  const [activeTool, setActiveTool] = useState("select");

  // ⭐ Start with `true` on both server and client to avoid hydration mismatch
  const [expanded, setExpanded] = useState(true);

  // ⭐ Read localStorage AFTER mount
  useEffect(() => {
    const stored = localStorage.getItem("toolbarExpanded");
    if (stored !== null) {
      setExpanded(stored !== "false");
    }
  }, []);

  const toggleExpanded = () => {
    setExpanded((v) => {
      const next = !v;
      if (typeof window !== "undefined") {
        localStorage.setItem("toolbarExpanded", String(next));
      }
      return next;
    });
  };

  const handleToolClick = (tool: Tool) => {
    setActiveTool(tool.id);
    if (editor && tool.tldrawTool) {
      editor.setCurrentTool(tool.tldrawTool as any);
    }
  };

  return (
    <aside
      className={clsx(
        "border-r border-gray-800 bg-[#0f1115] flex flex-col py-2 shrink-0 z-10 transition-all duration-200",
        SCROLLBAR_HIDDEN,
        expanded ? "w-[180px] overflow-y-auto" : "w-14 overflow-hidden",
      )}
    >
      {/* Collapse / Expand Toggle */}
      <button
        onClick={toggleExpanded}
        className="mx-2 mb-2 flex items-center justify-center h-8 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition shrink-0"
        title={expanded ? "Collapse" : "Expand"}
      >
        {expanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {SECTIONS.map((section) => (
        <div key={section.title}>
          {expanded && (
            <div className="text-[10px] text-gray-500 font-bold px-3 mt-3 mb-2 tracking-wider">
              {section.title}
            </div>
          )}

          {!expanded && <div className="mx-2 my-2 border-t border-gray-800" />}

          <div
            className={clsx(
              "grid gap-1 px-2",
              expanded ? "grid-cols-2" : "grid-cols-1",
            )}
          >
            {section.tools.map((tool) => (
              <ToolButton
                key={tool.id}
                tool={tool}
                active={activeTool === tool.id}
                expanded={expanded}
                onClick={() => handleToolClick(tool)}
              />
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
