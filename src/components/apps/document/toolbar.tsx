"use client";
import { ElementRef, useRef, useState } from "react";
import { ImageIcon, Smile, X } from "lucide-react";
import { useMutation } from "convex/react";
import TextareaAutosize from "react-textarea-autosize";
import { useCoverImage } from "@/hooks/use-cover-image";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { IconPicker } from "./icon-picker";

interface ToolbarProps {
  initialData: Doc<"documents">;
  url?: string;
  preview?: boolean;
}

export const Toolbar = ({ initialData, url, preview }: ToolbarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const updateDocument = useMutation(api.documents.updateDocument);
  const removeDocumentIcon = useMutation(api.documents.removeDocumentIcon);

  const coverImage = useCoverImage();

  const enableInput = () => {
    if (preview) return;
    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = (value: string) => {
    setValue(value);
    updateDocument({
      id: initialData._id,
      title: value || "Untitled"
    });
  };

  const onKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = (icon: string) => {
    updateDocument({
      id: initialData._id,
      icon,
    });
  };

  const onRemoveIcon = () => {
    removeDocumentIcon({
      id: initialData._id
    });
  };

  return (
    <div className="group/toolbar relative w-full">
      <div className="opacity-0 group-hover/toolbar:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview ? (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        ) : (
          <Button
            onClick={onRemoveIcon}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <Smile className="h-4 w-4 mr-2" />
            Remove icon
          </Button>
        )}
        {!initialData.coverImage && !url && !preview ? (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover
          </Button>
        ) : (
          null
        )}
      </div>
      <div className="flex items-center">
        {!!initialData.icon && !preview ? (
          <div className="flex items-center gap-x-2 px-6 py-6">
            <IconPicker onChange={onIconSelect}>
              <p className="text-2xl hover:opacity-75 transition">
                {initialData.icon}
              </p>
            </IconPicker>
          </div>
        ) : (
          !!initialData.icon && preview && (
            <p className="text-2xl px-6 py-6">{initialData.icon}</p>
          )
        )}
        {isEditing && !preview ? (
          <TextareaAutosize
            ref={inputRef}
            onBlur={disableInput}
            onKeyDown={onKeyDown}
            value={value}
            onChange={(e) => onInput(e.target.value)}
            className="text-2xl bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
          />
        ) : (
          <div
            onClick={enableInput}
            className="text-2xl py-2 font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
          >
            {initialData.title}
          </div>
        )}
      </div>
    </div>
  );
};
