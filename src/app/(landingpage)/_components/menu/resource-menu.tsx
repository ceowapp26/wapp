"use client"

import React, { forwardRef, useRef, useEffect } from "react";
import Image from 'next/image';

const MenuLink = forwardRef(({ type, href, imageSrc, title, description, beta }, ref) => {
  const isMainLink = type === "main";
  return (
    <a
      ref={ref}
      href={href}
      className="text-white items-center py-5 px-5 no-underline inline-flex max-w-full hover:bg-gray-800"
    >
      {isMainLink && (
        <div className="h-57 min-w-57 border-1 border-solid border-white border-opacity-10 bg-gray-900 rounded-12 justify-center items-center flex">
          <Image
            className="max-w-full align-middle inline-block"
            src={imageSrc}
            loading="lazy"
            width={35}
            height={35}
            alt={title}
          />
        </div>
      )}

      <div className={`dropdown-link-item-right ml-3 ${isMainLink ? "col-span-2" : ""}`}>
        {isMainLink && (
          <>
            <div className="gap-x-2 gap-y-2 items-center text-xs font-semibold flex">
              {title} {beta && <span className="beta">BETA</span>}
            </div>
            <div className="opacity-80 mt-6 text-xs">{description}</div>
          </>
        )}

        {!isMainLink && <div className="ml-3 col-span-2 text-xs font-semibold">{title}</div>}
      </div>
    </a>
  );
});

MenuLink.displayName = 'MenuLink';

export const ResourceMenu = forwardRef<HTMLDivElement>((props, ref) => {
  const linkRefs = useRef([]);

  useEffect(() => {
    if (props.active) {
      linkRefs.current[0]?.focus();
    }
  }, [props.active]);

  function onKeyPress(event) {
    const currentIndex = linkRefs.current.indexOf(document.activeElement);
    if (event.key === 'ArrowDown') {
      const newFocused = linkRefs.current[currentIndex + 1] || linkRefs.current[0];
      newFocused.focus();
    } else if (event.key === 'ArrowUp') {
      const newFocused = linkRefs.current[currentIndex - 1] || linkRefs.current[linkRefs.current.length - 1];
      newFocused.focus();
    }
  }

  const capabilities = [
    [
      {
        title: "Products",
        items: [
          {
            href: "/additionals",
            imageSrc: "/global/images/navbar/connect.png",
            title: "Unified Feedback Repository",
            description: "Eliminate data silos to get a unified source of truth",
            beta: true,
            type: "main"
          },
          {
            href: "/additionals",
            imageSrc: "/global/images/navbar/square.png",
            title: "Integrations",
            description: "Connect to any app containing customer feedback",
            beta: false,
            type: "main"
          }
        ]
      },
      {
        title: "Products",
        items: [
          {
            href: "/additionals",
            imageSrc: "/global/images/navbar/connect.png",
            title: "Unified Feedback Repository",
            description: "Eliminate data silos to get a unified source of truth",
            beta: true,
            type: "main"
          },
          {
            href: "/blogs",
            imageSrc: "/global/images/navbar/square.png",
            title: "Integrations",
            description: "Connect to any app containing customer feedback",
            beta: false,
            type: "main"
          }
        ]
      },
      {
        title: "Products",
        items: [
          {
            href: "/additionals",
            imageSrc: "/global/images/navbar/connect.png",
            title: "Unified Feedback Repository",
            description: "Eliminate data silos to get a unified source of truth",
            beta: true,
            type: "main"
          },
          {
            href: "/additionals",
            imageSrc: "/global/images/navbar/square.png",
            title: "Integrations",
            description: "Connect to any app containing customer feedback",
            beta: false,
            type: "main"
          }
        ]
      }
    ],
    [
      {
        title: "Technologies",
        items: [
          {
            href: "/additionals",
            imageSrc: "/global/images/navbar/square.png",
            title: "Feedback Tracking",
            description: "Track feedback progress and outcomes",
            beta: false,
            type: "main"
          }
        ]
      },
      {
        title: "Technologies",
        items: [
          {
            href: "/blogs",
            imageSrc: "/global/images/navbar/square.png",
            title: "Feedback Tracking",
            description: "Track feedback progress and outcomes",
            beta: false,
            type: "main"
          }
        ]
      },
      {
        title: "Technologies",
        items: [
          {
            href: "/additionals",
            imageSrc: "/global/images/navbar/square.png",
            title: "Feedback Tracking",
            description: "Track feedback progress and outcomes",
            beta: false,
            type: "main"
          }
        ]
      },
      {
        title: "Technologies",
        items: [
          {
            href: "/additionals",
            imageSrc: "/global/images/navbar/square.png",
            title: "Feedback Tracking",
            description: "Track feedback progress and outcomes",
            beta: false,
            type: "main"
          }
        ]
      }
    ]
  ];
  return (
    <nav
      ref={ref}
      className="w-dropdown-list w-full bg-transparent absolute left-1/2 transform -translate-x-1/2 rounded-lg"
      id="w-dropdown-list-0"
      aria-labelledby="w-dropdown-toggle-0"
    >
      <div className="w-full max-w-3xl bg-purple-900 flex justify-between">
        <div className="w-full border-dropdown-border px-6 py-8 flex gap-x-8">
          {capabilities.map((section, index) => (
            <div key={index} className="flex flex-col h-full">
              {section.map((subsection, subIndex) => (
                <React.Fragment key={`${index}-${subIndex}`}>
                  <h1 className="text-start p-4 font-bold text-lg">{subsection.title}</h1>
                  {subsection.items.map((item, itemIndex) => (
                    <React.Fragment key={itemIndex}>
                      <MenuLink
                        ref={el => linkRefs.current.push(el)}
                        type={item.type}
                        href={item.href}
                        imageSrc={item.imageSrc}
                        title={item.title}
                        description={item.description}
                        beta={item.beta}
                      />
                      {itemIndex !== subsection.items.length - 1 && <hr className="my-4 border-b border-gray-700" />}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
              {index !== capabilities.length - 1 && <hr className="my-4 border-b border-gray-700" />}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
});

