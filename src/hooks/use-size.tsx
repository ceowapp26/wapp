import { useCallback, useEffect, useState } from "react";

const useSize = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const setSizes = useCallback(() => {
    setWidth(500);
    setHeight(500);
  }, [setWidth, setHeight]);

  useEffect(() => {
    window.addEventListener("resize", setSizes);
    setSizes();
  }, [setSizes]);

  return [width, height];
};

export default useSize;
