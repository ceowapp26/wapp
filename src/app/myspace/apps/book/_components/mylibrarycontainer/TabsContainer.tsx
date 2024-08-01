"use client";
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useAppSelector } from '@/hooks/hooks';
import { selectLibraryBooks } from '@/redux/features/apps/book/libraryBooksSlice';
import MyFavoriteTabContent from './tabs/MyFavorite';
import ReadingNowTabContent from './tabs/ReadingNow';
import ToReadTabContent from './tabs/ToRead';
import HaveReadTabContent from './tabs/HaveRead';
import TabContentContainer from './TabContentContainer';
import { useMyspaceContext } from "@/context/myspace-context-provider";

const TabsContainer = () => {
    const books = useAppSelector(selectLibraryBooks);
    const { tabIndex, setTabIndex, isAppbarCollapsed } = useMyspaceContext();

    return (
        <Tabs className="p-10" selectedIndex={tabIndex}  onSelect={(index) => setTabIndex(index)}>
            <TabList>
              <Tab>My Favorite</Tab>
              <Tab>Reading Now</Tab>
              <Tab>To Read</Tab>
              <Tab>Have Read</Tab>
            </TabList>
            <TabPanel>
                  {books.myfavorite ? (
                    <TabContentContainer key={books.myfavorite} entities={books.myfavorite}>
                        <MyFavoriteTabContent myfavorites={books.myfavorite} />
                    </TabContentContainer>
                ) : (
                    <div>Loading...</div>
                )}
            </TabPanel>
            <TabPanel>
                {books.readingnow ? (
                    <TabContentContainer key={books.readingnow} entities={books.readingnow}>
                        <ReadingNowTabContent readingnows={books.readingnow} />
                    </TabContentContainer>
                ) : (
                    <div>Loading...</div>
                )}
            </TabPanel>
            <TabPanel>
                {books.toread ? (
                    <TabContentContainer key={books.toread} entities={books.toread}>
                        <ToReadTabContent toreads={books.toread} />
                    </TabContentContainer>
                ) : (
                    <div>Loading...</div>
                )}
            </TabPanel>
            <TabPanel>
                {books.haveread ? (
                    <TabContentContainer key={books.haveread} entities={books.haveread}>
                        <HaveReadTabContent havereads={books.haveread} />
                    </TabContentContainer>
                ) : (
                    <div>Loading...</div>
                )}
            </TabPanel>
        </Tabs>
    );
};

export default TabsContainer;



