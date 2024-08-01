"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useMyspaceContext } from '@/context/myspace-context-provider';

const DocumentPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { activeOrg, setActiveDocument } = useMyspaceContext();
  const createDocument = useMutation(api.documents.createDocument);

  const onCreate = () => {
    let createDocumentFunc;
    if (activeOrg.orgName === "Select Account" || !activeOrg.orgName || activeOrg.orgName === "Personal Account") {
      createDocumentFunc = createDocument({ title: "Untitled" });
    } else {
      createDocumentFunc = createDocument({ title: "Untitled", activeOrgId: activeOrg.orgId });
    }

    const promise = createDocumentFunc
      .then((documentId) => {
        router.prefetch(`/myspace/apps/document/${documentId}`);
        router.push(`/myspace/apps/document/${documentId}`);
        setActiveDocument(documentId);
      });

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });
  };

  return ( 
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/doc/empty.png"
        height="300"
        width="300"
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/doc/empty-dark.png"
        height="300"
        width="300"
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s WApp Doc
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>

    </div>
   );
}
 
export default DocumentPage;