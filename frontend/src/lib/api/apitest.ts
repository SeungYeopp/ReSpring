import axios from 'axios';

export const postLogin = async (title: string, body: string, requestType: 'GET' | 'POST') => {
  try {
    if (requestType === 'GET') {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      return response.data;
    } else if (requestType === 'POST') {
      // POST 요청 시 title과 body를 보내는 방식
      const response = await axios.post('https://jsonplaceholder.typicode.com/posts', {
        title,
        body,
      });
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data || error.message);
    } else {
      console.error('Unknown Error:', error);
    }
    throw new Error('Request failed');
  }
};
