import LinkCardItem from "../../_components/list-items/LinkCardItem";
import { fetchTopRadio } from "@/utils/fetchers";

export default async function TopRadio() {
    const radioList = await fetchTopRadio();
    return (
        <div className='flex flex-col gap-4 h-screen overflow-y-auto'>
            <h2 className="text-2xl text-white font-bold mb-4 ml-4">Top Radios</h2>
            <ul className="grid grid-cols-3 gap-8">
                {
                    radioList.map(radio =>
                        <LinkCardItem
                            key={ radio.id }
                            href={ `/myspace/apps/music/home/radio/${ radio.id }` }
                            imgSrc={ radio.picture_medium }
                            title={ radio.title }
                        />
                    )
                }
            </ul>
        </div>
    );
};
