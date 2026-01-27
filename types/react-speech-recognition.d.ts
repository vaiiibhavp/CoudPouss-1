declare module 'react-speech-recognition' {
  export interface SpeechRecognitionOptions {
    continuous?: boolean;
    language?: string;
  }

  export function useSpeechRecognition(): {
    transcript: string;
    listening: boolean;
    resetTranscript: () => void;
    browserSupportsSpeechRecognition: boolean;
  };

  const SpeechRecognition: {
    startListening: (options?: SpeechRecognitionOptions) => void;
    stopListening: () => void;
  };

  export default SpeechRecognition;
}