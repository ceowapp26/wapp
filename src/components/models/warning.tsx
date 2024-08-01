import React, { useState } from 'react';
import { Snackbar, Tooltip, Button, IconButton, Typography, Box } from '@mui/material';
import { useModelSettings } from "@/hooks/use-model-settings";
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import { useRouter } from 'next/navigation';
import Slide from '@mui/material/Slide';
import { useGeneralContext } from '@/context/general-context-provider';
import { formatDistanceToNow } from 'date-fns';

const Warning = ({ type, nextTimeUsage }) => {
  const { setShowWarning } = useGeneralContext();
  const settings = useModelSettings();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const getMessage = () => {
    const timeUntilNext = formatDistanceToNow(new Date(nextTimeUsage), { addSuffix: true });
    switch (type) {
      case "CURRENT":
        return `You've reached the AI usage limit. Next available in ${timeUntilNext}. Consider the options below:`;
      case "REMINDER":
        return "You've reached the max tokens. Please upgrade your plan or purchase more tokens to continue using AI features.";
      case "SHORTAGE":
        return `You've reached the AI usage limit. Consider the options below:`;
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

  const handleClose = (event, reason) => {
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
            Usage Limit Reached
          </Typography>
        </Box>
        
        <Typography variant="body2" color="#fff" mb={2}>
          {getMessage()}
        </Typography>
        
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
      </Box>
    </Snackbar>
  );
};

export default Warning;