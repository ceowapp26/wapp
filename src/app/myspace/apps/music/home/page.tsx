import Playlists from "../_components/others/Playlists";
import TrackListContainer from "../_components/others/TrackListContainer";
import { fetchTopTracks } from "@/utils/fetchers";
import TopArtistsContainer from "../_components/others/TopArtistsContainer";
import { cn } from "@/lib/utils";

export default async function MusicHomePage() {
  const tracks = await fetchTopTracks({ limit: 10 });

  return (
    <div 
      className={cn(
        'grid laptopM:grid-cols-1 grid-cols-2 gap-x-12 gap-y-5vh relative top-100px h-full overflow-y-auto max-h-60vh',
        'bg-gradient-to-b from-purple-900 to-blue-700', 
        'bg-opacity-50', 
      )}
      style={{ 
        backgroundImage: "linear-gradient(110deg, rgb(6, 14, 75) 0%, rgb(7, 19, 89) 40%, rgba(7, 23, 105, 0.35) 70%, rgba(0, 0, 255, 0.8) 100%), url('/music/images/default_player_image.png')" 
      }}      
    >
      <TrackListContainer
        header='Trending right now'
        tracks={ tracks }
        className='col-span-2'
      />
      <div className="flex flex-col gap-y-5vh pb-20">
        <TopArtistsContainer limit={ 3 } />
        <Playlists />
      </div>
    </div>
  );
}
