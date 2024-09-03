import React from "react";
import { NavbarBrand } from "@nextui-org/react";
import { Logo } from '@/components/logo';

export default function HeaderBrand() {
  return (
    <NavbarBrand>
      <Logo width={40} height={40} />
    </NavbarBrand>
  );
}
