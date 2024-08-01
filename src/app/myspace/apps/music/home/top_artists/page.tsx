import TopArtistsContainer from "../../_components/others/TopArtistsContainer";

export default async function TopArtists() {
    return (
        <TopArtistsContainer limit={ 25 } />
    );
}