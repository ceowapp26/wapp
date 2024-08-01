import React from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { LeftArrow, RightArrow } from "./arrows";
import { usePreventBodyScroll } from '@/hooks/use-prevent-body-scroll';
import { useMyspaceContext } from "@/context/myspace-context-provider";
import { ScrollingCard } from "./scrolling-card";
import { ScrollingItems } from "@/constants/app";

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

export const ScrollingBar = () => {
  const { selectedSideMenu, setSelectedSideMenu } = useMyspaceContext();
  const [selected, setSelected] = React.useState<string[]>([]);
  const { disableScroll, enableScroll } = usePreventBodyScroll();
  const isItemSelected = (id: string): boolean => !!selected.find((el) => el === id);
  const handleItemClick = (itemId: string) => () => {
    const itemSelected = isItemSelected(itemId);
    setSelectedSideMenu(itemId);
    setSelected(itemSelected ? selected.filter((el) => el !== itemId) : [...selected, itemId]);
  };

  return (
    <div className="ScrollingBar" style={{ paddingTop: "20px" }}>
      <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
        <ScrollMenu
          LeftArrow={LeftArrow}
          RightArrow={RightArrow}
          onWheel={onWheel}
        >
          {ScrollingItems.map(({ id, title, description, imageUrl }) => (
            <ScrollingCard
              title={title}
              description={description}
              itemId={id}
              key={id}
              imageUrl={imageUrl}
              onClick={handleItemClick(id)}
              selected={isItemSelected(id)}
            />
          ))}
        </ScrollMenu>
      </div>
    </div>
  );
};

function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
  const isTouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;
  if (isTouchpad) {
    ev.stopPropagation();
    return;
  }
  if (ev.deltaY < 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev();
  }
}

export default ScrollingBar;
