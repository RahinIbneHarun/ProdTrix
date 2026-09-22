// components/drawingPage/TopBar.tsx
"use client";

import { Upload, ZoomIn, ZoomOut, RotateCcw, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { Editor } from "tldraw";
import type { UploadedDoc } from "@/types/Canvas";
import Image from "next/image";


interface TopBarProps {
  onFileUpload: (doc: UploadedDoc) => void;
  editor?: Editor | null;
}

export default function TopBar({ onFileUpload, editor }: TopBarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  // Sync zoom indicator with tldraw's zoom level
  useEffect(() => {
    if (!editor) return;
    const update = () => setZoom(Math.round(editor.getZoomLevel() * 100));
    update();
    const unsub = editor.store.listen(update);
    return () => unsub();
  }, [editor]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Upload failed (${res.status})`);

      const data = await res.json();
      if (!data.url) throw new Error("No URL returned from server");

      onFileUpload({
        url: data.url,
        name: data.name ?? file.name,
        type: data.type ?? file.type,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <header className="h-14 border-b border-gray-800 bg-[#0f1115] flex items-center justify-between px-4 text-gray-300 shrink-0 z-40 relative">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-white font-bold text-lg select-none">
          <div className="bg-blue-600 p-1 rounded">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
            </svg>
          </div>
          <span>Prodtrix</span>
        </div>
        <div className="flex gap-4 text-sm">
          <button className="hover:text-white transition">New</button>
          <button
            onClick={() => {
              if (!editor) return;
              const ids = editor.getCurrentPageShapeIds();
              if (ids.size > 0) editor.deleteShapes(Array.from(ids));
            }}
            className="hover:text-white transition"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-[#1e1e24] rounded-md border border-gray-700 overflow-hidden">
          <button
            onClick={() => editor?.zoomOut()}
            className="px-2 py-1.5 hover:bg-gray-700 transition"
          >
            <ZoomOut size={14} />
          </button>
          <span className="px-2 text-xs border-l border-r border-gray-700">
            {zoom}%
          </span>
          <button
            onClick={() => editor?.zoomIn()}
            className="px-2 py-1.5 hover:bg-gray-700 transition"
          >
            <ZoomIn size={14} />
          </button>
        </div>

        <button
          onClick={() => editor?.zoomToFit()}
          className="bg-[#1e1e24] border border-gray-700 p-2 rounded-md hover:text-white transition"
          title="Zoom to fit"
        >
          <RotateCcw size={16} />
        </button>

        <button className="bg-[#1e1e24] border border-gray-700 p-2 rounded-md hover:text-white transition">
          <Share2 size={16} />
        </button>

        <label
          className={`text-white px-4 py-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition ${
            isUploading
              ? "bg-blue-800 cursor-wait"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          <Upload size={14} />
          {isUploading ? "Uploading…" : "Upload"}
          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,.doc,.csv,.png,.jpg,.jpeg,.xlsx,.pptx"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>

      {error && (
        <div className="absolute top-16 right-4 bg-red-600 text-white text-xs px-3 py-2 rounded shadow-lg">
          {error}
        </div>
      )}
    </header>
  );
}
