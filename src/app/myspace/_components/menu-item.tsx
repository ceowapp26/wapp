import React from 'react';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const BootstrapButton = styled(Button)({
  display: 'inline-flex',
  justifyContent: 'center', 
  position: 'relative',
  boxSizing: 'border-box',
  backgroundColor: 'transparent',
  outline: 0,
  border: 0,
  margin: 0,
  borderRadius: 0,
  padding: 0,
  alignItems: 'center', 
  userSelect: 'none', 
  verticalAlign: 'middle',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'all 100ms ease-in',
  textAlign: 'center',
  flex: '0 0 auto',
  fontSize: '1.5rem',
  padding: '0px',
  overflow: 'visible',
  color: 'rgba(0, 0, 0, 0.54)',
  transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  minWidth: '20px',
  height: '34px',
  width: '34px',
  borderRadius: '12px',
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
  desc?: string;
  onClick?: () => void;
  icon: LucideIcon;
};

export const NavbarItem = ({
  desc,
  onClick,
  icon: Icon,
}: ItemProps) => {
  const { t } = useTranslation();
  return (
      <div>
        <BootstrapTooltip describeChild title={t(desc)}>
          <BootstrapButton variant="contained" disableRipple onClick={onClick}>
            <Icon color="#000" size={20} className="select-none cursor-pointer inline-block flex-shrink text-muted-foreground" />
          </BootstrapButton>
        </BootstrapTooltip>
      </div>
  );
};
