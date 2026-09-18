// components/drawingPage/DocxPreview.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import mammoth from "mammoth";
import {
  Loader2,
  FileWarning,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
} from "lucide-react";

interface DocxPreviewProps {
  url: string;
  fileName: string;
}

// Page base width in pixels (A4 at 96 DPI ≈ 794px)
const PAGE_BASE_WIDTH = 794;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

export default function DocxPreview({ url, fileName }: DocxPreviewProps) {
  const [html, setHtml] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // ─────────────────────────────────────────────
  // Load DOCX (with image embedding)
  // ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);

        const arrayBuffer = await res.arrayBuffer();

        // ⭐ Convert with image support
        const result = await mammoth.convertToHtml(
          { arrayBuffer },
          {
            convertImage: mammoth.images.imgElement(async (image) => {
              const buffer = await image.read("base64");
              return {
                src: `data:${image.contentType};base64,${buffer}`,
              };
            }),
          },
        );

        if (!cancelled) {
          setHtml(result.value);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load");
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [url]);

  // ─────────────────────────────────────────────
  // Zoom handlers
  // ─────────────────────────────────────────────
  const zoomIn = useCallback(
    () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2))),
    [],
  );
  const zoomOut = useCallback(
    () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2))),
    [],
  );
  const resetZoom = useCallback(() => setZoom(1), []);

  // ⭐ Fit-to-width
  const fitToWidth = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const available = el.clientWidth - 48;
    const fit = available / PAGE_BASE_WIDTH;
    const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, +fit.toFixed(2)));
    setZoom(clamped);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        zoomIn();
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        zoomOut();
      } else if (e.key === "0") {
        e.preventDefault();
        resetZoom();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomIn, zoomOut, resetZoom]);

  // Ctrl + scroll
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  // ─────────────────────────────────────────────
  // Loading / Error / Empty states
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
        <Loader2 size={32} className="animate-spin text-blue-500" />
        <p className="text-sm">Loading document…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <FileWarning size={48} className="mb-4 text-red-500/50" />
        <p className="mb-1 text-sm text-red-400">Failed to load document</p>
        <p className="max-w-md text-xs text-gray-500">{error}</p>
      </div>
    );
  }

  if (!html || html.trim().length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <FileWarning size={48} className="mb-4 text-yellow-500/50" />
        <p className="mb-1 text-sm text-yellow-400">Document appears empty</p>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  const pageWidth = PAGE_BASE_WIDTH * zoom;

  return (
    <div className="relative flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-[#0f1115] shrink-0">
        <span className="text-xs text-gray-500 truncate max-w-md">
          {fileName}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Zoom out (Ctrl + −)"
          >
            <ZoomOut size={16} />
          </button>

          <button
            onClick={resetZoom}
            className="px-2 py-1 rounded-md text-xs font-mono text-center text-gray-400 hover:bg-gray-800 hover:text-white transition min-w-[52px]"
            title="Reset (Ctrl + 0)"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Zoom in (Ctrl + +)"
          >
            <ZoomIn size={16} />
          </button>

          <div className="w-px h-4 mx-1 bg-gray-700" />

          <button
            onClick={fitToWidth}
            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition"
            title="Fit to width"
          >
            <Maximize2 size={14} />
          </button>

          <button
            onClick={resetZoom}
            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-800 hover:text-white transition"
            title="Reset"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Scrollable document area */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-auto bg-[#0f1115]"
        onWheel={handleWheel}
      >
        <div className="flex justify-center p-6 min-w-fit">
          <div
            style={{ width: `${pageWidth}px` }}
            className="shrink-0 transition-[width] duration-150 ease-out"
          >
            <div className="bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden">
              <div
                style={{
                  fontSize: `${14 * zoom}px`,
                  lineHeight: 1.6,
                }}
                className={[
                  "p-10 break-words",
                  "[&_*]:max-w-full [&_*]:box-border",

                  // Headings
                  "[&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3",
                  "[&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2",
                  "[&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2",
                  "[&_h4]:font-semibold [&_h4]:mt-3 [&_h4]:mb-2",
                  "[&_h5]:font-semibold [&_h5]:mt-3 [&_h5]:mb-1",
                  "[&_h6]:font-semibold [&_h6]:mt-3 [&_h6]:mb-1",

                  // Paragraphs
                  "[&_p]:my-3 [&_p]:text-gray-800 [&_p]:break-words",

                  // Inline
                  "[&_strong]:font-bold [&_strong]:text-gray-900",
                  "[&_em]:italic",
                  "[&_u]:underline",
                  "[&_a]:text-blue-600 [&_a]:underline [&_a]:break-all",

                  // Lists
                  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3",
                  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3",
                  "[&_li]:my-1 [&_li]:text-gray-800",

                  // Tables
                  "[&_table]:w-full [&_table]:max-w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:table-fixed",
                  "[&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-100 [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-gray-900 [&_th]:break-words",
                  "[&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_td]:align-top [&_td]:text-gray-800 [&_td]:break-words",

                  // Images — hide EMF (browser can't render)
                  "[&_img]:max-w-full [&_img]:h-auto [&_img]:my-3 [&_img]:rounded [&_img]:border [&_img]:border-gray-200 [&_img]:object-contain",
                  "[&_img[src^='data:image/x-emf']]:hidden",

                  // Blockquotes
                  "[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-gray-600",

                  // HR
                  "[&_hr]:my-6 [&_hr]:border-gray-200",

                  // Code
                  "[&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:break-all",
                  "[&_pre]:bg-gray-100 [&_pre]:p-3 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre]:max-w-full",

                  // Wrapper divs/spans
                  "[&_div]:max-w-full",
                  "[&_span]:max-w-full",
                ].join(" ")}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
