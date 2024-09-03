"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileUploadDropzone } from "./file-upload-dropzone";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilesProcessed: (files: File[]) => void; 
}

export const FileUploadModal = ({ isOpen, onClose, onFilesProcessed }) => {
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
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Upload one or more files to include in your message.
          </DialogDescription>
        </DialogHeader>
        <FileUploadDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          handleInsertFiles={handleInsertFiles}
          multiple
        />
      </DialogContent>
    </Dialog>
  );
};
