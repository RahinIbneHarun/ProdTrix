// components/drawingPage/PropertiesPanel.tsx
"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import { UploadCloud } from "lucide-react";
import type { Editor } from "tldraw";

const STROKE_COLORS = [
  "#FCD34D",
  "#34D399",
  "#60A5FA",
  "#F87171",
  "#A78BFA",
  "#F472B6",
  "#FFFFFF",
];

// ─────────────────────────────────────────────────────────────
// Helpers — map slider values to tldraw's allowed style values
// ─────────────────────────────────────────────────────────────

function sliderToSize(value: number): "s" | "m" | "l" | "xl" {
  if (value <= 3) return "s";
  if (value <= 6) return "m";
  if (value <= 9) return "l";
  return "xl";
}

function sliderToOpacity(value: number): "0.1" | "0.25" | "0.5" | "0.75" | "1" {
  if (value <= 15) return "0.1";
  if (value <= 37) return "0.25";
  if (value <= 62) return "0.5";
  if (value <= 87) return "0.75";
  return "1";
}

export default function PropertiesPanel({ editor }: { editor: Editor | null }) {
  const [activeTab, setActiveTab] = useState<"properties" | "files">(
    "properties",
  );
  const [stroke, setStroke] = useState("#e8e8e8");
  const [fill, setFill] = useState<string>("none");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [opacity, setOpacity] = useState(100);

  // Apply style to selected shapes whenever it changes
  useEffect(() => {
    if (!editor) return;
    const ids = editor.getSelectedShapeIds();
    if (ids.length === 0) return;

    // Cast to any to bypass tldraw's strict generic typing
    const anyEditor = editor as any;

    try {
      anyEditor.setStyleForSelectedShapes("color", stroke);
      anyEditor.setStyleForSelectedShapes("size", sliderToSize(strokeWidth));
      anyEditor.setStyleForSelectedShapes("opacity", sliderToOpacity(opacity));
    } catch (err) {
      console.warn("Style update skipped:", err);
    }
  }, [editor, stroke, strokeWidth, opacity]);

  return (
    <aside className="w-72 border-l border-gray-800 bg-[#0f1115] flex flex-col text-gray-300 shrink-0 z-10">
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab("properties")}
          className={clsx(
            "flex-1 py-3 text-sm font-medium border-b-2 transition",
            activeTab === "properties"
              ? "border-blue-500 text-white"
              : "border-transparent text-gray-500 hover:text-gray-300",
          )}
        >
          Properties
        </button>
        <button
          onClick={() => setActiveTab("files")}
          className={clsx(
            "flex-1 py-3 text-sm font-medium border-b-2 transition",
            activeTab === "files"
              ? "border-blue-500 text-white"
              : "border-transparent text-gray-500 hover:text-gray-300",
          )}
        >
          Files
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {activeTab === "properties" ? (
          <div className="space-y-6">
            {/* Stroke */}
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">
                STROKE
              </label>
              <div className="flex items-center gap-3 bg-[#1e1e24] p-2 rounded border border-gray-700">
                <input
                  type="color"
                  value={stroke}
                  onChange={(e) => setStroke(e.target.value)}
                  className="w-6 h-6 rounded border border-gray-500 bg-transparent cursor-pointer"
                />
                <span className="text-sm">{stroke}</span>
              </div>
            </div>

            {/* Fill */}
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">
                FILL
              </label>
              <button
                onClick={() => setFill(fill === "none" ? "#3b82f6" : "none")}
                className="w-full text-left bg-[#1e1e24] p-2 rounded border border-gray-700 text-sm hover:border-gray-500 transition"
              >
                {fill === "none" ? "None" : fill}
              </button>
            </div>

            {/* Stroke Width */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span className="font-bold">STROKE WIDTH</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm w-6">{strokeWidth}</span>
              </div>
            </div>

            {/* Opacity */}
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span className="font-bold">OPACITY</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm w-10 text-right">{opacity}%</span>
              </div>
            </div>

            {/* Quick Colors */}
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">
                QUICK COLORS
              </label>
              <div className="flex gap-2 flex-wrap">
                {STROKE_COLORS.map((c) => (
                  <div
                    key={c}
                    onClick={() => setStroke(c)}
                    style={{ backgroundColor: c }}
                    className={clsx(
                      "w-6 h-6 rounded cursor-pointer hover:scale-110 transition",
                      stroke === c &&
                        "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0f1115]",
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Quick Shapes */}
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">
                QUICK SHAPES
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => editor?.setCurrentTool("rectangle" as any)}
                  className="bg-blue-900/30 text-blue-400 border border-blue-900/50 py-1.5 rounded text-sm hover:bg-blue-900/50 transition"
                >
                  Process
                </button>
                <button
                  onClick={() => editor?.setCurrentTool("diamond" as any)}
                  className="bg-purple-900/30 text-purple-400 border border-purple-900/50 py-1.5 rounded text-sm hover:bg-purple-900/50 transition"
                >
                  Decision
                </button>
                <button
                  onClick={() => editor?.setCurrentTool("ellipse" as any)}
                  className="bg-green-900/30 text-green-400 border border-green-900/50 py-1.5 rounded text-sm hover:bg-green-900/50 transition"
                >
                  Terminal
                </button>
                <button
                  onClick={() => editor?.setCurrentTool("rectangle" as any)}
                  className="bg-orange-900/30 text-orange-400 border border-orange-900/50 py-1.5 rounded text-sm hover:bg-orange-900/50 transition"
                >
                  IO
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mt-10">
            <h3 className="text-white font-medium mb-1">Files & Media</h3>
            <p className="text-xs text-gray-500 mb-6">
              Upload & place on canvas
            </p>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center hover:border-blue-500 transition cursor-pointer group">
              <UploadCloud
                className="text-gray-500 group-hover:text-blue-500 mb-3"
                size={32}
              />
              <p className="text-sm text-gray-300">
                Drop files or click to browse
              </p>
              <p className="text-[10px] text-gray-500 mt-2">
                PDF • PPT • DOC • CSV
              </p>
              <p className="text-[10px] text-gray-500">
                PNG • JPG • MP4 • MP3 • WAV
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
