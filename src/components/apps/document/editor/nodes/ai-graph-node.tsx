import React, { useEffect, useState } from 'react';
import styled from "@emotion/styled";
import { NodeViewWrapper } from "@tiptap/react";
import { useGeneralContext } from "@/context/general-context-provider";
import { AIGraphNodeView } from "../views";

const StyleWrapper = styled(NodeViewWrapper)`
  width: 100%;
  margin: 1em 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const GraphContainer = styled.div`
  height: 400px;
  background-color: #f5f5f5;
  position: relative;
`;

const GraphTitle = styled.h3`
  font-size: 1.2em;
  font-weight: 600;
  padding: 0.5em 1em;
  background-color: #f0f0f0;
  margin: 0;
  border-bottom: 1px solid #e0e0e0;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  color: #333;
`;

const AIGraphNode = (props) => {  
  const { resData } = useGeneralContext();
  const [_data, _setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <StyleWrapper>
      <GraphTitle>AI-Generated Graph</GraphTitle>
      <GraphContainer>
        {isLoading ? (
          <LoadingOverlay>Loading Graph...</LoadingOverlay>
        ) : (
          <AIGraphNodeView data={_data} />
        )}
      </GraphContainer>
    </StyleWrapper>
  );
};

AIGraphNode.displayName = "AIGraphNode";

export { AIGraphNode };