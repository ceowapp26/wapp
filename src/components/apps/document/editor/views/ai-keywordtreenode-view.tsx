import React, { useState } from 'react';
import { FaChevronRight, FaChevronDown, FaKeyboard } from 'react-icons/fa';
import { checkJsonFormat } from "@/utils/checkJsonFormat";
import { FormattedData } from "@/types/aiResponse";
import { AIFallbackView } from "./ai-fallback-view";
import { toast } from "sonner";
import styled from "@emotion/styled";

const TreeContainer = styled.div`
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px 0;
`;

const NodeWrapper = styled.div<{ isSelected: boolean; depth: number }>`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 6px;
  background-color: ${props => props.isSelected ? '#e0f2fe' : '#ffffff'};
  border: 1px solid ${props => props.isSelected ? '#7dd3fc' : '#e2e8f0'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  margin-left: ${props => props.depth * 20}px;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
`;

const NodeContent = styled.div`
  margin-top: 10px;
  padding-left: 24px;
  font-size: 0.9rem;
  color: #4b5563;
`;

const KeywordText = styled.span`
  margin-left: 8px;
  font-size: 1rem;
  color: #1f2937;
`;

const SummaryText = styled.p`
  margin-bottom: 5px;
`;

const TextSpan = styled.p`
  font-style: italic;
  color: #6b7280;
`;
const AIKeywordTreeNodeView: React.FC<> = ({ data }: any) => {
  const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({});

  if (!data) {
    return <AIFallbackView data={"There is no available data!"} />;
  }

  let formattedData: FormattedData | null = null;
  try {
    const parsedData = JSON.parse(data);
    if (checkJsonFormat(parsedData)) {
      formattedData = parsedData;
    }
  } catch (error) {
    console.error("Error parsing data:", error);
  }

  if (!formattedData) {
    return <AIFallbackView data={data} />;
  }

  const handleNodeClick = (keyword: string) => {
    setExpandedNodes(prev => ({ ...prev, [keyword]: !prev[keyword] }));
  };

  const renderNode = (node: any, depth: number = 0) => {
    const isExpanded = expandedNodes[node.keyword];
    return (
      <NodeWrapper key={node.keyword} isSelected={isExpanded} depth={depth}>
        <NodeHeader onClick={() => handleNodeClick(node.keyword)}>
          {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
          <FaKeyboard style={{ marginLeft: '8px', color: '#4b5563' }} />
          <KeywordText>{node.keyword}</KeywordText>
        </NodeHeader>
        {isExpanded && (
          <NodeContent>
            <SummaryText>{node.summary}</SummaryText>
            <TextSpan>{node.textSpan}</TextSpan>
            {node.associatedKeywords && node.associatedKeywords.length > 0 && (
              <div>
                {node.associatedKeywords.map((assocKeyword: any) => renderNode(assocKeyword, depth + 1))}
              </div>
            )}
          </NodeContent>
        )}
      </NodeWrapper>
    );
  };

  return (
    <TreeContainer>
      {renderNode(formattedData)}
    </TreeContainer>
  );
};

AIKeywordTreeNodeView.displayName = "AIKeywordTreeNodeView";

export { AIKeywordTreeNodeView };