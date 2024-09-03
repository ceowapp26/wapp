import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"]
});


interface LogoProps {
    height: number;
    width: numner;
}

export const LogoSmallScreen: React.FC<LogoProps> = ({height, width}) => {
  return (
    <div className="flex items-center fixed top-6 left-2 gap-x-2">
      <Image
        src="/doc/logo.svg"
        height={height}
        width={width}
        alt="Logo"
        className="dark:hidden"
      />
      <Image
        src="/doc/logo-dark.svg"
        height={height}
        width={width}
        alt="Logo"
        className="hidden dark:block"
      />
    </div>
  )
}