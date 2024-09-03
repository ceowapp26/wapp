"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { FileUploadDropzone } from "./file-upload-dropzone";

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileProcessed: (file: File) => void; 
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({ isOpen, onClose, onFileProcessed }) => {
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = async (file?: File) => {
    if (file) {
      setFile(file);
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">
            Upload File
          </h2>
        </DialogHeader>
        <FileUploadDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
          onFileProcessed={onFileProcessed}
        />
      </DialogContent>
    </Dialog>
  );
};

