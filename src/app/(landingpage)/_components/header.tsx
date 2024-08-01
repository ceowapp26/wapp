"use client";
import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { ArrowRight } from "lucide-react";
import { useStoreUser } from "@/hooks/use-store-user";
import { ProductMenu } from "./menu/product-menu";
import { SolutionMenu } from "./menu/solution-menu";
import { ResourceMenu } from "./menu/resource-menu";
import { MenuWrapper } from "./menu/menu-wrapper";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { Disclosure, Transition } from "@headlessui/react";
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import { ChevronUp, ChevronDown, Lock, Activity, Flash, Server, TagUser, Scale } from "@/icons/navbar-icon";
import { NavbarItemsNoDropdown, NavbarItemsDropdown } from "@/constants/navbar";
import { Logo } from "@/components/logo"
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

const Header: React.FC = () => {
    const { isLoading, isAuthenticated, role } = useStoreUser();
    const [hovering, setHovering] = useState<number | null>(null);
    const [popoverLeft, setPopoverLeft] = useState<number | null>(null);
    const [popoverArrowLeft, setPopoverArrowLeft] = useState<number | null>(null);
    const [popoverHeight, setPopoverHeight] = useState<number | null>(null);
    const [popoverWidth, setPopoverWidth] = useState<number | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const refs = useRef<(HTMLElement | null)[]>([]);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const scrolled = useScrollTop();
    const redirectRoute = isAuthenticated ? (role !== 'admin' ? '/home' : '/admin') : null;

    const focusMenu = (index: number, event: MouseEvent<HTMLAnchorElement>) => {
        setHovering(index);
        const itemOffsetLeft = event.currentTarget.offsetLeft;
        const itemWidth = event.currentTarget.offsetWidth;
        setPopoverLeft(itemOffsetLeft);
        setPopoverArrowLeft(itemWidth / 2 + 100 - 10);
        const menuElement = refs.current[index];
        if (menuElement) {
          setPopoverHeight(menuElement.offsetHeight);
          setPopoverWidth(menuElement.offsetWidth);
        }
    };

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

        return () => {
            document.body.classList.remove('overflow-hidden');
        };
    }, [isOpen]);

