import React from 'react';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

const BootstrapButton = styled(Button)({
  display: 'flex',
  position: 'relative',
  backgroundColor: 'transparent',
  flexDirection: 'row',
  alignItems: 'center', 
  color: 'inherit',
  transition: 'all 100ms ease-in',
  textAlign: 'center',
  flex: '0 0 auto',
  fontSize: '1.5rem',
  padding: '10px',
  margin: '6px 14px',
  overflow: 'visible',
  color: 'rgba(0, 0, 0, 0.54)',
  transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  height: '34px',
  width: '90%',
  borderRadius: '8px',
  color: 'hsl(210, 100%, 45%)',
  boxShadow: 'hsla(215, 15%, 97%, 0.4) 0 2px 0 inset, hsla(215, 15%, 92%, 0.5) 0 -1.5px 0 inset, hsla(215, 15%, 89%, 0.5) 0 1px 2px 0',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    backgroundColor: '#fff',
    borderColor: '#0062cc',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: '#fff',
    borderColor: '#005cbf',
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
  },
});

interface ItemProps {
  onClick?: () => void;
  iconStart: LucideIcon;
  iconEnd: LucideIcon; 
};

export const SettingItem = ({
  onClick,
  iconStart: IconStart,
  iconEnd: IconEnd, 
}: ItemProps) => {
  const { t } = useTranslation();
  return (
      <div>
          <BootstrapButton variant="contained" disableRipple startIcon={IconStart} endIcon={IconEnd} onClick={onClick} />
      </div>
  );
};

