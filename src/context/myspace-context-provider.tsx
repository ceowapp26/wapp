'use client';
import React, { createContext, useContext, useState } from 'react';
import useLocalStorage from "@/hooks/use-local-storage";
import { Organization } from "@/types/organization";
import { SummaryData } from "@/types/chat";
import { Context, Model } from "@/types/ai"; 

interface MyspaceContextType {
  viewPort: HTMLElement | null; 
  setViewPort: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  audioRef: HTMLElement | null; 
  setAudioRef: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  selectedMenu: boolean;
  setSelectedMenu: React.Dispatch<React.SetStateAction<boolean>>;
  menuSidebar: boolean;
  setMenuSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  isAppbarCollapsed: boolean;
  setIsAppbarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  coverReposition: boolean;
  setCoverReposition: React.Dispatch<React.SetStateAction<boolean>>;
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  isLeftSidebarOpened: boolean;
  setIsLeftSidebarOpened: React.Dispatch<React.SetStateAction<boolean>>;
  leftSidebarWidth: number;
  setLeftSidebarWidth: React.Dispatch<React.SetStateAction<number>>;
  leftSidebarType: string;
  setLeftSidebarType: React.Dispatch<React.SetStateAction<string>>;
  isRightSidebarOpened: boolean;
  setIsRightSidebarOpened: React.Dispatch<React.SetStateAction<boolean>>;
  rightSidebarType: string;
  setRightSidebarType: React.Dispatch<React.SetStateAction<string>>;
  rightSidebarWidth: number;
  setRightSidebarWidth: React.Dispatch<React.SetStateAction<number>>;
  isLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAppbarHidden: boolean;
  setIsAppbarHidden: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;  
  selectedSideMenu: string;
  setSelectedSideMenu: React.Dispatch<React.SetStateAction<string>>;
  activeDocument: string;
  setActiveDocument: React.Dispatch<React.SetStateAction<string>>;
  homePlayerToggle: boolean;
  setHomePlayerToggle: React.Dispatch<React.SetStateAction<boolean>>;
  activeMenu: boolean;
  setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;
  screenSize: number;
  setScreenSize: React.Dispatch<React.SetStateAction<number>>;
  showFullMenu: boolean;
  setShowFullMenu: React.Dispatch<React.SetStateAction<boolean>>;
  activeOrg: Organization;
  setActiveOrg: React.Dispatch<React.SetStateAction<Organization>>;
  font: string;
  setFont: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentSong: {
    image: string;
    title: string;
    artist: string;
    song: string;
  };
  setcurrentSong: React.Dispatch<React.SetStateAction<{
    image: string;
    title: string;
    artist: string;
    song: string;
  }>>;
}

const MyspaceContext = createContext<MyspaceContextType | undefined>(undefined);

export const MyspaceContextProvider: React.FC = ({ children }: { children: React.ReactNode }) => {
  const SampleImage = '/music/images/default_player_image.png';
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<boolean>(false);
  const [isLeftSidebarOpened, setIsLeftSidebarOpened] = useState<boolean>(true);
  const [isRightSidebarOpened, setIsRightSidebarOpened] = useState<boolean>(false);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState<number>(250);
  const [rightSidebarWidth, setRightSidebarWidth] = useState<number>(0);
  const [leftSidebarType, setLeftSidebarType] = useState<string>("");
  const [rightSidebarType, setRightSidebarType] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAppbarHidden, setIsAppbarHidden] = useState<boolean>(false);
  const [selectedSideMenu, setSelectedSideMenu] = useState<string>("");
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [viewPort, setViewPort] =  useState<HTMLElement | null>(null);
  const [homePlayerToggle, setHomePlayerToggle] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<boolean>(true);
  const [screenSize, setScreenSize] = useState<number>(undefined);
  const [showFullMenu, setShowFullMenu] = useState<boolean>(true);
  const [audioRef, setAudioRef] = useState<HTMLElement | null>(null);
  const [menuSidebar, setMenuSidebar] = useState<boolean>(false);
  const [font, setFont] = useLocalStorage<string>("novel__font", "Default");
  const [isAppbarCollapsed, setIsAppbarCollapsed] = useState<boolean>(false);
  const [coverReposition, setCoverReposition] = useState<boolean>(false);
  const [activeDocument, setActiveDocument] = useState<string>(undefined);
  const [activeOrg, setActiveOrg] = useState<string>({});
  const [currentSong, setcurrentSong] = useState<{
    image: string;
    title: string;
    artist: string;
    song: string;
  }>({
    image: SampleImage,
    title: 'sample',
    artist: 'sample',
    song: 'sample',
  });

  return (
    <MyspaceContext.Provider value={{ 
      viewPort, setViewPort,
      isLoading, setIsLoading,
      selectedMenu, setSelectedMenu,
      isLeftSidebarOpened, setIsLeftSidebarOpened,
      leftSidebarWidth, setLeftSidebarWidth,
      leftSidebarType, setLeftSidebarType,
      rightSidebarWidth, setRightSidebarWidth, 
      isRightSidebarOpened, setIsRightSidebarOpened,
      rightSidebarType, setRightSidebarType,
      isAppbarCollapsed, setIsAppbarCollapsed,    
      menuSidebar, setMenuSidebar,
      tabIndex, setTabIndex,
      isAppbarHidden, setIsAppbarHidden,
      isModalOpen, setIsModalOpen,
      selectedSideMenu, setSelectedSideMenu,
      activeMenu, setActiveMenu,
      screenSize, setScreenSize,
      showFullMenu, setShowFullMenu,
      currentSong, setcurrentSong,
      homePlayerToggle, setHomePlayerToggle,
      audioRef, setAudioRef,
      coverReposition, setCoverReposition, 
      font, setFont,
      activeDocument, setActiveDocument,
      activeOrg, setActiveOrg,
    }}>
      {children}
    </MyspaceContext.Provider>
  );
};

export const useMyspaceContext = () => {
  const context = useContext(MyspaceContext);
  if (!context) {
    throw new Error('useStateContext must be used within a ContextProvider');
  }
  return context;
};

