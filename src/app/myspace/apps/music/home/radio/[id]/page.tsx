import IntroContainer from '../../../_components/others/IntroContainer';
import TrackListContainer from '../../../_components/others/TrackListContainer';
import { fetchRadio } from '@/utils/fetchers';

export default async function RadioTrackList({ params }) {
    const { type, tracks, title, picture_medium } = await fetchRadio(params.id);

    return (
        <div className='radio-container page-container'>
            <IntroContainer
                id={ params.id }
                type={ type }
                imgSrc={ picture_medium }
                title={ title }
                playlist={ tracks }
                description='Radio'
            />

            <TrackListContainer tracks={ tracks } />
        </div>
    );
};
