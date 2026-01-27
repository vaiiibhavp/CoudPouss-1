"use client";

import { Box, IconButton, InputBase } from "@mui/material";
import Image from "next/image";
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Dictaphone from "./Dictaphone";

interface ChatMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string, images: File[]) => void;
  maxImageSizeMB?: number;
}

const ACCEPTED_IMAGE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const MAX_IMAGES = 4;

export const ChatMessageInput = ({
  value,
  onChange,
  onSend,
  maxImageSizeMB = 5,
}: ChatMessageInputProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [baseValueBeforeSpeech, setBaseValueBeforeSpeech] = useState("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  console.log(
    "baseValueBeforeSpeech",
    baseValueBeforeSpeech,
    transcript,
    listening,
  );
  // Append transcript to input in real time
  useEffect(() => {
    if (listening) {
      // Append the new transcript to the text that existed before recording started
      const spacer = baseValueBeforeSpeech && transcript ? " " : "";
      onChange(`${baseValueBeforeSpeech}${spacer}${transcript}`);
    }
  }, [transcript, listening, onChange, baseValueBeforeSpeech]);

  const toggleListening = () => {
    if (!browserSupportsSpeechRecognition) return;

    if (listening) {
      SpeechRecognition.stopListening();
      // OPTIONAL: Reset the base value so the next time starts fresh
      setBaseValueBeforeSpeech("");
    } else {
      // Capture what is already in the input box
      setBaseValueBeforeSpeech(value);
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: "en-IN",
      });
    }
  };

  /* ---------------- Chat Logic ---------------- */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!value.trim() && images.length === 0) return;

    // Stop listening immediately on send
    if (listening) SpeechRecognition.stopListening();

    onSend(value.trim(), images);

    // Reset states
    setImages([]);
    onChange("");
    setBaseValueBeforeSpeech("");
    resetTranscript();
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const validImages = files.filter((file) => {
      const isValidType = ACCEPTED_IMAGE_TYPES.includes(file.type);
      const isValidSize = file.size <= maxImageSizeMB * 1024 * 1024;
      return isValidType && isValidSize;
    });

    setImages((prev) => {
      const remainingSlots = MAX_IMAGES - prev.length;
      return [...prev, ...validImages.slice(0, remainingSlots)];
    });

    e.target.value = "";
  };
  const startListening = async () => {
    if (!browserSupportsSpeechRecognition) return;

    setBaseValueBeforeSpeech(value);
    resetTranscript();

    SpeechRecognition.startListening({
      continuous: true,
      language: "en-IN",
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setBaseValueBeforeSpeech("");
  };

  return (
    <Box
      sx={{
        px: "1.75rem",
        py: "1.188rem",
        borderTop: "1px solid #E6E6E6",
      }}
    >
      {/* Image Preview */}
      {images.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
          {images.map((file, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                borderRadius: 1,
                overflow: "hidden",
                border: "1px solid #E5E7EB",
              }}
            >
              <Image
                src={URL.createObjectURL(file)}
                alt="attachment"
                width={100}
                height={100}
                style={{ objectFit: "cover" }}
              />
              <Box
                onClick={() =>
                  setImages((prev) => prev.filter((_, i) => i !== index))
                }
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 18,
                  height: 18,
                  bgcolor: "#111827",
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                ✕
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Input Area */}
      <Box
        sx={{
          px: "1.25rem",
          py: "1rem",
          borderRadius: "1rem",
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "#F6F7F7",
        }}
      >
        {/* Mic */}
        <IconButton
          onClick={toggleListening}
          disabled={!browserSupportsSpeechRecognition}
        >
          <Image
            src={listening ? "/icons/Microphone.png" : "/icons/micGray.png"}
            alt="mic"
            width={24}
            height={24}
          />
        </IconButton>
        {/* <Dictaphone
          listening={listening}
          supported={browserSupportsSpeechRecognition}
          onStart={startListening}
          onStop={stopListening}
          onReset={resetTranscript}
        /> */}

        <InputBase
          placeholder={listening ? "Listening..." : "Type a message..."}
          value={value}
          multiline
          maxRows={4}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            flex: 1,
            px: 1,
            py: 0.5,
            "& .MuiInputBase-input": {
              fontSize: "0.95rem",
              lineHeight: "1.5",
            },
          }}
        />

        {/* Attachment */}
        <IconButton
          onClick={handleAttachmentClick}
          disabled={images.length >= MAX_IMAGES}
        >
          <Image
            src="/icons/attachment-line.png"
            alt="attachment"
            width={24}
            height={24}
            style={{ opacity: images.length >= MAX_IMAGES ? 0.4 : 1 }}
          />
        </IconButton>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          multiple
          hidden
          onChange={handleImageSelect}
        />

        {/* Send */}
        <IconButton onClick={handleSend}>
          <Image src="/icons/sendMsg.png" alt="send" width={24} height={24} />
        </IconButton>
      </Box>
      {!browserSupportsSpeechRecognition && <span>Speech not supported</span>}
    </Box>
  );
};
