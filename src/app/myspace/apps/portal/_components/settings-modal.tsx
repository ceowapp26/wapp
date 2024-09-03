import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    showPromptInput: boolean;
    showComponentEditor: boolean;
    showComponentPreview: boolean;
    showSuggestions: boolean;
  };
  onSettingChange: (setting: string, value: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-prompt-input">Show Prompt Input</Label>
            <Switch
              id="show-prompt-input"
              checked={settings.showPromptInput}
              onCheckedChange={(checked) => onSettingChange('showPromptInput', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-component-editor">Show Component Editor</Label>
            <Switch
              id="show-component-editor"
              checked={settings.showComponentEditor}
              onCheckedChange={(checked) => onSettingChange('showComponentEditor', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-component-preview">Show Component Preview</Label>
            <Switch
              id="show-component-preview"
              checked={settings.showComponentPreview}
              onCheckedChange={(checked) => onSettingChange('showComponentPreview', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-suggestions">Show Suggestions</Label>
            <Switch
              id="show-suggestions"
              checked={settings.showSuggestions}
              onCheckedChange={(checked) => onSettingChange('showSuggestions', checked)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;