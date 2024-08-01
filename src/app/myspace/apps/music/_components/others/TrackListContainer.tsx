import React from 'react';
import TrackListItem from '../list-items/TrackListItem';

const TrackListContainer = ({ header, tracks }) => {
    return (
        <div className='flex flex-col h-full min-h-[50vh] p-6 overflow-hidden'>
            {!!header && <h2 className="text-xl text-white font-bold mb-4">{header}</h2>}

            <ul className="h-full overflow-x-auto">
                {
                    tracks.map((track, index) =>
                        <TrackListItem
                            key={track.id}
                            index={index}
                            playlist={tracks}
                            track={track}
                        />
                    )
                }
            </ul>
        </div>
    );
};

export default TrackListContainer;


