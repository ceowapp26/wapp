import { Button } from '@/components/ui/button';
import React from 'react';
import { usePortalContextHook } from '@/context/portal-context-provider';
import { useRouter } from 'next/navigation';

type Props = {};

const ButtonHandler: React.FC<Props> = () => {
  const router = useRouter();

  const handleRedirect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/myspace/apps/portal/viewport")
  };

  return (
    <div className="w-full py-6 flex flex-col gap-3 items-center">
        <Button
          type="button"
          className="w-1/4 bg-black text-slate-50 hover:text-black hover:bg-slate-100"
          onClick={(e) => handleRedirect(e)}
        >
          Enter Portal
        </Button>
    </div>
  );
};

export default ButtonHandler;
