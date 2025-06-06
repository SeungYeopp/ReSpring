// 이벤트 관련 API를 호출하는 함수의 모음.
import axiosAPI from "./axios";
import { Comment } from "./today";

// 봄날의 서 생성, 수정과 관련된 인터페이스.
export interface BookPostDto {
  userName: string;
  title: string;
  content: string;
  tags: string[];
  storyIds: number[];
}

export interface Content {
  [key: string]: string;
}

// 봄날의 서에 관한 인터페이스.
export interface Book {
  id: number;
  authorNickname: string;
  authorProfileImage: string;
  title: string;
  coverImage: string;
  tags: string[];
  likeCount: number;
  viewCount: number;
  likedUsers: string[];
  createdAt: Date;
  updatedAt: Date;
  liked: boolean;
}

export interface BookFull extends Book {
  content: Content;
  imageUrls: string[];
  comments: Comment[];
}

// AI로 생성된 봄날의 서에 대한 인터페이스.
export interface CompiledBook {
  title: string;
  chapters: Chapter[];
}

// AI로 생성된 봄날의 서의 각 챕터에 대한 인터페이스.
export interface Chapter {
  chapterTitle: string;
  content: string;
}

export const convertToContent = (compiledBook: CompiledBook): Content => {
  return compiledBook.chapters.reduce((acc, chapter) => {
    acc[chapter.chapterTitle] = chapter.content;
    return acc;
  }, {} as Content);
};

// 봄날의 서를 봄날의 서 ID로 검색
// 입력 : 봄날의 서 ID
// 출력 : 봄날의 서
export const getBookById = async (bookId: number): Promise<BookFull> => {
  try {
    const response = await axiosAPI.get(`/books/${bookId}`);

    // Date 형 변환.
    const bookdata: BookFull = {
      ...response.data,
      createdAt: new Date(response.data.createdAt),
      updatedAt: new Date(response.data.updatedAt),
      content: response.data.content as Content,
    };

    return bookdata;
  } catch (error: any) {
    console.error("getBookById 에러", error);
    throw new Error(error.response?.data?.message || "getBookById 에러");
  }
};

