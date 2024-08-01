"use client"
import React, { useState, useEffect } from 'react';
import { Textarea, Button } from "@nextui-org/react";
import { Container } from '@mui/material';
import { Clipboard } from 'lucide-react';
import { GradientLoadingCircle } from "@/components/gradient-loading-circle";
import { toast } from "sonner";

const TextEditor = ({ initialContent }) => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  return (
    <Container>
      {initialContent ? (
        <React.Fragment>
          <Textarea
            label="AI Answer:"
            description="Adjust the answer as you like."
            fullWidth
            variant="faded"
            className="p-2"
            margin="normal"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            classNames={{
              label: "text-violet-500 font-semibold text-lg",
            }}
            required
          />
          <Button className="bg-black text-white p-4 mt-4" fullWidth onClick={handleCopy}>
            <Clipboard />
            Copy
          </Button>
        </React.Fragment>
      ) : (
        <GradientLoadingCircle />
      )}
    </Container>
  );
};

export default TextEditor;
