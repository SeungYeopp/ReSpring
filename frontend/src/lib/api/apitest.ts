// src/lib/api/apitest.ts

export const postLogin = async (email: string, password: string) => {
    console.log(password);
    return email;

    // const response = await fetch('https://your-backend-api.com/login', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ email, password }),
    // });
  
    // if (!response.ok) {
    //   throw new Error('Login failed');
    // }
  
    // const data = await response.json();
    // return data;
  };
  