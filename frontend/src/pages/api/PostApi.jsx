const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;
// Creating template for sending api request

export const addPost = async(data)=>{
    const response = await fetch(`${API_BASE_URL}/api/post/addpost`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return response;
};

export const getPost = async()=>{
    const response = await fetch(`${API_BASE_URL}/api/homepage`, { 
        method: 'Get',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      return response;
}
