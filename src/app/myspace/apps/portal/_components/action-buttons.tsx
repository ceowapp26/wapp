import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button, Input, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Tooltip } from "@nextui-org/react";
import { Plus, File, Folder, Trash2, AlertCircle } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { usePortalContext } from '@/context/portal-context-provider';
import { toast } from "sonner";
import { ProjectStructure } from "@/types/code";
import { motion, AnimatePresence } from "framer-motion";

interface ActionButtonsProps {
  path: string;
  project: {
    _id: Id<"codes">;
    structure: ProjectStructure;
  };
  isFile?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ path, project, isFile }) => {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isFilePopoverOpen, setIsFilePopoverOpen] = useState(false);
  const [isFolderPopoverOpen, setIsFolderPopoverOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [folderName, setFolderName] = useState('');
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const updateProject = useMutation(api.codes.updateProject);
  const { setProjectStructure } = usePortalContext();

  const updateNestedStructure = (structure, pathParts, updateFn) => {
    if (pathParts.length === 0) {
      return updateFn(structure);
    }
    const [current, ...rest] = pathParts;
    return {
      ...structure,
      [current]: {
        ...structure[current],
        ...updateNestedStructure(structure[current], rest, updateFn),
      },
    };
  };

  const showWarningModal = (message) => {
    setWarningMessage(message);
    setIsWarningModalOpen(true);
  };

  const handleCreateFile = async () => {
    if (!fileName.trim()) {
      showWarningModal("File name cannot be empty");
      return;
    }
    const newStructure = updateNestedStructure(
      project.structure,
      path.split('/').filter(Boolean),
      (currentLevel) => ({
        ...currentLevel,
        [fileName]: { type: 'file', content: fileContent },
      })
    );

    try {
      await updateProject({
        id: project._id,
        project: { structure: newStructure }
      });
      setIsCreateMenuOpen(false);
      setFileName('');
      setFileContent('');
      toast.success(`File "${fileName}" created successfully`);
    } catch (error) {
      toast.error("Failed to create file");
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      showWarningModal("Folder name cannot be empty");
      return;
    }

    const newStructure = updateNestedStructure(
      project.structure,
      path.split('/').filter(Boolean),
      (currentLevel) => ({
        ...currentLevel,
        [folderName]: { type: 'directory' },
      })
    );

    try {
      await updateProject({
        id: project._id,
        project: { structure: newStructure }
      });
      setIsCreateMenuOpen(false);
      setFolderName('');
      toast.success(`Folder "${folderName}" created successfully`);
    } catch (error) {
      toast.error("Failed to create folder");
    }
  };

  const handleRemove = async () => {
    const pathParts = path.split('/').filter(Boolean);
    const itemName = pathParts.pop();
    const newStructure = updateNestedStructure(
      project.structure,
      pathParts,
      (currentLevel) => {
        const { [itemName]: removed, ...rest } = currentLevel;
        return rest;
      }
    );

    try {
      await updateProject({
        id: project._id,
        project: { structure: newStructure }
      });
      setProjectStructure(newStructure);
      toast.success(`${isFile ? 'File' : 'Folder'} "${itemName}" removed successfully`);
    } catch (error) {
      toast.error(`Failed to remove ${isFile ? 'file' : 'folder'}`);
    }
  };

  const renderCreateButton = () => (
    <Button
      size="sm"
      variant="light"
      isIconOnly={path !== ""}
      startContent={path === "" ? <Plus size={16} /> : null}
      className={`transition-all hover:scale-105 ${path === "" ? "text-sm bg-green-500" : ""}`}
    >
      {path === "" ? "Create" : <Plus size={16} />}
    </Button>
  );

  const renderRemoveButton = () => (
    <Tooltip content={`Remove ${isFile ? 'File' : 'Folder'}`}>
      <Button
        isIconOnly
        size="sm"
        variant="light"
        onClick={handleRemove}
        className="ml-2 transition-all hover:scale-105 hover:text-red-500"
      >
        <Trash2 size={16} />
      </Button>
    </Tooltip>
  );

  if (isFile) {
    return renderRemoveButton();
  }

  return (
    <div className="flex items-center space-x-2">
      <Popover isOpen={isCreateMenuOpen} onOpenChange={(open) => setIsCreateMenuOpen(open)}>
        <PopoverTrigger>{renderCreateButton()}</PopoverTrigger>
        <PopoverContent>
          <motion.div
            className="flex flex-col gap-2 p-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Popover isOpen={isFilePopoverOpen} onOpenChange={(open) => setIsFilePopoverOpen(open)}>
              <PopoverTrigger>
                <Button variant="flat" startContent={<File size={16} />} className="w-full justify-start">
                  Create File
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <form onSubmit={(e) => { e.preventDefault(); handleCreateFile(); }} className="flex flex-col gap-4 p-4">
                  <Input
                    label="File name"
                    placeholder="Enter file name"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    startContent={<File size={16} />}
                  />
                  <Textarea
                    label="File content"
                    placeholder="Enter file content"
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    rows={5}
                  />
                  <Button color="primary" type="submit">Create File</Button>
                </form>
              </PopoverContent>
            </Popover>

            <Popover isOpen={isFolderPopoverOpen} onOpenChange={(open) => setIsFolderPopoverOpen(open)}>
              <PopoverTrigger>
                <Button variant="flat" startContent={<Folder size={16} />} className="w-full justify-start">
                  Create Folder
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <form onSubmit={(e) => { e.preventDefault(); handleCreateFolder(); }} className="flex flex-col gap-4 p-4">
                  <Input
                    label="Folder name"
                    placeholder="Enter folder name"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    startContent={<Folder size={16} />}
                  />
                  <Button color="primary" type="submit">Create Folder</Button>
                </form>
              </PopoverContent>
            </Popover>
          </motion.div>
        </PopoverContent>
      </Popover>
      {path !== "" && renderRemoveButton()}
      <AnimatePresence>
        {isWarningModalOpen && (
          <Modal isOpen={isWarningModalOpen} onClose={() => setIsWarningModalOpen(false)}>
            <ModalContent>
              {(onClose) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <ModalHeader className="flex flex-col gap-1">Warning</ModalHeader>
                  <ModalBody>
                    <div className="flex items-center space-x-2 text-warning">
                      <AlertCircle size={24} />
                      <p>{warningMessage}</p>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </motion.div>
              )}
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};