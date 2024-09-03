"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader
} from "@/components/ui/dialog";
import { AudioUploadDropzone } from "./audio-upload-dropzone";

interface AudioUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptionComplete: (transcription: string) => void; 
}

export const AudioUploadModal: React.FC<AudioUploadModalProps> = ({ isOpen, onClose, onTranscriptionComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);

  const handleClose = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setIsTranscribing(false);
    setTranscriptionProgress(0);
    onClose();
  };

  const handleUpload = async (file: File) => {
    if (file) {
      setIsUploading(true);
      try {
        // Simulate upload progress
        const uploadInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(uploadInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        await new Promise(resolve => setTimeout(resolve, 1000));
        clearInterval(uploadInterval);
        setUploadProgress(100);

        setIsUploading(false);
        setIsTranscribing(true);

        const progressInterval = setInterval(() => {
          setTranscriptionProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 500);

        const formData = new FormData();
        formData.append('audio', file);

        const transcriptionResponse = await fetch('/api/transcribe_openai', {
          method: 'POST',
          body: formData,
        });

        clearInterval(progressInterval);

        if (!transcriptionResponse.ok) {
          throw new Error('Transcription failed');
        }

        const { transcription } = await transcriptionResponse.json();
        setTranscriptionProgress(100);
        onTranscriptionComplete(transcription);
        handleClose();
      } catch (error) {
        console.error("Error occurred while processing audio:", error);
        toast.error("An error occurred while processing audio. Please try again.");
        setIsUploading(false);
        setIsTranscribing(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">
            Upload Audio
          </h2>
        </DialogHeader>
        <AudioUploadDropzone
          onUpload={handleUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          isTranscribing={isTranscribing}
          transcriptionProgress={transcriptionProgress}
        />
      </DialogContent>
    </Dialog>
  );
};