import React, { useState, useRef, useEffect } from 'react';
import { Tree } from 'react-d3-tree';
import { checkJsonFormat } from "@/utils/checkJsonFormat";
import { AIFallbackView } from "./ai-fallback-view";
import { FormattedData } from "@/types/aiResponse";
import { toast } from "sonner";

const AITreeNodeView: React.FC<> = ({ data }: any) => {
  const [clickedNode, setClickedNode] = useState<any>(null);
  const [nodeTitle, setNodeTitle] = useState<string | null>(null);
  const [showAttributes, setShowAttributes] = useState<{ [key: string]: boolean }>({});
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const treeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (treeContainerRef.current) {
      const { width, height } = treeContainerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

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

  const treeData = {
    name: formattedData.mainKeyword,
    attributes: {
      summary: showAttributes[formattedData.mainKeyword] ? formattedData.summary : undefined,
      textSpan: showAttributes[formattedData.mainKeyword] ? formattedData.textSpan : undefined,
    },
    children: formattedData.associatedKeywords.map((keyword) => ({
      name: keyword.keyword,
      attributes: {
        summary: showAttributes[keyword.keyword] ? keyword.summary : undefined,
        textSpan: showAttributes[keyword.keyword] ? keyword.textSpan : undefined,
      },
      children: keyword?.subKeywords?.map((subKeyword) => ({
        name: subKeyword.keyword,
        attributes: {
          summary: showAttributes[subKeyword.keyword] ? subKeyword.summary : undefined,
          textSpan: showAttributes[subKeyword.keyword] ? subKeyword.textSpan : undefined,
        },
      })),
    })),
  };

  const foreignObjectProps = { width: 180, height: 60, x: -90, y: -30 };

  const onNodeClick = (nodeData: any) => {
    setClickedNode(nodeData.attributes);
    setNodeTitle(nodeData.name);
    setShowAttributes((prevAttributes) => ({
      ...prevAttributes,
      [nodeData.name]: !prevAttributes[nodeData.name],
    }));
  };

  const onLinkClick = (source: any, target: any) => {
    console.log('Clicked Link:', source, target);
  };

  return (
    <div className="w-full h-full min-h-[300px]" ref={treeContainerRef}>
      <Tree
        data={treeData}
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
        nodeSvgShape={{
          shape: 'rect',
          shapeProps: foreignObjectProps,
        }}
        dimensions={dimensions}
        initialDepth={3}
        onNodeClick={onNodeClick}
        onLinkClick={onLinkClick}
        pathClassFunc={() => 'custom-link'}
        translate={{ x: 100, y: 300 }}
        collapsible={true}
        draggable={true}
        shouldCollapseNeighborNodes={true}
        depthFactor={200}
        separation={{ siblings: 2, nonSiblings: 2 }}
        transitionDuration={300}
        centeringTransitionDuration={500}
      />
    </div>
  );
};

AITreeNodeView.displayName = "AITreeNodeView";

export { AITreeNodeView };