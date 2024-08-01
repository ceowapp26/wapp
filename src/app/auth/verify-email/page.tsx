'use client';
import { useState, useEffect } from 'react';
import { Loader } from '@/components/loader';
import { useClerk } from "@clerk/nextjs";
import { useRouter } from 'next/navigation'; 
import { Button } from '@/components/ui/button';
import { CircleCheckBig, CircleAlert, PartyPopper, ArrowLeft } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { GradientLoadingCircle } from "@/components/gradient-loading-circle"

type Props = {}

const EmailVerification = (props: Props) => {
  const [verificationStatus, setVerificationStatus] = useState("loading");
  const { handleEmailLinkVerification } = useClerk();
  const router = useRouter();
  const { user } = useUser();
  const storedTempEmail = localStorage.getItem("tempEmail");
  const storedEmail = localStorage.getItem("email");

  useEffect(() => {
    async function verify() {
      try {
        await handleEmailLinkVerification({
          redirectUrl: "http://localhost:3000/auth/sign-in",
          redirectUrlComplete: "http://localhost:3000/home",
        });
        setVerificationStatus("verified");
      } catch (err) {
        setVerificationStatus(err.code === "expired" ? "expired" : "failed");
      }
    }
    verify();
  }, []);

  useEffect(() => {
    if (verificationStatus === 'verified' && (storedTempEmail || storedEmail)) {
      localStorage.removeItem('tempEmail');
      localStorage.removeItem('email');
    }
  }, [verificationStatus, storedEmail, storedTempEmail]);

  const handleReDirectHomePage = () => { 
    router.push("/home");
  };

  const handleRedirectSignup = () => { 
    router.push("/auth/sign-up");
  };

  let content = null;

  switch (verificationStatus) {
    case "loading":
      content = <GradientLoadingCircle />;
      break;
    case "failed":
    case "expired":
      content = (
        <div className="fixed p-8 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <div className="bg-white max-w-[350px] shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="flex flex-col items-center justify-center mb-4">
              <CircleAlert className="text-red-500 w-12 h-12 mr-2" />
              <h1 className="text-2xl font-bold">
                {verificationStatus === "failed" ? "Email link verification failed" : "Email link expired"}
              </h1>
            </div>
            <p className="text-gray-700 text-center mb-10">
              {verificationStatus === "failed" 
                ? "You have not successfully signed up for WApp."
                : "The email link has expired. Please try signing up again."
              }
            </p>
            <Button
              type="button"
              className="bg-white border border-green-500 w-[100px] hover:bg-green-500 hover:text-white text-green-500 font-bold py-2 px-4 rounded-full"
              onClick={handleRedirectSignup}
            >
              Back <ArrowLeft className="ml-4" />
            </Button>
          </div>
        </div>
      );
      break;
    case "verified":
      content = (
        <div className="fixed p-8 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <div className="bg-white max-w-[350px] shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="flex flex-col items-center justify-center mb-4">
              <CircleCheckBig className="text-green-500 w-12 h-12 mr-2" />
              <div className="flex items-center p-4">
                <h1 className="text-2xl font-bold">Success </h1>
                <PartyPopper className="text-green-500 w-8 h-8 ml-2 -mt-2" />
              </div>
            </div>
            <p className="text-gray-700 text-center mb-10">
              You have successfully signed up for WApp. Enjoy your journey with us!
            </p>
            <span className="typing-effect text-cener mr-4 w-full text-green-500 font-bold py-2 px-4">Wait.....</span>
          </div>
        </div>
      );
      break;
    default:
      content = null;
      break;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {content}
      {verificationStatus === "loading" && (
        <div className="mt-8">
          <Loader loading />
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
