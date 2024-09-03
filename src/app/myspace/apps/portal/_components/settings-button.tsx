import React from 'react';
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

interface SettingsButtonProps {
  onClick: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick }) => {
  return (
    <Button variant="outline" size="icon" onClick={onClick}>
      <Settings className="h-4 w-4" />
    </Button>
  );
};

export default SettingsButton;