import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '@/redux/features/apps/document/store';
import { importPromptCSV } from '@/utils/prompt';
import { Button, Input, Card, CardBody, Progress } from '@nextui-org/react';
import { Upload, CheckCircle, XCircle } from 'lucide-react';

const ImportPrompt = () => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [alert, setAlert] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = () => {
    if (!inputRef.current) return;
    const file = inputRef.current.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvString = event.target?.result;
        try {
          const results = importPromptCSV(csvString);
          const prompts = useStore.getState().prompts;
          const setPrompts = useStore.getState().setPrompts;
          const newPrompts = results.map((data) => ({
            id: uuidv4(),
            name: Object.values(data)[0],
            prompt: Object.values(data)[1],
          }));
          setPrompts(prompts.concat(newPrompts));
          setAlert({ message: 'Successfully imported!', success: true });
        } catch (error) {
          setAlert({ message: error.message, success: false });
        }
        setIsUploading(false);
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardBody className="space-y-4">
        <Input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".csv"
        />
        <Button
          auto
          color="primary"
          variant="flat"
          startContent={<Upload size={18} />}
          onClick={() => inputRef.current?.click()}
        >
          {fileName || t('Choose CSV File')}
        </Button>
        <Button
          auto
          color="primary"
          onClick={handleFileUpload}
          disabled={!fileName || isUploading}
        >
          {isUploading ? t('Importing...') : t('Import')}
        </Button>
        {isUploading && (
          <Progress
            indeterminate
            value={50}
            color="primary"
            aria-label="Importing..."
          />
        )}
        {alert && (
          <div className={`flex items-center ${alert.success ? 'text-green-500' : 'text-red-500'}`}>
            {alert.success ? <CheckCircle size={18} /> : <XCircle size={18} />}
            <span className="ml-2">{alert.message}</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ImportPrompt;