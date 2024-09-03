import React, { useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { FileIcon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Item } from "./document-item";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { motion, AnimatePresence } from 'framer-motion';

interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  onDragOver: (e: React.DragEvent, document: Doc<"documents">) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, document: Doc<"documents">) => void;
  dropTarget: {id: string, effect: 'above' | 'below' | 'inside'} | null;
  setDropTarget: React.Dispatch<React.SetStateAction<{id: string, effect: 'above' | 'below' | 'inside'} | null>>;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  parentDocumentId,
  level = 0,
  onDragOver,
  onDragLeave,
  onDrop,
  dropTarget,
  setDropTarget
}) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const { setActiveDocument, draggingItem, setDraggingItem } = useMyspaceContext();

  const documents = useQuery(api.documents.getDocumentSidebar, {
    parentDocument: parentDocumentId
  });

  const items = useMemo(() => documents || [], [documents]);

  const onExpand = useCallback((documentId: string) => {
    setExpanded(prevExpanded => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId]
    }));
  }, []);

  const onRedirect = useCallback((documentId: string) => {
    if (!isDragging) {
      setActiveDocument(documentId);
      router.push(`/myspace/apps/portal/document/${documentId}`);
    }
  }, [isDragging, setActiveDocument, router]);

  const handleDragStart = useCallback((e: React.DragEvent, document: Doc<"documents">) => {
    setDraggingItem(document);
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', document._id);
    e.dataTransfer.effectAllowed = 'move';
    e.stopPropagation();
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggingItem(null);
    setDropTarget(null);
  }, []);
  
  if (!documents) {
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
    <AnimatePresence>
      {items.map((document) => (
        <motion.div
          key={document._id}
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative",
            dropTarget?.id === document._id && "before:absolute before:left-0 before:right-0",
            dropTarget?.id === document._id && dropTarget.effect === 'above' && "before:top-0 before:h-2 before:bg-blue-500",
            dropTarget?.id === document._id && dropTarget.effect === 'below' && "before:bottom-0 before:h-2 before:bg-blue-500",
            dropTarget?.id === document._id && dropTarget.effect === 'inside' && "before:top-0 before:bottom-0 before:w-2 before:bg-green-500"
          )}
          draggable
          onDragStart={(e) => handleDragStart(e, document)}
          onDragEnd={handleDragEnd}
          onDrop={(e) => onDrop(e, draggingItem, document)}
          onDragOver={(e) => onDragOver(e, draggingItem, document)}
          onDragLeave={onDragLeave}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              opacity: isDragging ? 0.5 : 1,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
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
          </motion.div>
          {expanded[document._id] && (
            <DocumentList
              parentDocumentId={document._id}
              level={level + 1}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              dropTarget={dropTarget}
              setDropTarget={setDropTarget}
            />
          )}
        </motion.div>
      ))}
    </AnimatePresence>
  );
};