// 봄날의 서 내용 업데이트
// 입력 : 봄날의 서 ID, 제목, 내용, 태그들, 봄날의 서 내 스토리 Id들, 봄날의 서 커버 이미지
// 출력 : 봄날의 서가 성공적으로 업데이트 되었을 시 true, 그외 false
export const updateBook = async (
  bookId: number,
  title: string,
  content: Content,
  tags: string[],
  storyIds: number[],
  image: File
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append(
      "requestDto",
      new Blob([JSON.stringify({ bookId, title, content, tags, storyIds })], {
        type: "application/json",
      })
    );

    formData.append("표지 이미지", image);

    const response = await axiosAPI.put(`/books/${bookId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200 || response.status === 204) {
      return true;
    } else {
      console.error(`updateBook 에러 발생 봄날의 서 Id : ${bookId}`);
      return false;
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        `updateBook 에러 발생 봄날의 서 Id : ${bookId}`
    );
  }
};

// 봄날의 서 삭제
// 입력 : 봄날의 서 ID
// 출력 : 삭제 성공 시 true, 그외 false
export const deleteBook = async (bookId: number): Promise<boolean> => {
  try {
    const response = await axiosAPI.delete(`/books/${bookId}`);

    if (response.status === 200 || response.status === 204) {
      return true;
    } else {
      console.error(
        `deleteBook 에러 발생, 코드 : ${response.status}, bookId : ${bookId}`
      );
      return false;
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        `deleteBook 에러 발생, bookId : ${bookId}`
    );
  }
};

// 봄날의 서 생성 함수
// 입력 : 제목, 내용, 태그들, 커버 이미지
// 출력 : 봄날의 서 ID
export const makeBook = async (
  compiledBook: CompiledBook,
  tags: string[],
  storyIds: number[],
  coverImage: File
): Promise<number> => {
  try {
    const content = convertToContent(compiledBook);
    const title: string = compiledBook.title;
    const formData = new FormData();
    formData.append(
      "requestDto",
      new Blob([JSON.stringify({ title, content, tags, storyIds })], {
        type: "application/json",
      })
    );

    formData.append("coverImg", coverImage);
    const response = await axiosAPI.post("/books", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "makeBook 에러 발생!";

    alert(errorMessage);
    return Promise.reject(errorMessage);
  }
};

// 봄날의 서 좋아요 또는 좋아요 해제
// 입력 : 봄날의 서 ID
// 출력 : 좋아요는 Liked, 좋아요 해제는 Unliked 반환.
export const likeOrUnlikeBook = async (bookId: number): Promise<string> => {
  try {
    const response = await axiosAPI.patch(`/books/likes/${bookId}`, null);

    return response.data; // Liked 또는 Unliked가 string 형식으로 반환됨.
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        `likeOrUnlikeBook 에러 발생, bookID : ${bookId}`
    );
  }
};

// 봄날의 서 최근 일주일 간 top 3 반환.
// 입력 : X
// 출력 : 봄날의 서 배열
export const getTopThreeWeeklyBooks = async (): Promise<Book[]> => {
  try {
    const response = await axiosAPI.get("/books/weeklyTop3");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "getTopThreeWeeklyBooks 함수 API 호출에서 오류가 발생했습니다."
    );
  }
};

// 특정 유저에 대한 봄날의 서 전체
// 입력 : 유저 닉네임
// 출력 : 봄날의 서 배열
export const getAllBooksByUserNickname = async (
  nickname: string
): Promise<Book[]> => {
  try {
    const response = await axiosAPI.get(`/books/user/${nickname}`);

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "getAllBooksByUserNickname 함수 API 호출에서 오류가 발생했습니다."
    );
  }
};

// 제목으로 봄날의 서 검색
// 입력 : 제목
// 출력 : 봄날의 서 배열
export const searchBook = async (keyword: string): Promise<Book[]> => {
  try {
    const response = await axiosAPI.get(
      `/books/search?keyword=${encodeURIComponent(keyword)}`
    );

    const responseBooks: Book[] = response.data as Book[];

    return responseBooks;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "searchBook 함수 API 호출에서 오류가 발생했습니다."
    );
  }
};

// 내 봄날의 서 전체
// 입력 : X
// 출력 : 봄날의 서 배열
export const getMyBooks = async (): Promise<Book[]> => {
  try {
    const response = await axiosAPI.get("/books/my");

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "getMyBooks 함수 API 호출에서 오류가 발생했습니다."
    );
  }
};

// 사용자가 좋아요한 책 목록
// 입력 : X
// 출력 : 봄날의 서 배열
export const getLikedBooks = async (): Promise<Book[]> => {
  try {
    const response = await axiosAPI.get("/books/liked");

    const responseBooks: Book[] = response.data as Book[];

    return responseBooks;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "getLikedBooks 함수 API 호출에서 오류가 발생했습니다."
    );
  }
};

export interface BookAutoComplete {
  id: number;
  title: string;
}

// 봄날의 서 제목 자동완성
// 입력 : 검색어
// 출력 : 봄날의 서 배열
export const getAllBooksAutocomplete = async (
  query: string
): Promise<BookAutoComplete[]> => {
  if (query.length < 2) return [];

  try {
    const response = await axiosAPI.get(
      `/books/autocomplete/title?query=${encodeURIComponent(query)}`
    );

    const responseBooks: BookAutoComplete[] =
      response.data as BookAutoComplete[];

    return responseBooks;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "getAllBooksAutocomplete 함수 API 호출에서 오류가 발생했습니다."
    );
  }
};

// 봄날의 서 전체 조회 - 무한 스크롤
// 입력 : 마지막 좋아요수, 마지막 조회수, 마지막 서 ID, 마지막 생성일, 조회 크기
// 출력 : 봄날의 서 배열
export const getAllBooksScrolled = async (
  lastLikes: number,
  lastViews: number,
  lastBookId: number,
  lastCreatedAt: Date | null,
  size: number
): Promise<Book[]> => {
  try {
    const params: Record<string, any> = {
      lastLikes,
      lastViews,
      lastBookId,
      size,
    };

    // if (lastCreatedAt) {
    //     params.lastCreatedAt = lastCreatedAt.toISOString();
    // }

    const response = await axiosAPI.get(
      `/books/all?lastLikes=${lastLikes}&lastViews=${lastViews}&lastBookId=${lastBookId}&size=${size}`
    );

    const responseBooks: Book[] = response.data as Book[];

    return responseBooks;
  } catch (error: any) {
    throw new Error(error);
  }
};

// 데이터베이스 상 모든 봄날의 서
// 입력 : X
// 출력 : 봄날의 서 배열
export const getAllBooks = async (): Promise<Book[]> => {
  try {
    const response = await axiosAPI.get("/books/all/once");

    const responseBooks: Book[] = response.data as Book[];

    return responseBooks;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "getAllBooks 함수 API 호출에서 오류가 발생했습니다."
    );
  }
};

// 정렬 기준으로 정렬된 모든 봄날의 서
// 입력 : sortFields -> 봄날의 서 내 필드 종류(ex. title, likes, view) string 배열, directions -> 오름차순('asc') 또는 내림차순('desc') string 배열
// 추가 설명 ) sortFields를 각각 ['title', 'likes']로 하고 directions를 ['desc', 'asc']로 한다면 제목으로 먼저 내림차순, 그다음 좋아요 수로 오름차순하는 것.
// 출력 : 봄날의 서 배열
// export const getAllBooksSorted = async (sortFields:string[], directions:string[], userId : string) : Promise<Book[]> => {
//     try{
//         let url = '/books/all/sorted?';

//         for(let i = 0;i<sortFields.length;i++){
//             url += `sortFields=${sortFields[i]}&`
//         }

//         for(let i = 0;i<directions.length;i++){
//             url += `directions=${directions[i]}`

//             if(i !== directions.length-1)
//                 url += '&';
//         }

//         const response = await axiosAPI.get(url, {headers : {'X-User-Id': `${userId}`}});

//         const responseBooks : Book[] = response.data as Book[];

//         responseBooks.map((book : Book) => ({
//                 ...book,
//                 createdAt : new Date(book.createdAt),
//                 updatedAt : new Date(book.updatedAt)
//             }
//         ));

//         console.log(responseBooks)
//         return

// ChatGPT 기능을 사용할 수 없는 경우 테스트할 수 있는 Mock 함수.
// 입력 : 글 조각 모음 string
// 출력 : CompiledBook 형 데이터.
export const compileBookByAIMock = (content: string): CompiledBook => {
  const resData =
    '```json\n{\n  "title": "작가로서의 여정",\n  "chapters": [\n    {\n      "chapterTitle": "1장: 따뜻한 고향의 기억",\n      "content": "1980년 서울의 작은 동네에서 태어난 나는 사랑이 넘치는 평범한 가정에서 자랐다. 아버지는 회사원이셨고, 어머니는 전업주부로 나와 동생을 돌보셨다. 어린 시절의 기억은 항상 따뜻하고 행복했다. 동네 골목에서 친구들과 숨바꼭질을 하고, 뒷산에 올라가 나무를 타며 놀았던 기억은 여전히 생생하다. 특히 여름이면 동네 어르신들이 들려주시는 옛날이야기를 들으며 밤늦게까지 놀았던 것이 가장 즐거운 추억이다. 학교에 들어가기 전, 나는 이미 책 읽기를 좋아했고, 어머니께서 매일 밤 읽어주시던 동화책들이 나의 상상력을 키워주었다."\n    },\n    {\n      "chapterTitle": "2장: 문학의 시작",\n      "content": "중학교에 입학하면서 새로운 친구들과 선생님들을 만나며 세상을 바라보는 시각이 넓어졌다. 이 시기에 나는 문학에 대한 열정을 발견했고, 교내 문예대회에서 첫 상을 받았다. 고등학교 시절은 더욱 치열했다. 대학 입시를 준비하면서도 나의 꿈을 포기하지 않았다. 야간 자율학습이 끝난 후 틈틈이 소설을 쓰곤 했다. 졸업할 무렵, 내가 쓴 단편소설이 청소년 문학상을 수상하게 되었고, 이는 나에게 큰 자신감을 주었다. 부모님은 안정적인 직업을 원하셨지만, 나의 열정을 이해해 주셨다."\n    },\n    {\n      "chapterTitle": "3장: 대학에서의 자기 발견",\n      "content": "부모님의 지지 덕분에 나는 문예창작과에 진학할 수 있었다. 대학에 입학한 후, 나는 내 인생의 방향을 찾기 위해 많은 고민을 했다. 다양한 장르의 문학 작품을 접하고, 창작 기법을 배우며 나만의 스타일을 찾아갔다. 이 시기에 나는 처음으로 장편소설을 써보기로 결심했다. 1년이 넘는 시간 동안 밤낮으로 글을 쓰고, 수없이 고치고 또 고쳤다. 결과적으로 이 소설은 신인 문학상 후보에 오르게 되었다."\n    },\n    {\n      "chapterTitle": "4장: 프랑스에서의 성장",\n      "content": "대학 3학년 때, 나는 교환학생 프로그램을 통해 1년간 프랑스에서 공부할 기회를 얻었다. 이국적인 환경에서 새로운 문화와 사람들을 만나며, 나의 문학적 시야는 더욱 넓어졌다. 파리의 카페에서 글을 쓰며 보낸 시간들은 내 인생에서 가장 풍요로운 순간들이었다. 이 시기를 통해 나는 진정한 작가로서의 정체성을 찾게 되었다."\n    },\n    {\n      "chapterTitle": "5장: 새로운 도전과 성장",\n      "content": "40대에 접어들면서 나는 새로운 도전을 시작했다. 지금까지 현대 소설만 써왔다면, 이제는 역사 소설에 도전해보기로 했다. 1년간의 자료 조사와 준비 끝에 첫 역사 소설을 출간했고, 이는 예상 외로 큰 성공을 거두었다. 이 성공을 계기로 나는 다양한 장르의 글쓰기에 도전하게 되었다. 에세이, 여행기, 아동문학까지 시도해보며 작가로서 더욱 성장할 수 있었다. 또한 후배 작가들을 위한 멘토링 프로그램에 참여하기 시작했으며, 나 역시 많은 것을 배우고 성장할 수 있었다."\n    }\n  ]\n}\n```';

  // json, ``` 등 chatgpt가 생성한 불필요한 단어들 제거.
  const cleanedData = resData
    .replaceAll("json", "")
    .replaceAll("```", "")
    .replaceAll("\n", "")
    .replaceAll("  ", "");

  // JSON 형식으로 파싱.
  const jsonedData = JSON.parse(cleanedData);

  return jsonedData as CompiledBook; // JSON에서 CompiledBook 형으로 변환.
};

// 사용자가 작성한 모든 책 댓글 조회
// 입력 : X
// 출력 : 댓글 배열
export const getAllBooksComments = async (): Promise<Comment[]> => {
  try {
    const response = await axiosAPI.get("comments/books");

    const responseComments: Comment[] = response.data as Comment[];

    return responseComments;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "getAllBooksComments 함수 API 호출에서 오류가 발생했습니다."
    );
  }
};

