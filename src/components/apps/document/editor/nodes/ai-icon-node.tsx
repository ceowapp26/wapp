"use client"
import React, { useEffect, useState, useRef } from 'react';
import { NodeViewWrapper } from "@tiptap/react";
import { useGeneralContext } from "@/context/general-context-provider";
import { AIIconNodeView } from "../views";
import styles from './AIIconNode.module.css';

const backgroundColorOptions = [
  { value: 'transparent', label: 'Transparent' },
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
  { value: 'gray', label: 'Gray' },
];

const colorOptions = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
];

const sizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const effectOptions = [
  { value: 'none', label: 'None' },
  { value: 'pulse', label: 'Pulse' },
  { value: 'spin', label: 'Spin' },
  { value: 'bounce', label: 'Bounce' },
];

const AIIconNode = (props) => {  
  const { resData } = useGeneralContext();
  const [_data, _setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [size, setSize] = useState({ width: 150, height: 150 });
  const [showBackground, setShowBackground] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [iconSize, setIconSize] = useState('medium');
  const [iconColor, setIconColor] = useState('black');
  const [iconEffect, setIconEffect] = useState('none');
  const containerRef = useRef(null);

  useEffect(() => {
    const nodeData = props.node.attrs.data.default;
    const dataToUse = nodeData || resData;
    _setData(dataToUse);
    if (dataToUse && (!nodeData || nodeData !== dataToUse)) {
      props.updateAttributes({
        data: {
          ...props.node.attrs.data,
          default: dataToUse
        }
      });
    }
    setTimeout(() => setIsLoading(false), 1500);
  }, [props.node.attrs.data.default, resData]);

const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (e) => {
      const newWidth = Math.max(100, Math.min(300, startWidth + e.clientX - startX));
      const newHeight = Math.max(100, Math.min(300, startHeight + e.clientY - startY));
      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const iconSizeRatio = iconSize === 'small' ? 0.5 : iconSize === 'large' ? 0.9 : 0.7;
  const containerStyle = {
    width: `${size.width}px`,
    height: `${size.height}px`,
    backgroundColor: showBackground ? backgroundColor : 'transparent',
  };

  return (
    <NodeViewWrapper className={styles.styleWrapper}>
      <div ref={containerRef} className={styles.iconContainer} style={containerStyle}>
        {isLoading ? (
          <div className={styles.loadingOverlay}>Loading Icon...</div>
        ) : (
          <>
            <div className={styles.iconWrapper}>
              <AIIconNodeView
                data={_data}
                color={iconColor}
                size={Math.min(size.width, size.height) - 20}
                sizeRatio={iconSizeRatio}
                effect={iconEffect}
              />
            </div>
            <div className={styles.controlPanel}>
              <select value={showBackground ? 'yes' : 'no'} onChange={(e) => setShowBackground(e.target.value === 'yes')}>
                <option value="yes">Show BG</option>
                <option value="no">Hide BG</option>
              </select>
              <select value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)}>
                {backgroundColorOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select value={iconSize} onChange={(e) => setIconSize(e.target.value)}>
                {sizeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select value={iconColor} onChange={(e) => setIconColor(e.target.value)}>
                {colorOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select value={iconEffect} onChange={(e) => setIconEffect(e.target.value)}>
                {effectOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </>
        )}
        <div className={styles.resizeHandle} onMouseDown={handleMouseDown} />
      </div>
    </NodeViewWrapper>
  );
};

AIIconNode.displayName = "AIIconNode";
export { AIIconNode };