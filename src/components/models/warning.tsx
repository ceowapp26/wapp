import React, { useState } from 'react';
import { Snackbar, Tooltip, Button, IconButton, Typography, Box } from '@mui/material';
import { useModelSettings } from "@/hooks/use-model-settings";
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { ModelOption } from '@/types/ai';
import { useRouter } from 'next/navigation';
import Slide from '@mui/material/Slide';
import { useGeneralContext } from '@/context/general-context-provider';
import { formatDistanceToNow } from 'date-fns';
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { Grip } from 'lucide-react';

interface WarningProps {
  type: "CURRENT" | "REMINDER" | "SHORTAGE" | "UNSUPPORTED";
  nextTimeUsage?: string;
  inputModel?: ModelOption;
}

const Warning: React.FC<WarningProps> = ({ type, nextTimeUsage, inputModel }) => {
  const { setShowWarning } = useGeneralContext();
  const settings = useModelSettings();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const getMessage = () => {
    const timeUntilNext = nextTimeUsage ? formatDistanceToNow(new Date(nextTimeUsage), { addSuffix: true }) : 'some time';
    switch (type) {
      case "CURRENT":
        return `You have reached the AI usage limit. The next available usage will be in ${timeUntilNext}. Please consider the following options:`;
      case "REMINDER":
        return "You have reached the maximum token limit. To continue using AI features, please upgrade your plan or purchase additional tokens.";
      case "SHORTAGE":
        return `You have reached the AI usage limit. Please consider the following options:`;
      case "UNSUPPORTED":
        return `The current model ${inputModel} is not supported in your country, region, or territory. Please choose an alternative model to ensure uninterrupted service.`;
      default:
        return "";
    }
  };

  const handleBilling = () => {
    setShowWarning(false);
    router.push("/settings/billing");
  };

  const handleSetting = () => {
    setShowWarning(false);
    settings.onOpen();
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
    setShowWarning(false);
  };

  return (
    <Snackbar
      open={open}
      TransitionComponent={Slide}
      TransitionProps={{ direction: "up" }}
      autoHideDuration={type === "REMINDER" ? 12000 : null}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderRadius: '12px',
          padding: '20px',
          maxWidth: '400px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: '8px',
            right: '8px',
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        
        <Box display="flex" alignItems="center" mb={2}>
          <WarningIcon sx={{ color: '#FFA500', mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="bold" color="#FFA500">
            {type === "UNSUPPORTED" ? "Unsupported Region" : "Usage Limit Reached"}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="#fff" mb={2}>
          {getMessage()}
        </Typography>
        {type === "UNSUPPORTED" ? (
          <Box display="flex" justifyContent="center">
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    fontWeight: 'bold',
                    textTransform: 'none',
                    backgroundColor: '#4CAF50',
                    '&:hover': { backgroundColor: '#45a049' },
                  }}
                >
                  <InfoIcon sx={{ mr: 1 }} />
                  How to
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Typography variant="body2">
                  To update the default model, please follow these steps:
                  <ol>
                    <li>Navigate to the <Grip /> icon on the navbar.</li>
                    <li>Access the General Settings.</li>
                    <li>Open the AI Model Settings section.</li>
                    <li>Select your preferred model from the dropdown menu to set it as the default.</li>
                  </ol>
                </Typography>
              </PopoverContent>
            </Popover>
          </Box>
        ) : (
          <Box display="flex" justifyContent="space-between">
            <Tooltip title={type === "CURRENT" || type === "SHORTAGE" ? "Purchase more tokens" : "Upgrade your plan"} arrow>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBilling}
                sx={{
                  fontWeight: 'bold',
                  textTransform: 'none',
                  backgroundColor: '#4CAF50',
                  '&:hover': { backgroundColor: '#45a049' },
                }}
              >
                {type === "CURRENT" || type === "SHORTAGE" ? "Purchase Tokens" : "Upgrade Plan"}
              </Button>
            </Tooltip>
            <Tooltip title={type === "CURRENT" || type === "SHORTAGE" ? "Open settings" : "Purchase more tokens"} arrow>
              <Button
                variant="outlined"
                color="secondary"
                onClick={type === "CURRENT" || type === "SHORTAGE" ? handleSetting : handleBilling}
                sx={{
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderColor: '#fff',
                  color: '#fff',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                {type === "CURRENT" || type === "SHORTAGE" ? "Settings" : "Purchase Tokens"}
              </Button>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Snackbar>
  );
};

export default Warning;