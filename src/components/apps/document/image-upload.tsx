import * as React from 'react';
import { useEffect } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/material/styles';
import { EllipsisVertical } from 'lucide-react';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useCoverImage } from "@/hooks/use-cover-image";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useEdgeStore } from "@/lib/edgestore";
import { EdgeStoreApiClientError } from '@edgestore/react/shared';
import { HardDriveUpload, ImageUp, ArrowDownUp, Trash2 } from 'lucide-react';
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { UnsplashCoverModal } from "@/components/apps/document/modals/unsplash-image-modal";

interface ImageProps {
  initialData: Doc<"documents">;
  url?: string;
  preview?: boolean;
}

export const ImageUpload = ({ initialData, url, preview }: ImageProps) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [unsplashModalOpened, setUnsplashModalOpened] = React.useState(false);
  const [groupOpacity, setGroupOpacity] = React.useState(false);
  const coverImage = useCoverImage();
  const params = useParams();
  const removeDocumentCoverImage = useMutation(api.documents.removeDocumentCoverImage);
  const { edgestore } = useEdgeStore();
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const { coverReposition, setCoverReposition } = useMyspaceContext();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setGroupOpacity(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUnsplashModalOpened(false);
  };

  const handleCoverReposition = () => {
    setCoverReposition(!coverReposition);
  };

  const onRemove = async () => {
    if (url) {
      try {
        await edgestore.publicFiles.delete({
          url: url,
        });
      } catch (error) {
        if (error instanceof EdgeStoreApiClientError) {
          if (error.data.code === 'DELETE_NOT_ALLOWED') {
            alert("You don't have permission to delete this file.");
          }
        }
      }
    }
    removeDocumentCoverImage({
      id: params.documentId as Id<"documents">
    });
  };

  useEffect(() => {
    if (anchorEl) {
      setGroupOpacity(true);
    } else {
      const timer = setTimeout(() => {
        setGroupOpacity(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [anchorEl]);

  return (
    <div className={`${url ? "flex" : "hidden"} group/image relative top-4 px-6 h-full z-[99]`}>
      <div className={`${groupOpacity ? "opacity-100" : "opacity-0"} flex group-hover/image:opacity-100 items-center gap-x-1 py-4`}>
        <div 
          className={`absolute right-20 inline-flex items-center px-1 py-1 rounded-xl hover:bg-gray-500/10 dark:hover:bg-slate-700 transition-colors duration-200 text-black text-sm flex-shrink-0 border dark:hover:text-white dark:text-slate-100 dark:border-white border-black/20 transition-opacity`} 
          onClick={handleClick}
        >
          <EllipsisVertical size={20} />
        </div>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
        {!unsplashModalOpened ? (
          <Box sx={{ padding: '4px', width: '100%', zIndex: '98', maxWidth: 360, bgcolor: 'background.paper' }}>
            <nav aria-label="main mailbox folders">
              <List>
                {url && !preview && (
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => coverImage.onReplace(url)}>
                      <ListItemIcon>
                        <HardDriveUpload />
                      </ListItemIcon>
                      <ListItemText primary="Change Image" />
                    </ListItemButton>
                  </ListItem>
                )}
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setUnsplashModalOpened(true)}>
                    <ListItemIcon>
                      <ImageUp />
                    </ListItemIcon>
                    <ListItemText primary="Choose from Upsplash" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleCoverReposition}>
                    <ListItemIcon>
                      <ArrowDownUp />                  
                    </ListItemIcon>
                    <ListItemText primary="Reposition" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={onRemove}>
                    <ListItemIcon>
                      <Trash2 />
                    </ListItemIcon>
                    <ListItemText primary="Remove" />
                  </ListItemButton>
                </ListItem>
              </List>
            </nav>
          </Box>
          ) : (
          <UnsplashCoverModal handleClose={handleClose} />
          )}
        </Popover>
      </div>
    </div>
  );
};

