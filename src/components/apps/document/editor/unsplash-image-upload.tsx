import React from 'react';
import { UnsplashImageSkeleton } from "../unsplash-image-skeleton";
import { EdgeStoreApiClientError } from '@edgestore/react/shared';
import { createUnSplashImage } from "./plugins/unsplash-upload-images";

interface UnsplashImageProp {
  view: EditorView;
  pos: number;
}

export const UnsplashImageModal = ({ view, pos } : UnsplashImageProp) => {
  const handleUpdate = async (url: string) => {
    createUnSplashImage(url, view, pos);
  };
  return (
    <React.Fragment>
      <UnsplashImageSkeleton handleUpdate={handleUpdate} />
    </React.Fragment>
  );
};

