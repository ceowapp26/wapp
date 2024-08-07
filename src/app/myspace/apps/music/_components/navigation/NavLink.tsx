'use client';
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface NavLinkProps {
    slug?: string;
    children: React.ReactNode;
    isLofi?: boolean;
}

const NavLink = ({ slug, children, isLofi }: NavLinkProps) => {
    const segment = useSelectedLayoutSegment() || '';
    const isActive = segment === slug;
    const { theme } = useTheme();

    const linkVariants = {
        initial: { x: -20, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        hover: { scale: 1.05, transition: { duration: 0.2 } },
        tap: { scale: 0.95 }
    };

    return (
        <motion.div
            variants={linkVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
        >
            <Link 
                href={isLofi ? `/myspace/apps/music/lofi` : `/myspace/apps/music/home/${slug}`} 
                className={`
                    flex items-center gap-2 py-3 px-4 rounded-lg text-sm transition-all duration-300
                    ${isActive 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : theme === 'dark'
                            ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                            : 'text-gray-700 hover:text-black hover:bg-gray-200'
                    }
                `}
            >
                <motion.div
                    className="flex items-center gap-2"
                    animate={{ x: isActive ? 5 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    {children}
                </motion.div>
            </Link>
        </motion.div>
    );
};

export default NavLink;