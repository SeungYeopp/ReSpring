// page.tsx

"use client"

import React from "react";

import {SearchBar} from "@/components/custom/SearchBar"
import {bookData, iBook} from "@/mocks/book/book-mockdata"
import {SearchBookCard} from "@/app/yesterday/components/SearchBookCard"

export default function HomePage() {
  return (
    <div>
      <SearchBar defaultValue={""} placeholder="봄날의 서, 작가 검색.."></SearchBar>
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5">
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
    </div>
  );
}
