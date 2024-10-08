import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const RatingValue = /*#__PURE__*/React.memo(function RatingValue(props) {
  const {
    value
  } = props;
  return /*#__PURE__*/_jsxs(Box, {
    sx: {
      display: 'flex',
      alignItems: 'center',
      lineHeight: '24px',
      color: 'text.secondary'
    },
    children: [/*#__PURE__*/_jsx(Rating, {
      value: value,
      sx: {
        mr: 1
      },
      readOnly: true
    }), " ", Math.round(Number(value) * 10) / 10]
  });
});
export function renderRating(params) {
  if (params.value == null) {
    return '';
  }

  // If the aggregated value does not have the same unit as the other cell
  // Then we fall back to the default rendering based on `valueGetter` instead of rendering the total price UI.
  if (params.aggregation && !params.aggregation.hasCellUnit) {
    return null;
  }
  return /*#__PURE__*/_jsx(RatingValue, {
    value: params.value
  });
}