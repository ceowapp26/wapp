import React from "react";
import styled from "styled-components";
import { useMyspaceContext } from '@/context/myspace-context-provider';
import Image from 'next/image';


const Container = styled.div`
  width: 10rem;

  @media (min-width: 640px) {
    width: 16rem; 
  }

  @media (min-width: 1024px) {
    width: 60rem; 
  }
`;

const NowPlayingImage = () => {
  const { currentSong } = useMyspaceContext();

  return (
    <Container>
      <div className="art absolute top-4">
       <Image
          src={'/music/images/1624_picasso_wired.webp'}
          width={240}
          height={240}
          alt="album art"
          priority
        />
      </div>
    </Container>
  );
};

export default NowPlayingImage;


