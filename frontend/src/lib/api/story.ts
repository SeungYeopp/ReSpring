// 글조각 관련 API를 호출하는 함수 모음
import axiosAPI from "./axios";

export interface Image {
    imageId: number;
    imageUrl: string;
}

/**
 * 스토리(글조각) 정보 인터페이스
 */
export interface Story {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    eventId: number;
    occurredAt : Date;
    images: string[];
}

/**
 * 스토리 생성 요청 데이터 인터페이스
 */
export interface StoryDto {
    userId: string;
    title: string;
    content: string;
    eventId: number;
}

/**
 * 특정 사용자의 모든 스토리를 가져오는 함수
 * @returns Promise<Story[]> - 사용자의 모든 스토리 목록 반환
 */
export const getAllStories = async (): Promise<Story[]> => {
    try {
        const response = await axiosAPI.get('/stories');

        return response.data;
    } catch (error) {
        throw new Error('getAllStories 에러 발생');
    }
};

/**
 * 새로운 스토리를 생성하는 함수
 * @param userId - 작성자 ID
 * @param title - 스토리 제목
 * @param content - 스토리 내용
 * @param eventId - 관련 이벤트 ID
 * @param images - 업로드할 이미지 목록
 * @returns Promise<number> - 생성된 스토리의 ID 반환
 */
export const makeStory = async (
    userId: string,
    title: string,
    content: string,
    eventId: number,
    images: File[]
): Promise<number> => {
    try {
        const formData = new FormData();
        formData.append('storyDto', new Blob([
            JSON.stringify({ userId, title, content, eventId })
        ], { type: 'application/json' }));

        images.forEach((image) => {
            formData.append('images', image);
        });

        const response = await axiosAPI.post('/stories', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return response.data; // 생성된 스토리의 ID 반환
    } catch (error) {
        console.error('makeStory 에러 발생', error);
        throw new Error('makeStory 에러 발생');
    }
};

/**
 * 특정 ID의 스토리를 조회하는 함수
 * @param storyId - 조회할 스토리의 ID
 * @returns Promise<Story> - 조회된 스토리 객체 반환
 */
export const getStoryById = async (storyId: number, userId: string): Promise<Story> => {
    try {
        const response = await axiosAPI.get(`/stories/${storyId}`,
            {
                headers: {
                    "X-User-Id": userId,
                    "Accept": "*/*" // 서버로부터 아무 타입의 반환값을 받겠다는 것을 의미한데요.
                }
            }
        );

        return {
            ...response.data,
            createdAt: new Date(response.data.createdAt),
            updatedAt: new Date(response.data.updatedAt),
            occurredAt : new Date(response.data.occurredAt)
        };
    } catch (error) {
        console.error('getStoryByStoryId 에러 발생!', error);
        throw new Error('getStoryByStoryId 에러 발생!');
    }
};

/**
 * 특정 ID의 스토리를 삭제하는 함수
 * @param storyId - 삭제할 스토리의 ID
 * @param userId - 작성자 ID
 * @returns Promise<boolean> - 삭제 성공 여부 반환
 */
export const deleteStory = async (storyId: number, userId: string): Promise<boolean> => {
    try {
        const response = await axiosAPI.delete(`/stories/${storyId}`,
            {
                headers: {
                    "X-User-Id": userId,
                    "Accept": "*/*" // 서버로부터 아무 타입의 반환값을 받겠다는 것을 의미한데요.
                }
            }
        )

        if (response.status === 200) {
            return true;
        } else {
            console.log(`deleteStory에서 status : 200 이 아닌 다른 상태를 반환했습니다. storyID : ${storyId}`);
            return false;
        }
    } catch (error) {
        console.error('deleteStory 에러 발생', error);
        throw new Error('deleteStory 에러 발생');
    }
};

/**
 * 기존 스토리를 업데이트하는 함수
 * @param storyId - 수정할 스토리의 ID
 * @param userId - 작성자 ID
 * @param title - 수정할 제목
 * @param content - 수정할 내용
 * @param eventId - 관련 이벤트 ID
 * @param deleteImageIds
 * @param images - 업데이트할 이미지 목록
 * @returns Promise<Story> - 업데이트된 스토리 객체 반환
 */
export const updateStory = async (
    storyId: number,
    userId: string,
    title: string,
    content: string,
    eventId: number,
    deleteImageIds: number[],
    images: File[]
): Promise<Story> => {
    try {
        const formData = new FormData();

        const storyDto = JSON.stringify({ userId, title, content, eventId, deleteImageIds });
        formData.append('storyDto', new Blob([storyDto], { type: 'application/json' }));

        images.forEach((image) => {
            formData.append('images', image);
        });

        const response = await axiosAPI.patch(`/stories/${storyId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return response.data;
    } catch (error) {
        console.error(`updateStory 에러 발생! storyId : ${storyId}`, error);
        throw new Error(`updateStory 에러 발생! storyId : ${storyId}`);
    }
};
