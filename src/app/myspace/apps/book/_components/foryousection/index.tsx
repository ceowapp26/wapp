import React from 'react';
import ListContainer from '../listcontainer';
import Shortcut from '../shortcut';

const ForYouSection = () => {
    return (
        <div id="foryou">
          <Shortcut />
          <ListContainer categoryId={"love"} title={"Daily Top 100"} />
          <ListContainer categoryId={"feminism"} title={"New releases"} />
          <ListContainer categoryId={"inspirational"} title={"Bestsellers"} />
          <ListContainer categoryId={"authors"} title={"Top authors"} />
        </div>
    );
};

export default ForYouSection;

