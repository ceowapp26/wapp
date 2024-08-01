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

export const Logo: React.FC<LogoProps> = ({height, width}) => {
  return (
    <a href="/home" className="flex cursor-pointer justify-center items-center gap-x-4">
      <Image
        src="/global/company_logos/wapp-logo.png"
        height={height}
        width={width}
        alt="Logo"
      />
     </a>
  )
}