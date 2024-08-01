import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormGenerator from '../form-generator';
import ButtonHandler from './button-handlers';
import { APP_FORM } from '@/constants/app';
import { Grid, Typography, Paper, useTheme, useMediaQuery, LinearProgress, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const MotionGrid = motion(Grid);
const MotionPaper = motion(Paper);

function AppForm() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    register,
    formState: { errors, isValid, touchedFields },
    control,
    setValue,
    watch,
  } = useFormContext();

  const midpoint = Math.ceil(APP_FORM.length / 2);
  const firstHalf = APP_FORM.slice(0, midpoint);
  const secondHalf = APP_FORM.slice(midpoint);

  const progress = (Object.keys(touchedFields).length / APP_FORM.length) * 100;

  return (
    <MotionGrid
      container
      spacing={3}
      justifyContent="center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Grid item xs={12}>
        <Typography variant="h3" align="center" gutterBottom>
          <motion.span
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            REGISTER APP
          </motion.span>
        </Typography>
      </Grid>
      <MotionGrid
        item
        xs={12}
        md={10}
        lg={8}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <MotionPaper
          elevation={3}
          sx={{ p: 4, borderRadius: 2 }}
          whileHover={{ boxShadow: 6 }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <AnimatePresence>
                {firstHalf.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FormGenerator
                      {...field}
                      register={register}
                      errors={errors}
                      control={control}
                      setValue={setValue}
                      watch={watch}
                    />
                    {field.helperText && (
                      <Tooltip title={field.helperText} placement="right">
                        <HelpOutlineIcon sx={{ ml: 1, fontSize: 'small', color: theme.palette.text.secondary }} />
                      </Tooltip>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </Grid>
            <Grid item xs={12} md={6}>
              <AnimatePresence>
                {secondHalf.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FormGenerator
                      {...field}
                      register={register}
                      errors={errors}
                      control={control}
                      setValue={setValue}
                      watch={watch}
                    />
                    {field.helperText && (
                      <Tooltip title={field.helperText} placement="right">
                        <HelpOutlineIcon sx={{ ml: 1, fontSize: 'small', color: theme.palette.text.secondary }} />
                      </Tooltip>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </Grid>
          </Grid>
        </MotionPaper>
      </MotionGrid>
      <Grid item xs={12}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <ButtonHandler isValid={isValid} />
        </motion.div>
      </Grid>
    </MotionGrid>
  );
}

export default AppForm;