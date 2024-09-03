import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, IconButton, Avatar, Typography, Box, ImageList, ImageListItem, ImageListItemBar, List, ListItem, ListItemAvatar, ListItemText, Divider, Stack, Link, Popover, Fade, Zoom } from '@mui/material';
import XIcon from '@mui/icons-material/X';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import InstagramIcon from '@mui/icons-material/Instagram';
import CollectionsIcon from '@mui/icons-material/Collections';
import PhotoIcon from '@mui/icons-material/Photo';
import { styled } from '@mui/material/styles';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { unsplash } from "@/hooks/use-unsplash-cover-image";
import ScrollToBottom from 'react-scroll-to-bottom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from "react-intersection-observer";
import { ScrollToBottomButton } from '@/components/scroll-to-bottom-button';
import { GradientLoadingCircle } from "@/components/gradient-loading-circle";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface UnSplashImageSkeletonProp {
  handleClose?: () => void;
  handleUpdate: () => void;
}

export const UnsplashImageSkeleton = ({ handleClose, handleUpdate }: UnSplashImageSkeletonProp) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [initialData, setInitialData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [perPageNumber, setPerPageNumber] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [loadCount, setLoadCount] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const open = Boolean(anchorEl);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { ref, inView, entry } = useInView({
    threshold: 0.95,
  });

  const handleClickImage = async (item: any) => {
    await handleUpdate(item.urls.regular);
    await unsplash.photos.trackDownload({ downloadLocation: item.links.download_location });
  }

  const fetchInitialPhotos = async () => {
    try {
      const result = await unsplash.photos.getRandom({ count: 30 });
      if (result.type === 'success') {
        setInitialData(result.response);
      } else {
        console.error('Error fetching photos:', result.errors[0]);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const fetchSearchPhotos = async (pageNumber) => {
    try {
      setLoading(true);
      const result = await unsplash.search.getPhotos({ query: searchValue, page: pageNumber, perPage: perPageNumber });
      if (result.type === 'success') {
        setSearchData(prev => [...prev, ...result.response.results]);
      } else {
        console.error('Error fetching photos:', result.errors[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialPhotos();
  }, []);

  useEffect(() => {
    if (searchValue) {
      fetchSearchPhotos(pageNumber);
    }
  }, [searchValue, pageNumber]);

   const loadMore = () => {
    setPageNumber(prev => prev + 1);
    setLoadCount(prev => prev + 1);
  };

  useEffect(() => {
    if (!loading && loadCount < 5 && inView) {
      loadMore();
    } 
  }, [inView, loading, loadCount]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const renderImageListItems = () => {
    const data = searchValue ? searchData : initialData;
    if (!data.length) {
      return (
        <Typography sx={{ position: 'relative', top: '20px', width: 300 }} variant="body1" gutterBottom>
          No results found.
        </Typography>
      );
    }

    return (
      <ScrollToBottom className="h-full dark:bg-gray-800" followButtonClassName="hidden">
        <ScrollToBottomButton variant="image" />
        <ImageList sx={{ position: 'relative', top: 30, width: 350, height: 300 }} cols={3} rowHeight={150}>
          <AnimatePresence>
            {data.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
              <ImageListItem key={item.id}>
                <Image
                  onClick={() => handleClickImage(item)}
                  srcSet={`${item.urls.small}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.urls.small}?w=248&fit=crop&auto=format`}
                  alt={item.alt_description}
                  width={248}
                  height={150}
                  style={{ cursor: 'pointer' }}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.alt_description}
                  subtitle={
                    <Link
                      href={`https://unsplash.com/@${item.user.username}?utm_source=wapp&utm_medium=referral`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'rgba(255, 255, 255, 0.54)' }}
                    >
                      {item.user.username}
                    </Link>
                  }
                  actionIcon={
                    <IconButton
                      onClick={(event) => {
                        setCurrentItem(item);
                        setAnchorEl(event.currentTarget);
                      }}
                      sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                      aria-label={`info about ${item.alt_description}`}
                    >
                      <InfoIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            </motion.div>
          ))}
          </AnimatePresence>
        </ImageList>
        <div ref={ref}> 
          <Box sx={{ position: 'relative', display: 'flex', top: '40px', justifyContent: 'center', width: '100%' }}>
            {loading ? (
              <GradientLoadingCircle size={60} thickness={4} />
            ) : (
              <Link sx={{ cursor: 'pointer', p: '10px' }} onClick={loadMore}>
                Load more
              </Link>
            )}
          </Box>
        </div>
        {renderCard(currentItem)}
      </ScrollToBottom>
    );
  };

  const renderCard = (item) => {
    if (!item) return null;
    return (
      <Popover
        id={open ? 'simple-popover' : undefined}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '12px' } }}
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <Card sx={{ display: 'inline-block', width: 250, mx: '2px' }}>
          <CardHeader
            avatar={
              <Link
                href={`https://unsplash.com/@${item.user.username}?utm_source=wapp&utm_medium=referral`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Avatar src={item.user.profile_image.small} aria-label="recipe">
                  {item.user.username.split(' ')[0]}
                </Avatar>
              </Link>
            }
            title={item.alt_description}
            subheader={new Date(item.created_at).toDateString()}
          />
          <CardMedia
            component="img"
            height="200"
            image={item.urls.regular}
            alt={item.alt_description}
            onClick={() => handleClickImage(item)}
            sx={{ cursor: 'pointer', transition: 'transform 0.3s' }}
            className="hover:transform hover:scale-105"
          />
          <CardContent>
             <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar><PersonIcon /></Avatar>
                </ListItemAvatar>
                <ListItemText primary='User Name' secondary={item.user.username || "N/A"} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar><PersonIcon /></Avatar>
                </ListItemAvatar>
                <ListItemText primary='First Name' secondary={item.user.first_name || "N/A"} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar><PersonIcon /></Avatar>
                </ListItemAvatar>
                <ListItemText primary='Last Name' secondary={item.user.last_name || "N/A"} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar><CollectionsIcon /></Avatar>
                </ListItemAvatar>
                <ListItemText primary='Total Collections' secondary={item.user.total_collections || 0} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar><PhotoIcon /></Avatar>
                </ListItemAvatar>
                <ListItemText primary='Total Photos' secondary={item.user.total_photos || 0} />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar><InstagramIcon /></Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary='Instagram'
                  secondary={
                    item.user.instagram_username ? (
                      <Link
                        href={`https://www.instagram.com/${item.user.instagram_username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'inherit' }}
                      >
                        {item.user.instagram_username}
                      </Link>
                    ) : "N/A"
                  }
                />
              </ListItem>
            </List>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites" className="hover:text-red-500 transition-colors">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share" className="hover:text-blue-500 transition-colors">
              <ShareIcon />
            </IconButton>
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Location:</Typography>
              <Typography paragraph>{item.user.location || "N/A"}</Typography>
            </CardContent>
          </Collapse>
        </Card>
      </Popover>
    );
  };

  return (
    <Card alignItems="center" display="flex" justifyContent="center" sx={{ width: { xs: '100%', sm: 400 }, height: 'auto', minHeight: 450, borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
      <Box sx={{ p: '16px' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
            Choose from Unsplash
          </Typography>
          <IconButton onClick={handleClose} className="hover:bg-gray-200 transition-colors">
            <X size={20} className="opacity-80 select-none cursor-pointer inline-block flex-shrink text-muted-foreground" />
          </IconButton>
        </Stack>
      </Box>
      <Divider />
      <Box>
        <Stack direction="column" alignItems="center">
          <form className="relative top-4">
            <label className="relative block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <SearchIcon className="h-5 w-5 fill-slate-300" />
              </span>
              <input
                onChange={(e) => {
                  setPageNumber(1)
                  setSearchValue(e.target.value)
                  setLoadCount(0)
                }}
                className="placeholder:italic placeholder:text-slate-400 h-8 w-[350px] py-2 pl-9 pr-3 bg-slate-200 focus:bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                placeholder="Search for a picture..."
                type="text"
                name="search"
              />
            </label>
          </form>
          <Zoom in={true} style={{ transitionDelay: '300ms' }}>
            <Box sx={{ position: 'relative', top: 30, width: 350, height: 300 }} cols={3} rowHeight={150}>
              {renderImageListItems()}
            </Box>
          </Zoom>
        </Stack>
      </Box>
      {currentItem && renderCard(currentItem)}
    </Card>
  );
};


