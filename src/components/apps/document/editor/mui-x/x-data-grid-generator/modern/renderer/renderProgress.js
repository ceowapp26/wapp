import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Center = styled('div')({
  height: '100%',
  display: 'flex',
  alignItems: 'center'
});
const Element = styled('div')(({
  theme
}) => ({
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: 26,
  borderRadius: 2
}));
const Value = styled('div')({
  position: 'absolute',
  lineHeight: '24px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center'
});
const Bar = styled('div')({
  height: '100%',
  '&.low': {
    backgroundColor: '#f44336'
  },
  '&.medium': {
    backgroundColor: '#efbb5aa3'
  },
  '&.high': {
    backgroundColor: '#088208a3'
  }
});
const ProgressBar = /*#__PURE__*/React.memo(function ProgressBar(props) {
  const {
    value
  } = props;
  const valueInPercent = value * 100;
  return /*#__PURE__*/_jsxs(Element, {
    children: [/*#__PURE__*/_jsx(Value, {
      children: `${valueInPercent.toLocaleString()} %`
    }), /*#__PURE__*/_jsx(Bar, {
      className: clsx(valueInPercent < 30 && "low", valueInPercent >= 30 && valueInPercent <= 70 && "medium", valueInPercent > 70 && "high"),
      style: {
        maxWidth: `${valueInPercent}%`
      }
    })]
  });
});
export function renderProgress(params) {
  if (params.value == null) {
    return '';
  }

  // If the aggregated value does not have the same unit as the other cell
  // Then we fall back to the default rendering based on `valueGetter` instead of rendering a progress bar.
  if (params.aggregation && !params.aggregation.hasCellUnit) {
    return null;
  }
  return /*#__PURE__*/_jsx(Center, {
    children: /*#__PURE__*/_jsx(ProgressBar, {
      value: params.value
    })
  });
}