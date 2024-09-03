"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTransformData = useTransformData;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _InteractionProvider = require("../../context/InteractionProvider");
var _useInteractionItemProps = require("../../hooks/useInteractionItemProps");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function useTransformData(series) {
  const {
    id: seriesId,
    highlightScope,
    data,
    faded,
    highlighted,
    paddingAngle: basePaddingAngle = 0,
    innerRadius: baseInnerRadius = 0,
    arcLabelRadius: baseArcLabelRadius,
    outerRadius: baseOuterRadius,
    cornerRadius: baseCornerRadius = 0
  } = series;
  const {
    item: highlightedItem
  } = React.useContext(_InteractionProvider.InteractionContext);
  const getHighlightStatus = React.useCallback(dataIndex => {
    const isHighlighted = (0, _useInteractionItemProps.getIsHighlighted)(highlightedItem, {
      type: 'pie',
      seriesId,
      dataIndex
    }, highlightScope);
    const isFaded = !isHighlighted && (0, _useInteractionItemProps.getIsFaded)(highlightedItem, {
      type: 'pie',
      seriesId,
      dataIndex
    }, highlightScope);
    return {
      isHighlighted,
      isFaded
    };
  }, [highlightScope, highlightedItem, seriesId]);
  const dataWithHighlight = React.useMemo(() => data.map((item, itemIndex) => {
    const {
      isHighlighted,
      isFaded
    } = getHighlightStatus(itemIndex);
    const attributesOverride = (0, _extends2.default)({
      additionalRadius: 0
    }, isFaded && faded || isHighlighted && highlighted || {});
    const paddingAngle = Math.max(0, Math.PI * (attributesOverride.paddingAngle ?? basePaddingAngle) / 180);
    const innerRadius = Math.max(0, attributesOverride.innerRadius ?? baseInnerRadius);
    const outerRadius = Math.max(0, attributesOverride.outerRadius ?? baseOuterRadius + attributesOverride.additionalRadius);
    const cornerRadius = attributesOverride.cornerRadius ?? baseCornerRadius;
    const arcLabelRadius = attributesOverride.arcLabelRadius ?? baseArcLabelRadius ?? (innerRadius + outerRadius) / 2;
    return (0, _extends2.default)({}, item, attributesOverride, {
      isFaded,
      isHighlighted,
      paddingAngle,
      innerRadius,
      outerRadius,
      cornerRadius,
      arcLabelRadius
    });
  }), [baseCornerRadius, baseInnerRadius, baseOuterRadius, basePaddingAngle, baseArcLabelRadius, data, faded, getHighlightStatus, highlighted]);
  return dataWithHighlight;
}