import { fetchTopPlaylists } from "@/utils/fetchers";
import PlaylistListItem from "../../_components/list-items/PlaylistListItem";
import Carousel from "./Carousel";

const Playlists = async () => {
    const playlists = await fetchTopPlaylists();

    return (
        <section className='py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900 to-purple-900'>
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-extrabold text-white mb-8 relative">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                        Top Playlists
                    </span>
                    <span className="absolute -bottom-1 left-0 w-[36%] h-1 bg-gradient-to-r from-pink-500 to-violet-500"></span>
                </h2>
                <Carousel header='Explore Popular Collections'>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
                        {playlists.map(playlist => {
                            const { id, title, creation_date, picture_medium } = playlist;
                            return (
                                <div key={id} className="w-full flex justify-center">
                                    <PlaylistListItem
                                        id={id}
                                        title={title}
                                        imgSrc={picture_medium}
                                        creationDate={creation_date}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </Carousel>
                <div className="mt-12 text-center">
                    <a href="/all-playlists" className="inline-block px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                        Explore All Playlists
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Playlists;