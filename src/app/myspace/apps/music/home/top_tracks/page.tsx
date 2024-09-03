import { fetchTopTracks } from "@/utils/fetchers";
import TrackListContainer from "../../_components/others/TrackListContainer";
import { cn } from "@/lib/utils";

export default async function TopTracks() {
    const tracks = await fetchTopTracks({ limit: 50 });
    return (
        <div 
          className={cn(
            'grid laptopM:grid-cols-1 grid-cols-2 gap-x-12 gap-y-5vh relative top-100px h-full overflow-y-auto max-h-60vh',
            'bg-gradient-to-b from-purple-900 to-blue-700', 
            'bg-opacity-50', 
          )}
          style={{ 
            backgroundImage: "linear-gradient(110deg, rgb(6, 14, 75) 0%, rgb(7, 19, 89) 40%, rgba(7, 23, 105, 0.35) 70%, rgba(0, 0, 255, 0.8) 100%), url('/music/images/potrait_disco_woman.png')" 
          }}      
        >
            <TrackListContainer
                header='Trending right Now'
                tracks={ tracks }
            />
        </div>
    );

}

