import { fetchTopPlaylists } from "@/utils/fetchers";
import PlaylistListItem from "../../_components/list-items/PlaylistListItem";
import Carousel from "./Carousel";

const Playlists = async () => {
    const playlists = await fetchTopPlaylists();
    
    return (
        <div className='p-6 space-y-1'>            
            <Carousel header='Playlists'>
                <div className="flex gap-8">
                    {
                        playlists.map(playlist => {
                            const { id, title, creation_date, picture_medium } = playlist;
                            return (
                                <PlaylistListItem
                                    id={ id }
                                    key={ id }
                                    title={ title }
                                    imgSrc={ picture_medium }
                                    creationDate={ creation_date }
                                />
                            );
                        })
                    }
                </div>
            </Carousel>        
        </div>
    );
};

export default Playlists;
