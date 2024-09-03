import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormGenerator from '../form-generator';
import ButtonHandler from './button-handlers';
import { FEATURE_FORM } from '@/constants/app';
import { Grid, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import { FieldValues, FieldErrors, Control, UseFormRegister } from 'react-hook-form';
import { useAppContextHook } from '@/context/app-context-provider';
import { motion } from 'framer-motion';

type Props = {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldErrors>;
  control: Control<FieldValues, any>;
};

const MotionGrid = motion(Grid);
const MotionPaper = motion(Paper);

function FeatureForm({ register, control, errors }: Props) {
  const { appName } = useAppContextHook();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const midpoint = Math.ceil(FEATURE_FORM.length / 2);
  const firstHalf = FEATURE_FORM.slice(0, midpoint);
  const secondHalf = FEATURE_FORM.slice(midpoint);

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
        <Typography variant="h4" align="center" gutterBottom>
          <motion.span
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            Your current app is{' '}
            <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              {appName}
            </span>
          </motion.span>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h3" align="center" gutterBottom>
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            REGISTER FEATURE
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
              {firstHalf.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FormGenerator
                    {...field}
                    register={register}
                    errors={errors}
                    control={control}
                  />
                </motion.div>
              ))}
            </Grid>
            <Grid item xs={12} md={6}>
              {secondHalf.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FormGenerator
                    {...field}
                    register={register}
                    errors={errors}
                    control={control}
                  />
                </motion.div>
              ))}
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
          <ButtonHandler />
        </motion.div>
      </Grid>
    </MotionGrid>
  );
}

export default FeatureForm;

