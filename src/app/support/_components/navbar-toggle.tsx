import React from "react";
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@nextui-org/react";
import { motion } from "framer-motion";

export const NavbarItemsNoDropdown = [
  { 
    label: 'Docs', 
    href: '#',
  },
  { 
    label: 'Updates', 
    href: '#',
  },
];

const MotionLink = motion(Link);

export default function HeaderToggle() {
  return (
    <div className="block sm:hidden">
      <NavbarMenuToggle className="z-[99999] min-h-8" />
      <NavbarMenu>
        {NavbarItemsNoDropdown.map((item, index) => (
          <NavbarMenuItem key={index}>
            <MotionLink
              color="foreground"
              className="w-full transition-colors duration-300"
              href={item.href}
              size="lg"
              whileHover={{ x: 5 }}
            >
              {item.label}
            </MotionLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </div>
  );
}
