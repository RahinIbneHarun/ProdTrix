// components/drawingPage/Canvas.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";
import { X } from "lucide-react";
import { Tldraw } from "tldraw";
import type { Editor } from "tldraw";
import { useTheme } from "next-themes";
import type { UploadedDoc } from "@/types/Canvas";
import VoiceRecorder from "./VoiceRecorder";

// Lazy-load both viewers (browser-only APIs)
const DocViewer = dynamic(() => import("@cyntler/react-doc-viewer"), {
  ssr: false,
});

const DocxPreview = dynamic(() => import("./DocxPreview"), {
  ssr: false,
});

interface CanvasProps {
  selectedDoc: UploadedDoc | null;
  onClearDoc: () => void;
  onEditorMount?: (editor: Editor) => void;
}

// File types that DocViewer handles well
const DOCVIEWER_EXTENSIONS = [
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "csv",
  "txt",
];

// ⭐ DOCX/DOC go through our custom mammoth-based previewer instead
const DOCX_EXTENSIONS = ["docx", "doc"];

export default function Canvas({
  selectedDoc,
  onClearDoc,
  onEditorMount,
}: CanvasProps) {
  const { resolvedTheme } = useTheme();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setPreviewOpen(!!selectedDoc);
  }, [selectedDoc]);

  const fileExtension = useMemo(() => {
    if (!selectedDoc) return "";
    return selectedDoc.name.split(".").pop()?.toLowerCase() ?? "";
  }, [selectedDoc]);

  const isDocx = useMemo(
    () => DOCX_EXTENSIONS.includes(fileExtension),
    [fileExtension],
  );

  const isSupportedByDocViewer = useMemo(
    () => DOCVIEWER_EXTENSIONS.includes(fileExtension),
    [fileExtension],
  );

  const docs = useMemo(() => {
    if (!selectedDoc) return [];
    const absoluteUrl = selectedDoc.url.startsWith("http")
      ? selectedDoc.url
      : `${window.location.origin}${selectedDoc.url}`;
    return [
      {
        uri: absoluteUrl,
        fileName: selectedDoc.name,
        fileType: fileExtension,
      },
    ];
  }, [selectedDoc, fileExtension]);

  const absoluteFileUrl = useMemo(() => {
    if (!selectedDoc) return "";
    return selectedDoc.url.startsWith("http")
      ? selectedDoc.url
      : `${window.location.origin}${selectedDoc.url}`;
  }, [selectedDoc]);

  const isDark = !mounted || resolvedTheme !== "light";

  return (
    <div className="relative w-full h-full bg-[#0f1115] overflow-hidden">
      {/* LAYER 1 — tldraw canvas */}
      <div
        className={`absolute inset-0 transition-opacity duration-200 ${
          previewOpen ? "opacity-30 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className={`${isDark ? "dark" : ""} h-full w-full`}>
          <Tldraw
            persistenceKey="drawlab-canvas"
            hideUi
            onMount={(editor) => onEditorMount?.(editor)}
          />
        </div>
      </div>

      {/* FLOATING — Voice Recorder */}
      {!previewOpen && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
          <VoiceRecorder />
        </div>
      )}

      {/* LAYER 2 — Preview overlay */}
      {selectedDoc && (
        <div className="absolute inset-0 p-6 pb-24 flex flex-col bg-[#0f1115]/95 backdrop-blur-sm z-40">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded shrink-0">
                Preview
              </span>
              <span className="text-sm text-gray-300 truncate max-w-md">
                {selectedDoc.name}
              </span>
            </div>
            <button
              onClick={onClearDoc}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-[#1e1e24] border border-gray-700 px-3 py-1.5 rounded-md transition shrink-0"
            >
              <X size={12} /> Close
            </button>
          </div>

          {/* Viewer container */}
          <div className="flex-1 min-h-0 bg-[#1e1e24] rounded-lg border border-gray-800 overflow-hidden relative">
            {/* ⭐ DOCX → mammoth-based client-side renderer */}
            {isDocx ? (
              <DocxPreview url={absoluteFileUrl} fileName={selectedDoc.name} />
            ) : isSupportedByDocViewer ? (
              /* PDF, images, CSV, etc. → DocViewer */
              <DocViewer
                documents={docs}
                pluginRenderers={DocViewerRenderers}
                config={{
                  header: {
                    disableHeader: true,
                    disableFileName: true,
                    retainURLParams: false,
                  },
                  csvDelimiter: ",",
                  pdfZoom: { defaultZoom: 1, zoomJump: 0.2 },
                }}
                theme={
                  {
                    primary: "#3b82f6",
                    secondary: "#1e1e24",
                    tertiary: "#0f1115",
                    text_primary: "#ffffff",
                    text_secondary: "#9ca3af",
                    background: "#1e1e24",
                  } as any
                }
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              /* XLSX, PPTX — Microsoft viewer only (won't work on localhost) */
              <div className="flex items-center justify-center h-full text-center p-6">
                <div className="max-w-md">
                  <p className="text-sm text-gray-400 mb-1">
                    Preview not available for{" "}
                    <code className="text-blue-400">.{fileExtension}</code>{" "}
                    files
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Excel and PowerPoint files require a public URL. This will
                    work after deploying.
                  </p>
                  <a
                    href={selectedDoc.url}
                    download={selectedDoc.name}
                    className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 underline"
                  >
                    Download file
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
