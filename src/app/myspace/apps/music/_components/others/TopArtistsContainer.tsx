import { fetchTopArtists } from '@/utils/fetchers';
import LinkCardItem from '../list-items/LinkCardItem';
import { compactNumber } from '@/utils/formatters';

const TopArtistsContainer = async ({ limit }) => {
    const artists = await fetchTopArtists({ limit });

    return (
        <section className='py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900'>
            <div className='max-w-7xl mx-auto'>
                <h2 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-12">
                    Top Artists
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {artists.map(artist => {
                        const { id, name, picture_medium, nb_album, nb_fan } = artist;
                        const formattedFanNumber = compactNumber(nb_fan);
                        return (
                            <LinkCardItem
                                key={id}
                                title={name}
                                imgSrc={picture_medium}
                                href={`/myspace/apps/music/home/artist/${id}`}
                                description={`${formattedFanNumber} Fans | ${nb_album} Albums`}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default TopArtistsContainer;