// app/drawPage/page.tsx
"use client";

import { useState } from "react";
import type { Editor } from "tldraw";
import TopBar from "@/components/drawingPage/TopBar";
import Toolbar from "@/components/drawingPage/Toolbar";
import Canvas from "@/components/drawingPage/canvas";
import PropertiesPanel from "@/components/drawingPage/PropertiesPanel";
import BottomBar from "@/components/drawingPage/BottomBar";
import type { UploadedDoc } from "@/types/Canvas";

export default function DrawingPage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedDoc | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);

  return (
    <main className="w-full h-full flex flex-col bg-[#0f1115] text-gray-200 overflow-hidden">
      <TopBar onFileUpload={setUploadedFile} editor={editor} />
      <div className="flex flex-1 overflow-hidden relative">
        <Toolbar editor={editor} />
        <div className="flex-1 relative">
          <Canvas
            selectedDoc={uploadedFile}
            onClearDoc={() => setUploadedFile(null)}
            onEditorMount={setEditor}
          />
          <BottomBar editor={editor} />
        </div>
        <PropertiesPanel editor={editor} />
      </div>
    </main>
  );
}
