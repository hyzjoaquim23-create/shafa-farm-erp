import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import { authAPI } from '../api';
import { storageService } from '../services/storageService';

export const AuthContext = createContext();

const initialState = {
  isLoading: true,
  isSignout: false,
  user: null,
  token: null,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        isLoading: false,
        token: action.payload.token,
        user: action.payload.user,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isSignout: false,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        isSignout: true,
        token: null,
        user: null,
        error: null,
      };
    case 'SIGN_UP':
      return {
        ...state,
        isSignout: false,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore token on app startup
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await storageService.getToken();
        const user = await storageService.getUser();

        if (token && user) {
          dispatch({
            type: 'RESTORE_TOKEN',
            payload: { token, user },
          });
        } else {
          dispatch({
            type: 'RESTORE_TOKEN',
            payload: { token: null, user: null },
          });
        }
      } catch (e) {
        console.error('Error restoring token:', e);
        dispatch({
          type: 'RESTORE_TOKEN',
          payload: { token: null, user: null },
        });
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    state,
    signIn: useCallback(async (email, password) => {
      try {
        const response = await authAPI.login(email, password);
        const { token, user } = response.data;

        await storageService.setToken(token);
        await storageService.setUser(user);

        dispatch({
          type: 'SIGN_IN',
          payload: { token, user },
        });

        return { success: true };
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Login failed';
        dispatch({
          type: 'SET_ERROR',
          payload: errorMessage,
        });
        return { success: false, error: errorMessage };
      }
    }, []),

    signUp: useCallback(async (userData) => {
      try {
        const response = await authAPI.signup(userData);
        const { token, user } = response.data;

        await storageService.setToken(token);
        await storageService.setUser(user);

        dispatch({
          type: 'SIGN_UP',
          payload: { token, user },
        });

        return { success: true };
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Signup failed';
        dispatch({
          type: 'SET_ERROR',
          payload: errorMessage,
        });
        return { success: false, error: errorMessage };
      }
    }, []),

    signOut: useCallback(async () => {
      try {
        await authAPI.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        await storageService.removeToken();
        await storageService.removeUser();
        dispatch({ type: 'SIGN_OUT' });
      }
    }, []),

    signUp: useCallback(async (userData) => {
      try {
        // Assuming your backend has a signup endpoint
        const response = await authAPI.signup(userData);
        const { token, user } = response.data;

        await storageService.setToken(token);
        await storageService.setUser(user);

        dispatch({
          type: 'SIGN_UP',
          payload: { token, user },
        });

        return { success: true };
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Signup failed';
        dispatch({
          type: 'SET_ERROR',
          payload: errorMessage,
        });
        return { success: false, error: errorMessage };
      }
    }, []),
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};
