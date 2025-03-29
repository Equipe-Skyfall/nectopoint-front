import React, { useEffect } from 'react';

import axios from 'axios';
import { useAuthContext } from '../../Provider/AuthProvider';

// Use the same API client configuration
const api = axios.create({
  baseURL: '/usuario', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

const UserListTest = () => {
  const { user, isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUsers = async () => {
        try {
          // Use the /usuario endpoint instead of /usuarios
          const response = await api.get('/');
          const asdasd = await api.get('/sessao/usuario/me')
          console.log(asdasd);
          
          console.log('Users data:', response.data);
        } catch (error) {
          console.error('Error fetching users:', error);
          // Log more detailed error information
          if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
          }
        }
      };

      fetchUsers();
    }
  }, [isAuthenticated]);

  return (
    <div>
      <h2>User List Test</h2>
      {isAuthenticated ? (
        <div>
          <p>Authenticated as: {user?.nome}</p>
          <p>CPF: {user?.cpf}</p>
          <p>Role: {user?.cargo}</p>
          <p>Department: {user?.departamento}</p>
          <button onClick={() => api.get('/usuario').then(res => console.log(res.data))}>
            Fetch Users (Manual)
          </button>
          
        </div>
      ) : (
        <p>Not authenticated. Please log in first.</p>
      )}
      <p>Check browser console for users data.</p>
    </div>
  );
};

export default UserListTest;