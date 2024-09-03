import React from "react";
import { useTheme } from "next-themes"; 
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@nextui-org/react";
import { useMediaQuery } from "usehooks-ts";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUp, Scale, Activity, Flash, Server, TagUser, Lock } from "@/icons/navbar-icon";
import { NavbarItemsNoDropdown, NavbarItemsDropdown } from "@/constants/navbar";
import { motion } from "framer-motion";

const icons = {
  autoscaling: <Scale className="text-warning" fill="currentColor" size={30} />,
  usageMetrics: <Activity className="text-secondary" fill="currentColor" size={30} />,
  productionReady: <Flash className="text-primary" fill="currentColor" size={30} />,
  uptime: <Server className="text-success" fill="currentColor" size={30} />,
  support: <TagUser className="text-danger" fill="currentColor" size={30} />,
  security: <Lock className="text-success" fill="currentColor" size={30} />,
};

const MotionLink = motion(Link);

export default function HeaderToggle() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { dark } = useTheme();

  return (
    <React.Fragment>
      <NavbarMenuToggle className="z-[99999] min-h-8" />
      <NavbarMenu className="fixed top-12 pt-6 z-[100]">
        {NavbarItemsNoDropdown.map((item, index) => (
          <NavbarMenuItem key={index}>
            <MotionLink
              color="foreground"
              className={`w-full ${dark ? 'text-gray-300 hover:text-purple-300' : 'text-gray-700 hover:text-purple-700'} transition-colors duration-300`}
              href={item.href}
              size="lg"
              whileHover={{ x: 5 }}
            >
              {item.label}
            </MotionLink>
          </NavbarMenuItem>
        ))}
        {Object.keys(NavbarItemsDropdown).map((key, index) => (
          <Disclosure as={motion.div} key={index} className="mt-4">
            {({ open }) => (
              <>
                <Disclosure.Button 
                  className={`flex justify-between w-full px-4 py-3 text-sm font-medium text-left rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 transition-all duration-300
                    ${dark 
                      ? 'text-gray-300 bg-gray-800 hover:bg-gray-700' 
                      : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                    }`}
                >
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <ChevronUp
                    className={`${
                      open ? "transform rotate-180" : ""
                    } w-5 h-5 text-purple-500 transition-transform duration-300`}
                  />
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm">
                    {NavbarItemsDropdown[key].map((subItem, subIndex) => (
                      <MotionLink
                        key={subIndex}
                        color="foreground"
                        className={`block w-full py-2 rounded-md transition-colors duration-300
                          ${dark 
                            ? 'text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-200'
                          }`}
                        href="#"
                        size="lg"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center gap-3">
                          {icons[subItem.icon as keyof typeof icons]}
                          <div>
                            <div className="font-semibold">{subItem.label}</div>
                            <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {subItem.description}
                            </div>
                          </div>
                        </div>
                      </MotionLink>
                    ))}
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        ))}
      </NavbarMenu>
    </React.Fragment>
  );
}