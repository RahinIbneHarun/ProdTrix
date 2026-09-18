// components/drawingPage/VoiceRecorder.tsx
"use client";

import { useState, useRef } from "react";
import { Mic, Square, Play, Pause, Trash2 } from "lucide-react";

export default function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    console.log("🎤 [VoiceRecorder] startRecording called");
    setError(null);

    // Check for browser support
    if (typeof navigator === "undefined" || !navigator.mediaDevices) {
      console.error("❌ [VoiceRecorder] navigator.mediaDevices not available");
      setError("Browser doesn't support audio recording");
      return;
    }

    if (!navigator.mediaDevices.getUserMedia) {
      console.error("❌ [VoiceRecorder] getUserMedia not available");
      setError("getUserMedia not supported");
      return;
    }

    try {
      console.log("🎤 [VoiceRecorder] Requesting mic permission…");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      console.log("✅ [VoiceRecorder] Mic permission granted");

      // Check supported MIME types
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";

      console.log("🎤 [VoiceRecorder] Using MIME type:", mimeType || "default");

      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined,
      );
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        console.log(
          "🎤 [VoiceRecorder] Data chunk received:",
          e.data.size,
          "bytes",
        );
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        console.log("🎤 [VoiceRecorder] Recording stopped");
        const blob = new Blob(chunksRef.current, {
          type: mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        console.log("✅ [VoiceRecorder] Audio URL created:", url);
        setAudioUrl(url);
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.onerror = (e) => {
        console.error("❌ [VoiceRecorder] Recorder error:", e);
        setError("Recording error");
      };

      recorder.start();
      console.log("✅ [VoiceRecorder] Recorder started");
      mediaRecorderRef.current = recorder;
      setRecording(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("❌ [VoiceRecorder] Error:", err);
      setError(`Mic access failed: ${message}`);
    }
  };

  const stopRecording = () => {
    console.log("🎤 [VoiceRecorder] stopRecording called");
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const clearRecording = () => {
    setAudioUrl(null);
    setPlaying(false);
    setError(null);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 bg-[#1e1e24] border border-gray-700 rounded-md px-2 py-1.5 shadow-lg">
        {recording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition"
            title="Stop recording"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Stop
            <Square size={12} />
          </button>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition"
            title="Record voice"
          >
            <Mic size={14} />
            Record
          </button>
        )}

        {audioUrl && (
          <>
            <div className="w-px h-4 bg-gray-700" />
            <button
              type="button"
              onClick={togglePlayback}
              className="text-gray-400 hover:text-white transition"
              title={playing ? "Pause" : "Play"}
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              type="button"
              onClick={clearRecording}
              className="text-gray-400 hover:text-red-400 transition"
              title="Delete recording"
            >
              <Trash2 size={14} />
            </button>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setPlaying(false)}
            />
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-md max-w-xs">
          {error}
        </div>
      )}
    </div>
  );
}
