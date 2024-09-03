'use client';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const [visible, setVisible] = useState(true);
  const currentRouter = usePathname();
  const router = useRouter(); 
  const { user } = useUser();

  useEffect(() => {
    if (currentRouter.includes('verify-email') || currentRouter.endsWith('post-signup')  || currentRouter.endsWith('post-signin')) {
      setVisible(false);
    }
  }, [currentRouter]);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]); 

  return (
    <React.Fragment>
      {visible ? (
        <div className="min-h-screen dark:bg-cream flex w-full justify-center">
          <div className="w-full max-w-[500px] flex flex-col items-start p-4">
            <Logo
              width={40}
              height={40}
            />
            {children}
          </div>
          <div className="hidden lg:flex flex-1 w-full max-h-full overflow-hidden relative bg-cream flex-col pt-12 pl-24 pr-12 gap-8">
            <h2 className="text-gravel text-5xl font-extrabold leading-tight">
              Welcome to <span className="text-blue-600">Wapp</span>
            </h2>
            <div className="space-y-6">
              <p className="text-iridium text-xl leading-relaxed">
                Wapp is your all-in-one platform, designed to streamline your business operations and boost productivity.
              </p>
              <div className="space-y-4">
                <h3 className="text-gravel text-2xl font-semibold">Who We Serve:</h3>
                <ul className="list-disc list-inside text-iridium space-y-2">
                  <li>Small Business Owners</li>
                  <li>Freelancers</li>
                  <li>Large Enterprises</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-gravel text-2xl font-semibold">What We Offer:</h3>
                <ul className="list-disc list-inside text-iridium space-y-2">
                  <li>Tailored tools and services to meet your unique needs</li>
                  <li>Seamless integration with your existing workflow</li>
                  <li>Enhanced project management and team collaboration</li>
                  <li>Efficient client communication tools</li>
                </ul>
              </div>
              <p className="text-iridium text-lg italic">
                Experience the power of Wapp - where flexibility meets efficiency.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-[120vh] dark:bg-cream flex w-full justify-center">{children}</div>
      )}
    </React.Fragment>
  );
};

export default Layout;