import React, { useEffect, useRef, useState } from 'react';
import styled from "@emotion/styled";
import { ForceGraph3D } from 'react-force-graph';
import { useCheckCompletionStatus } from "@/hooks/use-check-completion-status";
import { AIFallbackView } from "./ai-fallback-view";
import { toast } from "sonner";
import { checkJsonFormat } from "@/utils/checkJsonFormat";
import { FormattedData } from "@/types/aiResponse";

export const AIGraphNodeView = ({ data }: any) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const { status, parseResponse } = useCheckCompletionStatus();

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onNodeClick = (node) => {
    console.log('Clicked Node:', node);
  };

  const transformDataForGraph = (data) => {
    const nodes = [];
    const links = [];

    const mainNodeId = data.mainKeyword.replace(/\s+/g, '-').toLowerCase();
    nodes.push({
      id: mainNodeId,
      name: data.mainKeyword,
    });

    data.associatedKeywords.forEach((keyword) => {
      const nodeId = keyword.keyword.replace(/\s+/g, '-').toLowerCase();
      nodes.push({
        id: nodeId,
        name: keyword.keyword,
      });

      links.push({
        source: mainNodeId,
        target: nodeId,
      });

      if (keyword.subKeywords) {
        processKeywords(keyword.subKeywords, nodeId);
      }
    });

    function processKeywords(keywords, parentId) {
      keywords.forEach((keyword) => {
        const nodeId = keyword.keyword.replace(/\s+/g, '-').toLowerCase();
        nodes.push({
          id: nodeId,
          name: keyword.keyword,
        });

        links.push({
          source: parentId,
          target: nodeId,
        });

        if (keyword.subKeywords) {
          processKeywords(keyword.subKeywords, nodeId);
        }
      });
    }

    return { nodes, links };
  };

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

  const transformedData = transformDataForGraph(formattedData);

  return (
    <div ref={containerRef} className="w-full h-screen">
      {dimensions.width > 0 && dimensions.height > 0 && (
        <ForceGraph3D
          graphData={transformedData}
          nodeAutoColorBy="id"
          linkWidth={2}
          onNodeClick={onNodeClick}
          width={dimensions.width}
          height={dimensions.height}
        />
      )}
    </div>
  );
};

