import React from 'react';
import { Tabs, Tab } from "@nextui-org/react";
import { FiFile, FiMessageSquare, FiMusic, FiImage, FiVideo } from "react-icons/fi";
import Files from "./file-component";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FileInterface, CodeFile } from "@/types/chat";
import { Id } from "@/convex/_generated/dataModel";

const getIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'chats': return <FiMessageSquare className="text-blue-500" />;
    case 'documents': case 'codes': return <FiFile className="text-green-500" />;
    case 'audios': return <FiMusic className="text-yellow-500" />;
    case 'images': return <FiImage className="text-purple-500" />;
    case 'videos': return <FiVideo className="text-red-500" />;
    default: return <FiFile className="text-gray-500" />;
  }
};

interface ResourcesProps {
  resources: Record<string, any[]>;
  content: string;
  setCurrentCodeFile?: React.Dispatch<React.SetStateAction<CodeFile | null>>;
  setCurrentEmbeddedFile?: React.Dispatch<React.SetStateAction<FileInterface | null>>;
  setCurrentComponent?: React.Dispatch<React.SetStateAction<string>>;
}

const ResourceTabs: React.FC<ResourcesProps> = ({ 
  resources, 
  content,
  setCurrentCodeFile, 
  setCurrentEmbeddedFile, 
  setCurrentComponent,
}) => {
  const getDocumentByID = useMutation(api.documents.getDocumentByID);
  const updateDocument = useMutation(api.documents.updateDocument);
  const getProject = useMutation(api.codes.getProject);
  const updateProject = useMutation(api.codes.updateProject);

  const handleFileSelect = async (item: any, actionType: 'view' | 'insert' | 'replace') => {
    switch(actionType) {
      case "view":
        setCurrentComponent && setCurrentComponent(null);
        setCurrentEmbeddedFile && setCurrentEmbeddedFile(item);
        break;
      case "insert":
        try {
          const selectedDocument = await getDocumentByID({ documentId: item.id as Id<"documents"> });
          if (selectedDocument) {
            let newContent;
            try {
              newContent = JSON.parse(selectedDocument.content);
            } catch (parseError) {
              newContent = { type: "doc", content: [] };
            }
            newContent.content.push({
              type: "paragraph",
              attrs: { textAlign: "left" },
              content: [{ type: "text", text: content }]
            });
            const updatedDocument = {
              id: item.id,
              content: JSON.stringify(newContent)
            };
            try {
              const result = await updateDocument(updatedDocument);
            } catch (updateError) {
              console.error("Error updating document:", updateError);
              if (updateError instanceof Error) {
                console.error("Update error details:", updateError.message, updateError.stack);
              }
            }
          } else {
            console.error("Selected document not found");
          }
        } catch (error) {
          console.error("Error inserting content:", error);
          if (error instanceof Error) {
            console.error("Error details:", error.message, error.stack);
          }
        }
        break;
      case "replace":
        try {
          const selectedDocument = await getDocumentByID({ documentId: item.id as Id<"documents"> });
          if (selectedDocument) {
            const newContent = {
              type: "doc",
              content: [
                {
                  type: "paragraph",
                  attrs: { textAlign: "left" },
                  content: [{ type: "text", text: content }]
                }
              ]
            };
            const updatedDocument = {
              id: item.id,
              content: JSON.stringify(newContent)
            };
            try {
              const result = await updateDocument(updatedDocument);
            } catch (updateError) {
              console.error("Error updating document:", updateError);
              if (updateError instanceof Error) {
                console.error("Update error details:", updateError.message, updateError.stack);
              }
            }
          } else {
            console.error("Selected document not found");
          }
        } catch (error) {
          console.error("Error replacing content:", error);
          if (error instanceof Error) {
            console.error("Error details:", error.message, error.stack);
          }
        }
        break;
    }
  };

  const handleCodeSelect = async (projectId: string, filePath: string, actionType: 'view' | 'insert' | 'replace') => {
    try {
      const selectedProject = await getProject({ projectId: projectId as Id<"codes"> });
      if (!selectedProject) {
        console.error('Selected project not found');
        return;
      }

      let updatedStructure = JSON.parse(JSON.stringify(selectedProject.structure));
      const pathParts = filePath.split('/');
      let currentLevel = updatedStructure;
      
      // Navigate to the parent directory of the file
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!currentLevel[pathParts[i]]) {
          currentLevel[pathParts[i]] = {};
        }
        currentLevel = currentLevel[pathParts[i]];
      }
      
      const fileName = pathParts[pathParts.length - 1];

      // Ensure the file exists in the structure
      if (!currentLevel[fileName]) {
        currentLevel[fileName] = { content: "", type: "file" };
      }
      switch(actionType) {
        case "view":
          setCurrentComponent && setCurrentComponent(null);
          setCurrentCodeFile && setCurrentCodeFile({
            name: fileName,
            content: currentLevel[fileName].content,
            type: "text",
            size: currentLevel[fileName].content.length,
          });
          break;
        case "insert":
          currentLevel[fileName].content += '\n' + content;
          await updateProjectStructure(projectId, updatedStructure);
          break;
        case "replace":
          currentLevel[fileName].content = content;
          await updateProjectStructure(projectId, updatedStructure);
          break;
      }
    } catch (error) {
      console.error("Error in handleCodeSelect:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
      }
      // Handle error (e.g., show a notification to the user)
    }
  };

  // Helper function to update project structure
  const updateProjectStructure = async (projectId: Id<"codes">, updatedStructure: any) => {
    try {
      const result = await updateProject({
        id: projectId,
        project: {
          structure: updatedStructure
        }
      });
      console.log('Update result:', result);
      return result;
    } catch (updateError) {
      console.error('Error in updateProject mutation:', updateError);
      if (updateError instanceof Error) {
        console.error('Update error details:', updateError.message, updateError.stack);
      }
      throw updateError;
    }
  };

  return (
    <Tabs
      aria-label="Resource tabs"
      color="primary"
      variant="underlined"
      classNames={{
        tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
        cursor: "w-full bg-primary",
        tab: "max-w-fit px-0 h-12",
        tabContent: "group-data-[selected=true]:text-blue-600 text-gray-800"
      }}
    >
      {Object.entries(resources).map(([key, data]) => (
        <Tab 
          key={key} 
          title={
            <div className="flex items-center space-x-2">
              {getIcon(key)}
              <span className="capitalize">{key}</span>
            </div>
          }
        >
          <Files 
            resourceType={key} 
            data={data} 
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'type', label: 'Type' },
            ]}
            handleFileSelect={key === 'codes' ? handleCodeSelect : handleFileSelect}
          />
        </Tab>
      ))}
    </Tabs>
  );
};

export default ResourceTabs;

