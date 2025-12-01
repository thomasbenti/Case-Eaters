const API_URL = 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getHeaders = (isAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (isAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export const authAPI = {
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
      }
      
      return data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get profile');
      }
      
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  isLoggedIn: () => {
    return !!getAuthToken();
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const postAPI = {
  getAllPosts: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `${API_URL}/posts?${queryParams}` : `${API_URL}/posts`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch posts');
      }
      
      return data;
    } catch (error) {
      console.error('Get all posts error:', error);
      throw error;
    }
  },

  getPostById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch post');
      }
      
      return data;
    } catch (error) {
      console.error('Get post by ID error:', error);
      throw error;
    }
  },

  createPost: async (postData) => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(postData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }
      
      return data;
    } catch (error) {
      console.error('Create post error:', error);
      throw error;
    }
  },

  updatePost: async (id, postData) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(postData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update post');
      }
      
      return data;
    } catch (error) {
      console.error('Update post error:', error);
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete post');
      }
      
      return data;
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    }
  },

  flagPost: async (id) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}/flag`, {
        method: 'PUT',
        headers: getHeaders(true),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to flag post');
      }
      
      return data;
    } catch (error) {
      console.error('Flag post error:', error);
      throw error;
    }
  },

  expirePost: async (id) => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}/expire`, {
        method: 'PUT',
        headers: getHeaders(true),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to expire post');
      }
      
      return data;
    } catch (error) {
      console.error('Expire post error:', error);
      throw error;
    }
  },

  getPostsByUser: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/posts/user/${userId}`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user posts');
      }
      
      return data;
    } catch (error) {
      console.error('Get posts by user error:', error);
      throw error;
    }
  },
};

export const userAPI = {
  updateProfile: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      const currentUser = authAPI.getCurrentUser();
      if (currentUser) {
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...data }));
      }
      
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  deleteAccount: async () => {
    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }
      
      authAPI.logout();
      
      return data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user');
      }
      
      return data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }
      
      return data;
    } catch (error) {
      console.error('Get all users error:', error);
      throw error;
    }
  },
};