// 책 댓글 생성.
export async function createNewBookComment(
  bookId: number,
  content: string,
  parentId?: number
): Promise<Comment> {
  try {
    const postDto =
      parentId !== undefined
        ? { content, bookId, parentId }
        : { content, bookId };

    const response = await axiosAPI.post(
      `/comments/books`,
      JSON.stringify(postDto),
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("댓글 생성 실패");
  }
}

// 책 댓글 삭제
export async function deleteBookComment(commentId: number): Promise<boolean> {
  try {
    const response = await axiosAPI.delete(`/comments/books/${commentId}`);

    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 204
    )
      return true;
    else return false;
  } catch (error: any) {
    throw new Error(error);
  }
}

// 책 내 모든 댓글 가져오기.
export async function getCommentsByBookId(bookId: number): Promise<Comment[]> {
  try {
    const response = await axiosAPI.get<Comment[]>(`/comments/books/${bookId}`);

    return response.data;
  } catch (error) {
    console.error("게시글에 달린 댓글들 가져오기 실패:", error);
    throw new Error("게시글에 달린 댓글들 가져오기 실패");
  }
}

// 봄날의 서 AI 기능
// 입력 : 글 조각 여러 개를 하나의 string으로 입력
// 출력 : CompiledBook 형식으로 된 데이터.
export const compileBookByAI = async (content: Content): Promise<Content> => {
  const maxAttempts = 3; // 최대 재시도 횟수

  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    try {
      const response = await axiosAPI.post("/books/ai-compile", { content });
      const uncleaned = response.data.response;

      //const cleaned = uncleaned.replaceAll("```json", "").replaceAll("```", "").replaceAll("json", "").replaceAll('`', "");
      const cleaned = uncleaned
        .replace(/```json|```/g, "")
        .replace(/\s{2,}/g, "");

      const jsoned = JSON.parse(cleaned); // JSON 변환

      return jsoned as Content; // 성공 시 반환
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        console.warn(
          `JSON 파싱 실패 (시도 ${
            attempts + 1
          }/${maxAttempts}), 다시 요청합니다...`
        );
      } else {
        console.error("API 요청 중 오류 발생:", error);
        throw new Error(
          error.response?.data?.message ||
            "compileBookByAI 함수 API 호출에서 오류가 발생했습니다."
        );
      }
    }
  }

  // 모든 시도가 실패한 경우
  throw new Error("JSON 파싱 실패로 인해 API 요청을 중단합니다.");
};
