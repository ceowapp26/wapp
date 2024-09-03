"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader
} from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "@/components/apps/document/single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { EdgeStoreApiClientError } from '@edgestore/react/shared';

export const CoverImageModal = () => {
  const params = useParams();
  const updateDocument = useMutation(api.documents.updateDocument);
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  }

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
        console.log(res);

        // Update document with the uploaded cover image URL
        await updateDocument({
          id: params.documentId as Id<"documents">,
          coverImage: res.url
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
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">
            Cover Image
          </h2>
        </DialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};
