import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useAppContextHook } from '@/context/app-context-provider';
import { useApp } from '@/hooks/use-app';

type Props = {};

const ButtonHandler: React.FC<Props> = (props: Props) => {
  const { appStatus, featureStatus, setCurrentStep, currentStep, setAppName } = useAppContextHook();
  const { watch, trigger, setValue } = useFormContext();
  const { onRegisterApp } = useApp();
  const name = watch('name');
  const version = watch('version');
  const category = watch('category');
  const deployedDate = watch('deployedDate');
  const releasedDate = watch('releasedDate');
  const description = watch('description');
  const developer = watch('developer');
  const license = watch('license');
  const watermark = watch('watermark');
  const domain = watch('domain');
  const logo = watch('logo');
  const plan = watch('plan');
  const handleRegisterApp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let isValid = await trigger(['name', 'category', 'deployedDate', 'releasedDate', 'description', 'description', 'developer', 'license', 'watermark', 'domain', 'logo', 'plan']);
    if (isValid) {
      const data = {
        name: name,
        version: version,
        category: category,
        plan: plan,
        deployedDate: new Date(deployedDate),
        releasedDate: new Date(releasedDate),
        description: description,
        developers: {
          lead: developer,
          team: [developer]
        },
        releaseNotes: [
          {
            version: version,
            date: new Date(releasedDate),
            notes: "Initial release."
          }
        ],
        license: license,
        platform: "WAPP",
        watermark: watermark,
        domain: domain,
        logo: logo
      };
      const appId = await onRegisterApp(data, setCurrentStep);
      setValue('appId', appId);
      setAppName(name);
    }
  };

  return (
    <div className="w-full py-6 flex flex-col gap-3 items-center">
      {currentStep !== 2 && (
        <Button
          type="submit"
          className="w-full bg-black text-slate-50 hover:text-black hover:bg-slate-100"
          onClick={(e) => handleRegisterApp(e)}
        >
        {appStatus === "CREATE" ? 'Register App' : 'Update App'}
        </Button>
      )}
      {currentStep === 2 && (
        <Button
          type="submit"
          className="w-full bg-black text-slate-50 hover:text-black hover:bg-slate-100"
        >
          {featureStatus === "CREATE" ? 'Register Feature' : 'Update Feature'}
        </Button>
      )}
    </div>
  );
};

export default ButtonHandler;
