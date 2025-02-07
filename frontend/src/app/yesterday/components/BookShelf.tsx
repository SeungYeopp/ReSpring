'use client';

import { useState, useEffect, useRef } from "react";
import { getMyBooks } from "@/lib/api/book";

interface Book {
  id: string;
  title: string;
  createdAt: string | Date;
  coverImg: string;
}

interface BookShelfProps {
  userId: string;
}

const BookShelf: React.FC<BookShelfProps> = ({ userId }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [booksPerShelf, setBooksPerShelf] = useState(4);
  const [bookWidth, setBookWidth] = useState(160);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const fetchedBooks = await getMyBooks(userId);
        const formattedBooks = fetchedBooks.map((book: any) => ({
          ...book,
          createdAt: book.createdAt instanceof Date ? book.createdAt.toISOString() : book.createdAt,
        }));
        setBooks(formattedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [userId]);

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
        const newBookWidth = ((containerWidth - padding) * 0.7) / booksToShow;
        setBookWidth(newBookWidth);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [books]);

  const shelves = [];
  for (let i = 0; i < books.length; i += booksPerShelf) {
    shelves.push(books.slice(i, i + booksPerShelf));
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full p-4">
      {shelves.map((shelf, index) => (
        <div key={index} className="flex flex-col items-center mb-6">
          <div className="flex justify-center gap-6 w-full">
            {shelf.map((book) => (
              <div
                key={book.id}
                className="group relative"
                style={{
                  width: `${bookWidth}px`,
                  height: `${(bookWidth / 160) * 240}px`,
                }}
              >
                <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                    <img
                      src={book.coverImg || "/placeholder_bookcover.jpg"}
                      alt={`Book ${book.title}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white text-sm p-2 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <p>제목: {book.title}</p>
                    <p>작성일: {new Date(book.createdAt).toLocaleDateString()}</p>
                    <div className="mt-2 flex space-x-2">
                      <a
                        href={`/viewer/${book.id}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600"
                      >
                        읽기
                      </a>
                      <a
                        href="#"
                        className="px-3 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600"
                      >
                        편집
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <img src="/shelf.png" alt="Bookshelf" width={1909} height={152} />
        </div>
      ))}
    </div>
  );
};

export default BookShelf;