import * as Tabs from '@radix-ui/react-tabs';
import { useAppSelector } from '@/hooks/hooks';
import { selectFavorites } from '@/stores/features/apps/music/favoritesSlice';
import TracksTabContent from './tabs/TracksTabContent';
import AlbumsTabContent from './tabs/AlbumsTabContent';
import RadioTabContainer from './tabs/RadioTabContainer';
import ArtistsTabContent from './tabs/ArtistsTabContent';
import PlaylistsTabContent from './tabs/PlaylistsTabContent';
import TabContentContainer from './TabContentContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

const TabsContainer = () => {
    const favorites = useAppSelector(selectFavorites);
    const { theme } = useTheme();

    const tabContents = [
        { value: 'tracks', component: TracksTabContent, entities: favorites.track },
        { value: 'albums', component: AlbumsTabContent, entities: favorites.album },
        { value: 'radio', component: RadioTabContainer, entities: favorites.radio },
        { value: 'artists', component: ArtistsTabContent, entities: favorites.artist },
        { value: 'playlists', component: PlaylistsTabContent, entities: favorites.playlist },
    ];

    return (
        <Tabs.Root defaultValue="tracks" className="w-full max-w-4xl mx-auto">
            <Tabs.List className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                {tabContents.map(({ value }) => (
                    <Tabs.Trigger
                        key={value}
                        value={value}
                        className={`px-4 py-2 text-sm font-medium transition-colors duration-200 capitalize
                            ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500
                            data-[state=active]:border-b-2 data-[state=active]:border-blue-500`}
                    >
                        {value}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
            <AnimatePresence mode="wait">
                {tabContents.map(({ value, component: Component, entities }) => (
                    <Tabs.Content key={value} value={value} className="outline-none">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TabContentContainer entities={entities}>
                                <Component {...{ [value]: entities }} />
                            </TabContentContainer>
                        </motion.div>
                    </Tabs.Content>
                ))}
            </AnimatePresence>
        </Tabs.Root>
    );
};

export default TabsContainer;

