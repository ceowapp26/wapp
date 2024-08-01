"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, RefreshCw, AlertTriangle } from "lucide-react";

interface BannerProps {
  documentId: Id<"documents">;
}

export const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();
  const removeDocument = useMutation(api.documents.removeDocument);
  const restoreDocument = useMutation(api.documents.restoreDocument);
  const [isVisible, setIsVisible] = useState(true);

  const onRemove = async () => {
    try {
      await removeDocument({ id: documentId });
      toast.success("Note deleted!");
      router.push("/myspace/apps/document");
    } catch (error) {
      toast.error("Failed to delete note.");
    }
  };

  const onRestore = () => {
    const promise = restoreDocument({ id: documentId });
    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    });
    setIsVisible(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-4 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white">
                <AlertTriangle className="h-5 w-5" />
                <p className="text-sm font-medium">
                  This page is in the Trash.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={onRestore}
                  variant="outline"
                  className="bg-white text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors duration-200"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restore page
                </Button>
                <ConfirmModal onConfirm={onRemove}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors duration-200"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete forever
                  </Button>
                </ConfirmModal>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};