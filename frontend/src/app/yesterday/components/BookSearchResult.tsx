"use client"

import React from "react";

import {SearchBar} from "@/components/custom/SearchBar"
import {bookData, iBook} from "@/mocks/book/book-mockdata"
import {SearchBookCard} from "@/app/yesterday/components/SearchBookCard"

interface BookSearchResultProps{
    query : string
}

export const BookSearchResult = (props : BookSearchResultProps) => {
  return (
    
      <div className="grid grid-cols-2 md:grid-cols-5 items-center gap-5">
        <h2>{`검색 결과 : ${props.query}`}</h2>
          {
              // profileData 내의 모든 데이터를 SearchProfileCard 형식으로 출력.
              bookData.map(({title, content, cover_img, tag, like, view, created_at, updated_at} : iBook) => {
                  return (
                      <div key={title}>
                          <SearchBookCard title={title} content={content} cover_img = {cover_img} tag = {tag} like = {like} view = {view} created_at = {created_at} updated_at = {updated_at}/>
                      </div>
                  )
              })
          }
      </div>
  );
}
