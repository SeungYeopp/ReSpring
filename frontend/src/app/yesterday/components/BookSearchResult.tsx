"use client"

import React from "react";

import {SearchBar} from "@/components/custom/SearchBar"
import {bookData, iBook} from "@/mocks/book/book-mockdata"
import {SearchBookCard} from "@/app/yesterday/components/SearchBookCard"
import Image from "next/image"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/app/yesterday/components/ui/BookCarouselCard"

interface BookSearchResultProps{
    query : string
}

export const BookSearchResult = (props : BookSearchResultProps) => {
  return (
      <div className="flex flex-col items-center">
        <h2>{`검색 결과 : ${props.query}`}</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 items-center gap-5">
          {
              // profileData 내의 모든 데이터를 SearchProfileCard 형식으로 출력.
              bookData.map(({title, content, cover_img, tag, like, view, created_at, updated_at} : iBook) => {
                  return (
                      <div key={title}>
                          <Card className="flex flex-row h-full w-full border-brand-light border-2">
                                <div className="basis-3/7 flex justify-center items-center p-2">
                                    <Image src={cover_img} alt={`${title}_img`} width={100} height={160}/>
                                </div>
                                <CardContent className="basis-4/7 flex flex-col justify-center space-y-2">
                                    <CardTitle className="text-lg font-bold ">{title}</CardTitle>
                                    {/* 봄날의 서 설명을 최대 60자로 제한한다.*/}
                                    <CardDescription>{content.length > 60? content.slice(0, 60) + "...": content}</CardDescription>
                                    <p className="text-xs font-medium text-gray-500">저자: 김싸피</p>
                                </CardContent>
                            </Card>
                      </div>
                  )
              })
          }
          </div>
      </div>
  );
}
