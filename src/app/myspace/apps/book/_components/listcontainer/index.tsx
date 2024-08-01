"use client";
import { useRef, useState, useEffect } from 'react';
import ButtonNext from '../buttonpagination/ButtonNext';
import ButtonPrev from '../buttonpagination/ButtonPrev';
import BookContainer from '../bookcontainer';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import BookResult from '../bookresult';
import Utils from '@/utils/bookUtils';
import { nextBookLists, prevBookLists } from '@/redux/features/apps/book/booksSlice';
import { selectCurrentBook, selectTotalBook } from '@/redux/features/apps/book/booksSlice';

const ListContainer = ({ categoryId, title }) => {
    const dispatch = useAppDispatch();
    const currentIndex = useAppSelector(selectCurrentBook);
    const totalIndex = useAppSelector(selectTotalBook);

    return (
        <section id={categoryId} className="relative flex flex-col flex-grow">
            <div className="flex items-center justify-between p-8 w-full">
                <h1 className="text-2xl font-bold">{title}</h1>
                <div>
                    <ButtonPrev categoryId={categoryId} currentIndex={currentIndex} totalIndex={totalIndex} onClick={() => dispatch(prevBookLists())} />
                    <ButtonNext categoryId={categoryId} currentIndex={currentIndex} totalIndex={totalIndex} onClick={() => dispatch(nextBookLists())} />
                </div>
            </div>
            <div className="flex px-4 py-2 overflow-x-auto">
                <BookContainer subject={categoryId} />
            </div>
            <div className="absolute top-0 bottom-0 block left-0 w-8 bg-gradient-to-r from-white to-transparent"></div>
            <div className="absolute top-0 bottom-0 block right-0 w-8 bg-gradient-to-l from-white to-transparent"></div>
        </section>
    );
};

export default ListContainer;





