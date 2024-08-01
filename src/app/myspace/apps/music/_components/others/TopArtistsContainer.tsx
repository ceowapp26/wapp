import { fetchTopArtists } from '@/utils/fetchers';
import LinkCardItem from '../list-items/LinkCardItem';
import { compactNumber } from '@/utils/formatters';

const TopArtistsContainer = async ({ limit }) => {
    const artists = await fetchTopArtists({ limit });

    return (
        <div className='flex flex-col h-full overflow-y-auto p-6'>
            <h2 className="text-2xl font-bold text-white mb-4">Top Artist</h2>
            <ul className="grid grid-cols-3 gap-8">
                {
                    artists.map(artist => {
                        const { id, name, picture_medium, nb_album, nb_fan } = artist;
                        const formattedFanNumber = compactNumber(nb_fan);

                        return (
                            <LinkCardItem
                                key={ id }
                                title={ name }
                                imgSrc= { picture_medium }
                                href={ `/myspace/apps/music/home/artist/${ id }` }
                                description={ `${ formattedFanNumber } Fans | ${ nb_album } Albums` }
                                className="flex flex-col gap-2"
                            />
                        );
                    })
                }
            </ul>
        </div>
    );
};

export default TopArtistsContainer;
