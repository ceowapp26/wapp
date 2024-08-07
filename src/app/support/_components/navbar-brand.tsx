import React from "react";
import { NavbarBrand, Link, Avatar, Image } from "@nextui-org/react";
import { Logo } from '@/components/logo';

export default function CompanyBrand() {
  return (
    <NavbarBrand>
      <Link href="/">
        <Image
          width={40}
          height={40}
          src="./global/company_logos/wapp-logo.png"
        />
      </Link>
    </NavbarBrand>
  );
}
