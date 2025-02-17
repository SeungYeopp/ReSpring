"use client"

import BottomSection from "./BottomSection"
import TopSection from "./TopSection"
import {BookFull, getBookById} from "@/lib/api"
import { useEffect, useState } from "react"

export default function TopBottomSection({ bookId }: { bookId: number }) {
    const [bookData, setBookData] = useState<BookFull | undefined>();

    useEffect(() => {
        //console.log("📌 useEffect 실행됨 - bookId:", bookId);
        const fetchBook = async () => {
        //console.log("📌 getBookById 호출 - bookId:", bookId);
        try {
            const bookData = await getBookById(Number(bookId)); // API 호출
            setBookData(bookData);

            // const myInfo = await getUserInfo();
            // if (myInfo.userNickname === bookData.authorNickname) setIsMyBook(true);
        } catch (error) {
            console.error("책 데이터를 불러오는 중 오류 발생, 목데이터로 대체:", error);
            // setBook(mockBookData);
        }
        };

        fetchBook();
    }, [bookId]);
    return (
        <div>
            {bookData ? (
                    <>
                        <TopSection book={bookData}/>
                        <BottomSection book={bookData}/>
                    </>
                ) : (<div>LOADING...</div>)
            }
        </div>
    )
}