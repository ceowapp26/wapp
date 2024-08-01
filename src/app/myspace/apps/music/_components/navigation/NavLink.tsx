'use client';
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import clsx from 'clsx';

interface NavLinkProps {
    slug?: string;
    children: React.ReactNode;
    isLofi?: boolean;
}

const NavLink = ({ slug, children, isLofi }: NavLinkProps) => {
    const segment = useSelectedLayoutSegment() || '';
    const isActive = segment === slug;

    return (
        <Link 
            href={isLofi ? `/myspace/apps/music/lofi` : `/myspace/apps/music/home/${slug}`} 
            className={clsx(
                "flex items-center gap-1 py-4 pl-4 text-sm text-white transition-all",
                {
                    "bg-gradient-to-r from-pink-500 via-transparent bg-[length:200%_100%] bg-left": isActive,
                    "hover:bg-right": true
                }
            )}
        >
            {children}
        </Link>
    );
};

export default NavLink;
