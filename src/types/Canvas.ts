interface UploadedDoc {
  url: string;
  name: string;
  type: string;
}

interface CanvasProps {
  selectedDoc: UploadedDoc | null;
  onClearDoc: () => void;
}

export type {UploadedDoc, CanvasProps};