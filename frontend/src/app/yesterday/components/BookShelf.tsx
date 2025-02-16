'use client';

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getAllBooksByUserId, Book } from "@/lib/api/book";

interface BookShelfProps {
  userId: string;
}

const BookShelf: React.FC<BookShelfProps> = ({ userId: userNickname }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [booksPerShelf, setBooksPerShelf] = useState(4);
  const [bookWidth, setBookWidth] = useState(160);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const fetchedBooks = await getAllBooksByUserId(userNickname);
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
  }, [userNickname]);

  useEffect(() => {
    const updateLayout = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let booksToShow = containerWidth < 500 ? 2 : containerWidth < 800 ? 3 : 4;
        setBooksPerShelf(booksToShow);
        const padding = 32;
        setBookWidth(((containerWidth - padding) * 0.7) / booksToShow);
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="flex justify-center gap-6 w-full"
          >
            {shelf.map((book) => (
              <motion.div
                key={book.id}
                className="group relative rounded-lg overflow-hidden shadow-lg"
                style={{
                  width: `${bookWidth}px`,
                  height: `${(bookWidth / 160) * 240}px`,
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden]">
                    <img
                      src={book.coverImage || "/placeholder_bookcover.jpg"}
                      alt={`Book ${book.title}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white text-sm p-4 [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-lg">
                    <p className="text-lg font-semibold">{book.title}</p>
                    <p className="text-xs opacity-80">{new Date(book.createdAt).toLocaleDateString()}</p>
                    <div className="mt-3 flex space-x-3">
                      <a
                        href={`/viewer/${book.id}`}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md flex items-center gap-1 text-xs hover:bg-blue-600"
                      >
                        읽기
                      </a>
                      <a
                        href="#"
                        className="px-3 py-1 bg-green-500 text-white rounded-md flex items-center gap-1 text-xs hover:bg-green-600"
                      >
                        편집
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <img src="/shelf.png" alt="Bookshelf" width={1909} height={152} />
        </div>
      ))}
    </div>
  );
};

export default BookShelf;
