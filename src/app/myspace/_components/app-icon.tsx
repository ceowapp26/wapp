import React from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { removeFromLists } from '@/redux/features/apps/appsSlice';
import { X } from 'lucide-react';

interface AppProps {
  appName: string;
  logo: string;
  url: string;
  isRemoveable?: boolean;
}

export const AppIcon = ({ appName, logo, url, isRemoveable }: AppProps) => {
  const dispatch = useDispatch();
  
  const handleRemoveApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeFromLists({ appName }));
  };

  return (
    <div className="flex-none p-2">
      <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 cursor-pointer group">
        <Link href={url ? url : '#'}>
          <div 
            className="absolute inset-4 bg-cover bg-center"
            style={{ backgroundImage: `url(${logo})` }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity group-hover:bg-opacity-50" />
          <strong className="absolute bottom-2 left-2 right-2 text-white dark:text-white text-xs font-medium text-center">
            {appName}
          </strong>
        </Link>
        {isRemoveable &&
          <button
            className="absolute top-1 right-1 flex items-center justify-center rounded-full w-6 h-6 bg-white bg-opacity-70 hover:bg-opacity-100 transition-colors"
            onClick={handleRemoveApp}
          >
            <X className="w-4 h-4 text-gray-800" />
          </button>
        }
      </div>
    </div>
  );
};
