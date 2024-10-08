import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
const defaultScope = {
  highlighted: 'none',
  faded: 'none'
};
export const HighlighContext = /*#__PURE__*/React.createContext({
  item: null,
  scope: defaultScope,
  dispatch: () => null
});
if (process.env.NODE_ENV !== 'production') {
  HighlighContext.displayName = 'HighlighContext';
}
const dataReducer = (prevState, action) => {
  switch (action.type) {
    case 'enterItem':
      return _extends({}, prevState, {
        item: action.item,
        scope: _extends({}, defaultScope, action.scope)
      });
    case 'leaveItem':
      if (prevState.item === null || Object.keys(action.item).some(key => action.item[key] !== prevState.item[key])) {
        // The item is already something else
        return prevState;
      }
      return _extends({}, prevState, {
        item: null
      });
    default:
      return prevState;
  }
};
function HighlightProvider(props) {
  const {
    children
  } = props;
  const [data, dispatch] = React.useReducer(dataReducer, {
    item: null,
    scope: defaultScope
  });
  const value = React.useMemo(() => _extends({}, data, {
    dispatch
  }), [data]);
  return /*#__PURE__*/_jsx(HighlighContext.Provider, {
    value: value,
    children: children
  });
}
export { HighlightProvider };