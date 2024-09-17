"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ImageUploadDropzone } from "./image-upload-dropzone";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesProcessed: (files: File[]) => void; 
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, onFilesProcessed }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInsertFiles = (files) => {
    if (files) {
      onFilesProcessed(files);
      setIsSubmitting(false);
      onClose();
    }
    return;
  };

   return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
         <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
          <DialogDescription>
            Upload one or more images to include in your message.
          </DialogDescription>
        </DialogHeader>
        <ImageUploadDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          handleInsertFiles={handleInsertFiles}
          multiple
        />
      </DialogContent>
    </Dialog>
  );
};