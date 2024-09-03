import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormGenerator from '../form-generator';
import ButtonHandler from './button-handlers';
import { CREDIT_MODEL_FORM } from '@/constants/ai';
import { Grid, Typography, Paper, Box } from '@mui/material';
import { FieldValues, FieldErrors, Control, UseFormRegister } from 'react-hook-form'
import { useModelContextHook } from '@/context/model-context-provider';

function CreditModelForm({ register, control, errors }: Props) {
  const { planType } = useModelContextHook();
  const midpoint = Math.ceil(CREDIT_MODEL_FORM.length / 2);
  const firstHalf = CREDIT_MODEL_FORM.slice(0, midpoint);
  const secondHalf = CREDIT_MODEL_FORM.slice(midpoint);

  return (
    <Box sx={{
      padding: 3,
      background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      borderRadius: (theme) => theme.shape.borderRadius,
    }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h4" align="center" sx={{
            marginBottom: 3,
            color: 'common.white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}>
            REGISTER MODEL
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{
            padding: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            {firstHalf.map((field) => (
              <FormGenerator
                key={field.id}
                {...field}
                register={register}
                errors={errors}
                control={control}
              />
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{
            padding: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            {secondHalf.map((field) => (
              <FormGenerator
                key={field.id}
                {...field}
                register={register}
                errors={errors}
                control={control}
              />
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Box mt={3}>
            <ButtonHandler />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CreditModelForm;