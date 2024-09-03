import React from "react";
import { VisibilityContext } from "react-horizontal-scrolling-menu";
import { Card, CardBody, Image } from "@nextui-org/react";
import { TbHandClick } from "react-icons/tb";

interface CardProps {
  disabled?: boolean;
  onClick: (context: VisibilityContext) => void;
  selected: boolean;
  title: string;
  description: string;
  itemId: string;
  imageUrl: string;
}

export const ScrollingCard: React.FC<CardProps> = ({
  onClick,
  selected,
  title,
  description,
  itemId,
  imageUrl
}) => {
  const visibility = React.useContext(VisibilityContext);

  return (
    <Card 
      isPressable
      onPress={() => onClick(visibility)}
      className={`w-[150px] h-[230px] m-4 overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 ${selected ? 'ring-2 ring-violet-500' : ''}`}
    >
      <CardBody className="p-0">
        <Image
          removeWrapper
          alt={title}
          className="z-0 w-full h-full object-cover"
          src={imageUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h4 className="text-white text-lg font-bold mb-1 truncate">{title}</h4>
            <p className="text-gray-300 text-sm line-clamp-2">{description}</p>
            <div
              className="mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-full text-white text-sm font-medium transition-colors duration-300"
            >
              <TbHandClick className="w-5 h-5" />
              <span>Enter</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};