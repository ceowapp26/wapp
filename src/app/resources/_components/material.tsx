import { useTexture } from "@react-three/drei";
import { MeshMatcapMaterialProps } from "@react-three/fiber";
import { forwardRef } from "react";
import { MeshMatcapMaterial } from "three";
import { useAnimation } from "@/hooks/use-animation";

export const CustomMaterial = forwardRef<
  MeshMatcapMaterial,
  MeshMatcapMaterialProps
>((props, ref) => {
  const matcap = useAnimation((x) => x.texture);
  const texture = useTexture(matcap);
  return (
    <meshMatcapMaterial
      {...props}
      ref={ref}
      matcap={texture}
    ></meshMatcapMaterial>
  );
});