return (
  <nav 
    role="navigation" 
    onMouseLeave={() => setHovering(null)}
    className="z-[55] nav-header dark:shadow-blue bg-transparent fixed top-0 items-center self-center flex w-full max-w-full justify-center gap-5 my-auto tablet:block"
  >
    <div className="flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-16 items-center">
      <div className="flex-shrink-0 absolute w-10 h-10">
        <a href="/" className="text-gray-800 font-semibold text-lg"><Logo width={500} height={500} /></a>
      </div>
      <div className="flex w-full relative pl-24 tablet:hidden justify-between items-center">
        <a
           ref={el => itemRefs.current[0] = el}
          onFocus={(event) => focusMenu(0, event)}
          onMouseEnter={(event) => focusMenu(0, event)}
          href="/products"
          className="text-white text-center text-base font-medium leading-6 tracking-wide whitespace-nowrap transition-all duration-200"
        >
          Products
        </a>
        <a 
          ref={el => itemRefs.current[1] = el}
          onFocus={(event) => focusMenu(1, event)}
          onMouseEnter={(event) => focusMenu(1, event)}
          href="/solutions"
          className="text-white text-center text-base font-medium leading-6 tracking-wide whitespace-nowrap transition-all duration-200"
        >
          Solutions
        </a>
        <a 
          ref={el => itemRefs.current[2] = el}
          onFocus={(event) => focusMenu(2, event)}
          onMouseEnter={(event) => focusMenu(2, event)}
          href="/resources"
          className="text-white text-center text-base font-medium leading-6 tracking-wide whitespace-nowrap transition-all duration-200"
        >
          Resources
        </a>
        <a href="/pricing" className="text-white text-center text-base font-medium leading-6 tracking-wide whitespace-nowrap transition-all duration-200">Pricing</a>
        <div className="flex items-center">
          <ModeToggle />
          <div className="ml-4 flex">
            {isAuthenticated && !isLoading && redirectRoute && (
              <>
                <Button asChild className="mr-3">
                  <Link href={redirectRoute}>
                    Enter WApp
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <UserButton afterSignOutUrl="/" />
              </>
            )}
            {!isAuthenticated && !isLoading && (
              <>
                <Button className="ml-4">
                  <Link className="flex items-center" href="/auth/sign-up">
                    Try WApp
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button className="ml-4">
                  <Link href="/auth/sign-in">
                    Login
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      {hovering !== null && (
        <div className="absolute z-[50] -ml-[80px] 2xl:ml-[50px] top-16 pt-2 w-full" style={{ left: popoverLeft ?? 0 }}>
          <div className="flex items-center w-full h-full bg-transparent transition-opacity duration-200">
            <div 
              className="
              relative w-0 h-0 
              border-l-[8px] border-l-transparent
              border-b-[8px] border-b-yellow
              border-r-[8px] border-r-transparent" style={{ left: popoverArrowLeft ?? 0 }}>
            </div>
          </div>
          <div className={clsx(hovering !== null ? "transition-opacity duration-200" : "opacity-0 pointer-events-none")}>
            <div style={{ height: popoverHeight || 100, width: popoverWidth || 500 }} className="dark:bg-black bg-white max-h-[600px] overflow-y-auto transform-gpu rounded shadow-lg relative overflow-x-hidden transition-all duration-200">
              <MenuWrapper className="w-[72rem]" index={0} hovering={hovering}>
                <ProductMenu ref={ref => refs.current[0] = ref} />
              </MenuWrapper>
              <MenuWrapper className="w-[36rem]" index={1} hovering={hovering}>
                <SolutionMenu ref={ref => refs.current[1] = ref} />
              </MenuWrapper>
              <MenuWrapper className="w-[36rem]" index={2} hovering={hovering}>
                <ResourceMenu ref={ref => refs.current[2] = ref} />
              </MenuWrapper>
            </div>
          </div>
        </div>   
      )}     
      <div className="w-full justify-end -mr-2 gap-x-4 hidden tablet:flex">
        <ModeToggle />
        {isAuthenticated && !isLoading && (
          <UserButton afterSignOutUrl="/" />
        )}
        <button onClick={toggleNavbar} type="button" className="inline-flex items-center justify-center">
          <svg className={`${isOpen ? 'hidden' : 'block'} h-8 w-8 p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    <div className={`${isOpen ? 'tablet:block' : 'hidden'} hidden relative h-screen w-full`}>
      <div className="px-2 pt-2 pb-3 sm:px-3">
        <a href="/pricing" className="dark:text-white text-black text-gray-800 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200">Pricing</a>
        <a href="/features" className="dark:text-white text-black text-gray-800 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium transition-all duration-200">Features</a>
        <div className="relative group">
        {Object.keys(NavbarItemsDropdown).map((key, index) => (
          <Disclosure as={motion.div} key={index} className="mt-4">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex justify-between w-full px-4 py-3 text-sm font-medium text-left text-white bg-slate-300/50 rounded-lg hover:bg-slate-700/50 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 transition-all duration-300">
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <ChevronUp
                    className={`${
                      open ? "transform rotate-180" : ""
                    } w-5 h-5 text-purple-300 transition-transform duration-300`}
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
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-white">
                    {NavbarItemsDropdown[key].map((subItem, subIndex) => (
                      <MotionLink
                        key={subIndex}
                        color="foreground"
                        className="block w-full py-2 hover:bg-gray-800 rounded-md transition-colors duration-300"
                        href="#"
                        size="lg"
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center gap-3">
                          {icons[subItem.icon as keyof typeof icons]}
                          <div>
                            <div className="font-semibold text-white">{subItem.label}</div>
                            <div className="text-xs text-white/80">{subItem.description}</div>
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
        </div>
        {isAuthenticated && !isLoading && (
          <>
            <Button className="p-2 mt-4" asChild>
              <Link href={redirectRoute}>
                Enter WApp
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </>
        )}
        {!isAuthenticated && !isLoading && (
          <>
            <Button className="p-2 mt-4" asChild>
              <Link href="/auth/sign-up">
                Try WApp
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  </nav>
  );
};

export default Header;
