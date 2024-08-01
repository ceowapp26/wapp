"use client";
import React from 'react';
import CategorySearch from '../categorysearch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useBooks } from '@/hooks/use-books';

const CategoryModal = () => {
  const books = useBooks();

  const categories = [
    'Adult', 'Anthologies', 'Art', 'Audiobooks', 'Biographies', 'Body', 'Business',
    'Children', 'Comics', 'Contemporary', 'Cooking', 'Crime', 'Engineering',
    'Entertainment', 'Fantasy', 'Fiction', 'Food', 'General', 'Health', 'History',
    'Horror', 'Investing', 'Literary', 'Literature', 'Manga', 'Media-help',
    'Memoirs', 'Mind', 'Mystery', 'Nonfiction', 'Religion', 'Romance', 'Science',
    'Self', 'Spirituality', 'Sports', 'Superheroes', 'Technology', 'Thrillers',
    'Travel', 'Women', 'Young'
  ];

  const closeModal = () => {
    books.onClose();
  };

  return (
    <Dialog open={books.isOpen} onOpenChange={books.onClose}>
      <DialogContent>
        <DialogTitle className="text-mauve12 m-0 text-[17px] font-medium">
        Book Category
        </DialogTitle>
        <DialogDescription className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
        Choose book category you would like to read.
        </DialogDescription>
        <div className="flex flex-col overflow-y-auto p-10 mt-6 w-full bg-bg-color rounded-lg shadow-md justify-center text-black max-h-[50vh] items-center">
          {categories.map((category, index) => (
            <CategorySearch key={index} onClick={closeModal} category={category} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
