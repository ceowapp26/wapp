"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useInteractionItemProps = exports.getIsHighlighted = exports.getIsFaded = void 0;
var React = _interopRequireWildcard(require("react"));
var _InteractionProvider = require("../context/InteractionProvider");
var _HighlightProvider = require("../context/HighlightProvider");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const useInteractionItemProps = (scope, skip) => {
  const {
    dispatch: dispatchInteraction
  } = React.useContext(_InteractionProvider.InteractionContext);
  const {
    dispatch: dispatchHighlight
  } = React.useContext(_HighlightProvider.HighlighContext);
  if (skip) {
    return () => ({});
  }
  const getInteractionItemProps = data => {
    const onMouseEnter = () => {
      dispatchInteraction({
        type: 'enterItem',
        data
      });
      dispatchHighlight({
        type: 'enterItem',
        item: data,
        scope
      });
    };
    const onMouseLeave = () => {
      dispatchInteraction({
        type: 'leaveItem',
        data
      });
      dispatchHighlight({
        type: 'leaveItem',
        item: data
      });
    };
    return {
      onMouseEnter,
      onMouseLeave
    };
  };
  return getInteractionItemProps;
};
exports.useInteractionItemProps = useInteractionItemProps;
const getIsHighlighted = (selectedItem, currentItem, highlightScope) => {
  if (!highlightScope?.highlighted || highlightScope.highlighted === 'none' || selectedItem === null) {
    return false;
  }
  const isSeriesSelected = selectedItem.type === currentItem.type && selectedItem.seriesId === currentItem.seriesId;
  if (!isSeriesSelected) {
    return false;
  }
  if (highlightScope.highlighted === 'series') {
    return isSeriesSelected;
  }
  return selectedItem.dataIndex !== undefined && selectedItem.dataIndex === currentItem.dataIndex;
};
exports.getIsHighlighted = getIsHighlighted;
const getIsFaded = (selectedItem, currentItem, highlightScope) => {
  if (!highlightScope?.faded || highlightScope.faded === 'none' || selectedItem === null) {
    return false;
  }
  const isSeriesSelected = selectedItem.type === currentItem.type && selectedItem.seriesId === currentItem.seriesId;
  if (highlightScope.faded === 'series') {
    return isSeriesSelected && selectedItem.dataIndex !== currentItem.dataIndex;
  }
  if (highlightScope.faded === 'global') {
    if (!isSeriesSelected) {
      return true;
    }
    return selectedItem.dataIndex !== undefined && selectedItem.dataIndex !== currentItem.dataIndex;
  }
  return false;
};
exports.getIsFaded = getIsFaded;