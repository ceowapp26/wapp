"use client";
import ListContainer from '../listcontainer';
import ForYouSection from '../foryousection';
import CategoryModal from '../categorymodal';
import SearchView from '../searchbar/SearchView';
import BookSidebar from '../booksidebar';
import { useMyspaceContext } from '@/context/myspace-context-provider';

const SectionContainer = () => {
      const { leftSidebarWidth, isAppbarCollapsed } = useMyspaceContext();

    return (
        <div className={`relative block h-full overflow-y-auto ${isAppbarCollapsed ? 'top-28' : 'top-56'}`}>
            <article style={{ marginLeft: `${leftSidebarWidth}px`, width: `calc(100% - ${leftSidebarWidth}px)` }}>
                <SearchView />
                <ForYouSection />
                <ListContainer categoryId={"fiction"} title={"Fiction"} />
                <ListContainer categoryId={"poetry"} title={"Poetry"} />
                <ListContainer categoryId={"fantasy"} title={"Fantasy"} />
                <ListContainer categoryId={"romance"} title={"Romance"} />
                <CategoryModal />
            </article>
        </div>
    );
};

export default SectionContainer;


