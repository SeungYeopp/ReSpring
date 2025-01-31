"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/custom/TabGreen";

const books = [
  "/books/book1.jpg",
  "/books/book2.jpg",
  "/books/book3.jpg",
  "/books/book4.jpg",
  "/books/book5.jpg",
  "/books/book6.jpg",
  "/books/book7.jpg",
  "/books/book8.jpg",
  "/books/book9.jpg",
  "/books/book10.jpg",
];

export default function BookList() {
  const [booksPerShelf, setBooksPerShelf] = useState(4);
  const [bookWidth, setBookWidth] = useState(160);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateLayout = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let booksToShow;

        if (containerWidth < 500) {
          booksToShow = 2;
        } else if (containerWidth < 800) {
          booksToShow = 3;
        } else {
          booksToShow = 4;
        }
        setBooksPerShelf(booksToShow);
        const padding = 32;
        const newBookWidth = (containerWidth - padding) * 0.7 / booksToShow;
        setBookWidth(newBookWidth);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const shelves = [];
  for (let i = 0; i < books.length; i += booksPerShelf) {
    shelves.push(books.slice(i, i + booksPerShelf));
  }

  return (
    <div className="flex flex-col items-center w-full p-4">
      <Tabs defaultValue="books">
        <TabsList className="flex justify-center items-center mb-4 space-x-4">
          <TabsTrigger value="books">봄날의 서재</TabsTrigger>
          <TabsTrigger value="notes">나의 글조각</TabsTrigger>
        </TabsList>

        <TabsContent value="books">
          <div ref={containerRef} className="flex flex-col items-center w-full p-4">
            {shelves.map((shelf, index) => (
              <div key={index} className="flex flex-col items-center mb-6">
                <div className="flex justify-center gap-6 w-full">
                  {shelf.map((book, bookIndex) => (
                    <div key={bookIndex}>
                      <Image
                        src={book}
                        alt={`Book ${bookIndex}`}
                        width={bookWidth}
                        height={(bookWidth / 160) * 240}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>

                <Image src="/shelf.png" alt="Bookshelf" width={1909} height={152} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="p-4 text-center">
            <p>This is the content for the "Notes" tab.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}