import { fetchTopTracks } from '../utils/fetchers';

let topTrackData = null;

const fetchData = async () => {
  try {
    topTrackData = await fetchTopTracks({ limit: 10 });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const initializeData = async () => {
  await fetchData();
};

initializeData();

export { topTrackData };
