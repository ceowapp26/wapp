import React from 'react'; 
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { FileIcon } from "lucide-react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Item } from "./item";
import { toast } from "sonner";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { selectItems, setItems } from '@/redux/features/apps/document/documentsSlice';

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
}

export const DocumentList = ({
  parentDocumentId,
  level = 0
}: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [items, setItems] = useState<Doc<"documents">[]>([]);
  const [draggingItem, setDraggingItem] = useState<{ document: Doc<"documents">, parentDocumentId: Id<"documents"> | undefined } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseY, setMouseY] = useState<number>(0);
  const [targetRect, setTargetRect] = useState(null);
  const { setActiveDocument } = useMyspaceContext();
  const updateParentDocument = useMutation(api.documents.updateParentDocument);
  const removeParentDocument = useMutation(api.documents.removeParentDocument);
  const updateDocumentPosition = useMutation(api.documents.updateDocumentPosition)

  const handleUpdateParentDocument = async (
    id: Id<"documents">, 
    parentDocument: Id<"documents">
  ) => {
     try {
      updateParentDocument({ id: id, parentDocument: parentDocument });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleRemoveParentDocument = async (
    id: Id<"documents">, 
  ) => {
    try {
      updateParentDocument({ id: id });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleUpdatePosition = async (
    id: Id<"documents">, 
    position: number,
  ) => {
    try {
      updateDocumentPosition({ id: id, position: position });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const onExpand = (documentId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId]
    }));
  };

  const documents = useQuery(api.documents.getDocumentSidebar, {
    parentDocument: parentDocumentId
  });

  const onRedirect = (documentId: string) => {
    if (!isDragging) {
      setActiveDocument(documentId)
      router.push(`/myspace/apps/document/${documentId}`);
    }
  };

  useEffect(() => {
    if (documents) {
      setItems(documents);
    }
  }, [documents]);

  const handleDragStart = (document: Doc<"documents">) => {
    setDraggingItem(document);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetDocument: Doc<"documents"> | null) => {
    if (draggingItem) {
      if (targetDocument) {
      handleUpdatePosition(draggingItem._id, targetDocument.position)
      handleUpdatePosition(targetDocument._id, draggingItem.position)
      } else {
        return;
      }
    }
    setDraggingItem(null);
    setIsDragging(false);
  };

  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      {items.length === 0 && (
        <p
          style={{
            paddingLeft: level ? `${(level * 12) + 25}px` : undefined
          }}
          className={cn(
            "text-sm font-medium text-muted-foreground/80",
            "last:block",
            level === 0 && "hidden"
          )}
        >
          No pages inside
        </p>
      )}
      {items.map((document) => (
        <div
          key={document._id}
          draggable
          onDragStart={() => handleDragStart(document)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e)}
          onDrop={(e) => handleDrop(e, document)}
        >
          <Item
            id={document._id}
            label={document.title}
            icon={FileIcon}
            documentIcon={document.icon}
            active={params.documentId === document._id}
            level={level}
            onClick={() => onRedirect(document._id)}
            onExpand={() => onExpand(document._id)}
            expanded={expanded[document._id]}
            isDragging={isDragging}
            isDocument
          />
          {expanded[document._id] && (
            <DocumentList
              parentDocumentId={document._id}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </>
  );
};

