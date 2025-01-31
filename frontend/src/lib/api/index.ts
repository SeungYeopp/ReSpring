// index.ts
// auth.ts, onboarding.ts, post.ts에서 export한 모든 함수/객체를 그대로 다시 내보낸다.

export * from "./apitest";

// auth.ts에서 export한 모든 것
//export * from './auth';

// onboarding.ts에서 export한 모든 것
//export * from './onboarding';

// post.ts에서 export한 모든 것
//export * from './post';

// '오늘' 페이지 관련 API 내보내기
export * from "./today";

// '이벤트' 관련 API 내보내기
export * from "./event";

// '내일' 페이지 관련 API 내보내기
export * from "./tomorrow";

// 스토리 관련 API 내보내기
export * from "./story";
