"use client"
import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/apps/document/toolbar";
import { ImageUpload } from "@/components/apps/document/image-upload";
import { Cover } from "@/components/apps/document/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { updateDocument } from "@/hooks/use-cloud-document";
import { useQuery, useMutation } from "convex/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
};

const DocumentIdPage = ({
  params
}: DocumentIdPageProps) => {
  const { rightSidebarWidth, isRightSidebarOpened } = useMyspaceContext();  
  const [margin, setMargin] = useState<number>(0);
  useEffect(() => {
    const calculateMargin = () => {
      let newMargin = 0;
      if (isRightSidebarOpened) newMargin += rightSidebarWidth;
      return newMargin;
    };
    setMargin(calculateMargin());
  }, [ rightSidebarWidth, isRightSidebarOpened]);

  const Editor = useMemo(() => dynamic(() => import("@/components/apps/document/editor"), { ssr: false }) ,[]);

  const document = useQuery(api.documents.getDocumentById, {
    documentId: params.documentId
  });

  const updateDocument = useMutation(api.documents.updateDocument);

  const onChange = (content: string) => {
    updateDocument({
      id: params.documentId,
      content
    });
  };

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="w-full p-4 mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>
  }

  return ( 
    <div className="doc">
      <div 
        className="w-full max-h-[45vh]"
        style={{
        width: `calc(100% - ${margin}px)`,
        right: isRightSidebarOpened ? `${rightSidebarWidth}px` : '0',
        }}
      >
        <Cover url={document.coverImage} />
        <ImageUpload initialData={document} url={document.coverImage} />
      </div>
      <div className="wapp-editor relative w-full max-h-[100vh] px-8 mx-auto">
        <Toolbar initialData={document} url={document.coverImage} />
        <Editor
          onChange={onChange}
          initialContent={document.content}
          id={document._id}
          documentTitle={document.title}
        />
      </div>
    </div>
   );
}
 
export default DocumentIdPage;