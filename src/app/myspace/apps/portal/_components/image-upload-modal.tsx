"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader
} from "@/components/ui/dialog";
import { ImageUploadDropzone } from "./image-upload-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { EdgeStoreApiClientError } from '@edgestore/react/shared';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageProcessed: (image: File) => void; 
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, onImageProcessed }) => {
  const params = useParams();
  const { edgestore } = useEdgeStore();
  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      try {
        const res = await edgestore.publicFiles.upload({
          file,
          input: {
            type: 'post',
          },
          options: {
            temporary: true,
          },
          ctx: {
            userId: '123',
            userRole: 'admin',
          },
          onProgressChange: (progress) => {
            console.log(progress);
          },
        });
        onClose();
      } catch (error) {
        if (error instanceof EdgeStoreApiClientError) {
          if (error.data.code === 'FILE_TOO_LARGE') {
            toast(
              `File too large. Max size is ${formatFileSize(
                error.data.details.maxFileSize,
              )}`,
            );
          }
          if (error.data.code === 'MIME_TYPE_NOT_ALLOWED') {
            toast(
              `File type not allowed. Allowed types are ${error.data.details.allowedMimeTypes.join(
                ', ',
              )}`,
            );
          }
          if (error.data.code === 'UPLOAD_NOT_ALLOWED') {
            toast("You don't have permission to upload files here.");
          }
        } else {
          console.error("Error occurred while uploading cover image:", error);
          toast("An error occurred while uploading cover image. Please try again later.");
        }
        setIsSubmitting(false);
      }
    }
  }

   return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">
            Upload Image
          </h2>
        </DialogHeader>
        <ImageUploadDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
          onImageProcessed={onImageProcessed}
        />
      </DialogContent>
    </Dialog>
  );
};