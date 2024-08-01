import * as Tabs from '@radix-ui/react-tabs';
import { useAppSelector } from '@/hooks/hooks';
import { selectFavorites } from '@/redux/features/apps/music/favoritesSlice';
import TracksTabContent from './tabs/TracksTabContent';
import AlbumsTabContent from './tabs/AlbumsTabContent';
import RadioTabContainer from './tabs/RadioTabContainer';
import ArtistsTabContent from './tabs/ArtistsTabContent';
import PlaylistsTabContent from './tabs/PlaylistsTabContent';
import TabContentContainer from './TabContentContainer';

const TabsContainer = () => {
    const favorites = useAppSelector(selectFavorites);

    return (
        <>
            <Tabs.Content value='tracks'>
                <TabContentContainer entities={ favorites.track }>
                    <TracksTabContent tracks={ favorites.track } />
                </TabContentContainer>
            </Tabs.Content>

            <Tabs.Content value='albums'>
                <TabContentContainer entities={ favorites.album }>
                    <AlbumsTabContent albums={ favorites.album } />
                </TabContentContainer>
            </Tabs.Content>
            
            <Tabs.Content value='radio'>
                <TabContentContainer entities={ favorites.radio }>
                    <RadioTabContainer radios={ favorites.radio }/>
                </TabContentContainer>
            </Tabs.Content>

            <Tabs.Content value='artists'>
                <TabContentContainer entities={ favorites.artist }>
                    <ArtistsTabContent artists={ favorites.artist }/>
                </TabContentContainer>
            </Tabs.Content>

            <Tabs.Content value='playlists'>
                <TabContentContainer entities={ favorites.playlist }>
                    <PlaylistsTabContent playlists={ favorites.playlist }/>
                </TabContentContainer>
            </Tabs.Content>   
        </>
    );
};

export default TabsContainer;