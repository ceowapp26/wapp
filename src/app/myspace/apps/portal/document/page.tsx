"use client";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle, FileText, ArrowRight, Book, Pen, Share2, FolderTree, Brain, Shield } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
  >
    <Icon className="h-10 w-10 text-blue-500 mb-4" />
    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
);

const DocumentPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { activeOrg, setActiveDocument } = useMyspaceContext();
  const createDocument = useMutation(api.documents.createDocument);
  const [isHovering, setIsHovering] = useState(false);
  const userName = user?.firstName ? capitalizeFirstLetter(user.firstName) : 'WApp-Doc';

  const onCreate = () => {
    let createDocumentFunc;
    if (activeOrg.orgName === "Select Account" || !activeOrg.orgName || activeOrg.orgName === "Personal Account") {
      createDocumentFunc = createDocument({ title: "Untitled" });
    } else {
      createDocumentFunc = createDocument({ title: "Untitled", activeOrgId: activeOrg.orgId });
    }
    const promise = createDocumentFunc
      .then((documentId) => {
        router.prefetch(`/myspace/apps/portal/document/${documentId}`);
        router.push(`/myspace/apps/portal/document/${documentId}`);
        setActiveDocument(documentId);
      });
    toast.promise(promise, {
      loading: "Creating a new document...",
      success: "New document created!",
      error: "Failed to create a new document."
    });
  };

  return ( 
    <div className="flex flex-col items-center justify-start px-6 pt-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 h-full overflow-auto">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className="text-center mb-16 flex flex-col justify-center items-center"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="relative w-32 h-32 mx-auto mb-8"
        >
          <FileText className="h-32 w-32 absolute top-0 left-0 text-blue-500 dark:text-blue-400" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <Pen className="h-16 w-16 text-indigo-500 dark:text-indigo-400" />
          </motion.div>
        </motion.div>
        <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Welcome to {userName}&apos;s Workspace
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Your creative space for ideas and collaboration
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
        >
          <Button 
            onClick={onCreate}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition duration-300 ease-in-out flex items-center"
          >
            <PlusCircle className="h-6 w-6 mr-2" />
            Create a new document
            <AnimatePresence>
              {isHovering && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-6 w-6 ml-2" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl"
      >
        <FeatureCard 
          icon={Book} 
          title="Organize" 
          description="Keep your documents organized and easily accessible with intuitive folder structures"
        />
        <FeatureCard 
          icon={Pen} 
          title="Edit" 
          description="Powerful editing tools at your fingertips for rich text formatting and multimedia integration"
        />
        <FeatureCard 
          icon={Share2} 
          title="Collaborate" 
          description="Share and work together in real-time with seamless collaboration features"
        />
        <FeatureCard 
          icon={FolderTree} 
          title="Advanced Management" 
          description="Hierarchical organization with tags, labels, and advanced search capabilities"
        />
        <FeatureCard 
          icon={Brain} 
          title="AI-Powered Features" 
          description="Leverage AI for smart suggestions, auto-summarization, and content generation"
        />
        <FeatureCard 
          icon={Shield} 
          title="Secure & Private" 
          description="Your data is protected with end-to-end encryption and customizable privacy settings"
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-16 text-center"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Start your journey by creating your first document or exploring existing documents
        </p>
      </motion.div>
    </div>
   );
}
 
export default DocumentPage;