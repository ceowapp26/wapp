import React, { useState } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import { RiNodeTree } from "react-icons/ri";
import { checkJsonFormat } from "@/utils/checkJsonFormat";
import { FormattedData } from "@/types/aiResponse";
import { AIFallbackView } from "./ai-fallback-view";
import styled from "@emotion/styled";
import { Tooltip } from "@nextui-org/react";

const TreeContainer = styled.div`
  max-height: 350px;
  overflow: auto;
  font-family: 'Inter', sans-serif;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin: 24px 0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  }

  &.dark {
    background-color: #1a1a1a;
  }
`;

const NodeWrapper = styled.div<{ isSelected: boolean; depth: number }>`
  margin-top: 8px;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 8px;
  background-color: ${props => props.isSelected ? '#f0f4ff' : '#ffffff'};
  border: 2px solid ${props => props.isSelected ? '#3b82f6' : '#e5e7eb'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05),
              0 0 0 2px rgba(139, 92, 246, 0.1);
  transition: all 0.3s ease;
  margin-left: ${props => props.depth * 24}px;

  &:hover {
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2),
                0 0 0 3px rgba(139, 92, 246, 0.15);
    transform: translateY(-2px);
  }

  &.dark {
    background-color: ${props => props.isSelected ? '#2a2a2a' : '#1f1f1f'};
    border-color: ${props => props.isSelected ? '#4b5563' : '#374151'};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2),
                0 0 0 2px rgba(139, 92, 246, 0.2);

    &:hover {
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3),
                  0 0 0 3px rgba(139, 92, 246, 0.25);
    }
  }
`;

const NodeHeader = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
`;

const NodeContent = styled.div`
  margin-top: 12px;
  padding-left: 28px;
  font-size: 0.95rem;
  color: #4b5563;

  &.dark {
    color: #d1d5db;
  }
`;

const KeywordText = styled.span`
  margin-left: 12px;
  font-size: 1.1rem;
  color: #111827;

  &.dark {
    color: #f3f4f6;
  }
`;

const SummaryText = styled.p`
  margin-bottom: 8px;
`;

const TextSpan = styled.p`
  font-style: italic;
  color: #6b7280;

  &.dark {
    color: #9ca3af;
  }
`;

const ExpandIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f3f4f6;
  color: #4b5563;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e5e7eb;
  }

  &.dark {
    background-color: #374151;
    color: #d1d5db;

    &:hover {
      background-color: #4b5563;
    }
  }
`;

const AIKeywordTreeNodeView: React.FC<> = ({ data }: any) => {
  const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({});
  const isDark = document.documentElement.classList.contains('dark'); // Assuming you're using a class-based dark mode

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
      <NodeWrapper className={isDark ? "dark" : ""} key={node.keyword} isSelected={isExpanded} depth={depth}>
        <NodeHeader onClick={() => handleNodeClick(node.keyword)}>
          <Tooltip content={isExpanded ? "Collapse" : "Expand"}>
            <ExpandIcon className={isDark ? "dark" : ""}>
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
            </ExpandIcon>
          </Tooltip>
          <RiNodeTree style={{ height: '20px', width:'20px', marginLeft: '12px', color: isDark ? '#d1d5db' : '#4b5563' }} />
          <KeywordText className={isDark ? "dark" : ""}>{node.keyword}</KeywordText>
        </NodeHeader>
        {isExpanded && (
          <NodeContent className={isDark ? "dark" : ""}>
            <SummaryText>{node.summary}</SummaryText>
            <TextSpan className={isDark ? "dark" : ""}>{node.textSpan}</TextSpan>
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
    <TreeContainer className={isDark ? "dark" : ""}>
      {renderNode(formattedData)}
    </TreeContainer>
  );
};

AIKeywordTreeNodeView.displayName = "AIKeywordTreeNodeView";

export { AIKeywordTreeNodeView };