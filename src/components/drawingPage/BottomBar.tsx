// components/drawingPage/BottomBar.tsx
"use client";

import { Undo, Trash2 } from "lucide-react";
import type { Editor } from "tldraw";

export default function BottomBar({ editor }: { editor: Editor | null }) {
  const handleUndo = () => editor?.undo();
  const handleClear = () => {
    if (!editor) return;
    const ids = editor.getCurrentPageShapeIds();
    if (ids.size > 0) {
      editor.deleteShapes(Array.from(ids));
    }
  };

  return (
    <div className="absolute bottom-20 left-0 right-0 px-4 flex justify-between items-end pointer-events-none z-30">
      <div className="bg-[#1e1e24] border border-gray-700 rounded-md px-4 py-2 pointer-events-auto flex items-center gap-2">
        <span className="text-xs text-gray-400 font-mono">
          {editor ? editor.getCurrentPageShapeIds().size : 0} objects
        </span>
      </div>

      <div className="bg-[#1e1e24] border border-gray-700 rounded-lg p-1 flex items-center gap-1 shadow-lg pointer-events-auto">
        <button
          onClick={handleUndo}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-700 rounded text-sm text-gray-300 transition"
        >
          <Undo size={14} /> Undo
        </button>
        <div className="w-px h-4 bg-gray-700 mx-1" />
        <button
          onClick={handleClear}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-700 rounded text-sm text-gray-300 transition"
        >
          <Trash2 size={14} /> Clear
        </button>
      </div>

      <button className="bg-[#1e1e24] border border-gray-700 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition pointer-events-auto">
        ?
      </button>
    </div>
  );
}
