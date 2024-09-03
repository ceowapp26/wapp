import React from "react"
import { UnsplashImageSkeleton } from "../unsplash-image-skeleton";
import { useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { useEdgeStore } from '@/lib/edgestore';
import { api } from '@/convex/_generated/api';
import { EdgeStoreApiClientError } from '@edgestore/react/shared';

export const UnsplashCoverModal = ({ handleClose }) => {
  const params = useParams();
  const updateDocument = useMutation(api.documents.updateDocument);
  const { edgestore } = useEdgeStore();
  const handleUpdate = async (url) => {
    try {
      await updateDocument({ id: params.documentId, coverImage: url });
    } catch (error) {
      handleUploadError(error);
    }
  };

  const handleUploadError = (error) => {
    if (error.response && error.response.status === 429) {
      toast.error('You have reached your request limit for the day.');
    } else if (error instanceof EdgeStoreApiClientError) {
      const { code, details } = error.data;
      if (code === 'FILE_TOO_LARGE') {
        toast.error(`File too large. Max size is ${details.maxFileSize}`);
      } else if (code === 'MIME_TYPE_NOT_ALLOWED') {
        toast.error(`File type not allowed. Allowed types are ${details.allowedMimeTypes.join(', ')}`);
      } else if (code === 'UPLOAD_NOT_ALLOWED') {
        toast.error("You don't have permission to upload files here.");
      }
    } else {
      console.error("Error occurred while uploading cover image:", error);
      toast.error("An error occurred while uploading cover image. Please try again later.");
    }
  };

  return (
    <React.Fragment>
      <UnsplashImageSkeleton handleClose={handleClose} handleUpdate={handleUpdate} />
    </React.Fragment>
  );
};

