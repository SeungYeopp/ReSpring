import axiosAPI from "./axios";
import { Book } from "./book";

/**
 * 구독자 정보 인터페이스
 */
export interface Subscriber {
  id: string;
  userNickname: string;
  email: string;
  profileImage: string;
  createdAt: Date;
}

/**
 * 게시글 및 댓글 활동 인터페이스
 */
export interface Post {
  postId: number;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  images: Image[];
  commentCount: number;
  comments: Comment[];
  authorId: string;
  authorNickname: string;
  authorImage: string;
}

/**
 * 이미지 인터페이스
 */
export interface Image {
  imageId: number;
  imageUrl: string;
}

/**
 * 댓글 인터페이스
 */
export interface Comment {
  id: number;
  content: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: number;
}

/**
 * 챌린지 정보 인터페이스
 */
export interface Challenge {
  challengeId: number;
  title: string;
  description: string;
  image: string;
  registerDate: Date;
  likes: number;
  views: number;
  participantCount: number;
  ownerId: string;
  ownerName: string;
}
/**
 * 특정 사용자를 구독하는 함수
 * @param subscribedToNickname - 구독할 사용자의 닉네임
 * @param subscribedToNickname - 구독할 사용자의 닉네임
 * @returns Promise<boolean> - 구독 성공 여부 반환
 */
export const newSubscription = async (subscribedToNickname: string) : Promise<boolean> => {
  try {
    const response = await axiosAPI.post(`/subscriptions/${subscribedToNickname}`);

    if (response.status === 200) {
      return true;
    } else {
      console.log(`newSubscription에서 status : 200 이 아닌 다른 상태를 반환했습니다. subscribedToNickname : ${subscribedToNickname}`);
      return false;
    }
  } catch (error) {
    console.error("newSubscription 에러 발생", error);
    throw new Error("newSubscription 에러 발생");
  }
};

/**
 * 특정 사용자를 구독 취소하는 함수
 * @param subscribedToNickname - 구독 취소할 사용자의 닉네임
 * @returns Promise<boolean> - 취소 성공 여부 반환
 */
export const cancelSubscription = async (subscribedToNickname: string) : Promise<boolean> => {
  try {
    const response = await axiosAPI.delete(`/subscriptions/${subscribedToNickname}`);

    if (response.status === 200) {
      return true;
    } else {
      console.log(`cancelSubscription에서 status : 200 이 아닌 다른 상태를 반환했습니다. subscribedToNickname : ${subscribedToNickname}`);
      return false;
    }
  } catch (error) {
    console.error("cancelSubscription 에러 발생", error);
    throw new Error("cancelSubscription 에러 발생");
  }
};

/**
 * 다른 사용자를 구독하고 있는지 확인하는 함수
 * @param subscribedToNickname - 구독 대상 사용자 닉네임
 * @returns Promise<boolean> - 구독 여부 반환
 */
export const isSubscribed = async (subscribedToNickname: string): Promise<boolean> => {
  try {
    const response = await axiosAPI.get(`/subscriptions/${subscribedToNickname}/check`);
    return response.data;
  } catch (error) {
    console.error(`isSubscribed 에러 발생, 발생한 subscribedToNickname: ${subscribedToNickname}`, error);
    throw new Error("isSubscribed 에러 발생");
  }
};

/**
 * 모든 구독자를 가져오는 함수
 * @returns Promise<Subscriber[]> - 사용자의 모든 구독자 목록 반환
 */
export const getAllSubscribers = async (): Promise<Subscriber[]> => {
  try {
    const response = await axiosAPI.get(`/subscriptions/me/users`);

    return response.data.map((subscriber: Subscriber) => ({
      ...subscriber,
      createdAt: new Date(subscriber.createdAt),
    }));
  } catch (error) {
    console.error(`getAllSubscribers 에러 발생`, error);
    throw new Error('getAllSubscribers 에러 발생');
  }
};

/**
 * 모든 구독자의 게시글 및 댓글을 가져오는 함수
 * @returns Promise<Post[]> - 사용자의 모든 구독자의 게시글 및 댓글 목록 반환
 */
export const getAllSubscribersActivities = async (): Promise<Post[]> => {
  try {
    const response = await axiosAPI.get(`/subscriptions/me/posts`);

    return response.data.map((post: Post) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
      comments: post.comments.map((comment) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt),
      })),
    }));
  } catch (error) {
    console.error(`getAllSubscribersActivities 에러 발생`, error);
    throw new Error("getAllSubscribersActivities 에러 발생");
  }
};

/**
 * 모든 구독자의 챌린지를 가져오는 함수
 * @returns Promise<Challenge[]> - 사용자의 구독자의 챌린지 목록 반환
 */
export const getAllSubscribersChallenges = async (): Promise<Challenge[]> => {
  try {
    const response = await axiosAPI.get(`/subscriptions/me/challenges`);

    return response.data.map((challenge: Challenge) => ({
      ...challenge,
      registerDate: new Date(challenge.registerDate),
    }));
  } catch (error) {
    console.error(`getAllSubscribersChallenges 에러 발생`, error);
    throw new Error("getAllSubscribersChallenges 에러 발생");
  }
};

/**
 * 모든 구독자의 봄날의 서서를 가져오는 함수
 * @returns Promise<Book[]> - 사용자의 구독자의 챌린지 목록 반환
 */
export const getAllSubscribersBooks = async (): Promise<Book[]> => {
  try {
    const response = await axiosAPI.get(`/subscriptions/me/books`);

    const books: Book[] = response.data.map((book: Book) => ({
      ...book,
      createdAt: new Date(book.createdAt),
      updatedAt: new Date(book.updatedAt),
    }));

    return books;
  } catch (error) {
    console.error(`getAllSubscribersBooks 에러 발생`, error);
    throw new Error("getAllSubscribersBooks 에러 발생");
  }
};
