'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Question } from '@/app/types';

// 즐겨찾기 상태 타입 정의
interface FavoritesState {
  favoriteQuestions: Question[];
  loading: boolean;
  error: string | null;
}

// 액션 타입 정의
type FavoritesAction =
  | { type: 'ADD_FAVORITE'; payload: Question }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'SET_FAVORITES'; payload: Question[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_FAVORITES' };

// localStorage 키
const FAVORITES_STORAGE_KEY = 'bank_favorite_questions';

// localStorage에서 즐겨찾기 데이터 가져오기
const getStoredFavorites = (): Question[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('localStorage에서 즐겨찾기 데이터를 불러오는데 실패했습니다:', error);
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
  }
  
  return [];
};

// localStorage에 즐겨찾기 데이터 저장
const setStoredFavorites = (favorites: Question[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('localStorage에 즐겨찾기 데이터를 저장하는데 실패했습니다:', error);
  }
};

// 초기 상태
const initialState: FavoritesState = {
  favoriteQuestions: [],
  loading: false,
  error: null
};

// 리듀서 함수
const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'ADD_FAVORITE':
      // 중복 체크
      if (state.favoriteQuestions.some(q => q.id === action.payload.id)) {
        return state;
      }
      const newFavoritesAdd = [...state.favoriteQuestions, action.payload];
      setStoredFavorites(newFavoritesAdd);
      return {
        ...state,
        favoriteQuestions: newFavoritesAdd
      };
    
    case 'REMOVE_FAVORITE':
      const newFavoritesRemove = state.favoriteQuestions.filter(q => q.id !== action.payload);
      setStoredFavorites(newFavoritesRemove);
      return {
        ...state,
        favoriteQuestions: newFavoritesRemove
      };
    
    case 'SET_FAVORITES':
      setStoredFavorites(action.payload);
      return {
        ...state,
        favoriteQuestions: action.payload
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };
    
    case 'CLEAR_FAVORITES':
      setStoredFavorites([]);
      return {
        ...state,
        favoriteQuestions: []
      };
    
    default:
      return state;
  }
};

// Context 생성
const FavoritesContext = createContext<{
  state: FavoritesState;
  dispatch: React.Dispatch<FavoritesAction>;
  addFavorite: (question: Question) => void;
  removeFavorite: (questionId: string) => void;
  isFavorite: (questionId: string) => boolean;
  clearFavorites: () => void;
} | null>(null);

// Provider 컴포넌트
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  // 컴포넌트 마운트 시 localStorage에서 즐겨찾기 데이터 복원
  useEffect(() => {
    const storedFavorites = getStoredFavorites();
    if (storedFavorites.length > 0) {
      dispatch({ type: 'SET_FAVORITES', payload: storedFavorites });
    }
  }, []);

  // 편의 함수들
  const addFavorite = (question: Question) => {
    dispatch({ type: 'ADD_FAVORITE', payload: question });
  };

  const removeFavorite = (questionId: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: questionId });
  };

  const isFavorite = (questionId: string) => {
    return state.favoriteQuestions.some(q => q.id === questionId);
  };

  const clearFavorites = () => {
    dispatch({ type: 'CLEAR_FAVORITES' });
  };

  return (
    <FavoritesContext.Provider value={{
      state,
      dispatch,
      addFavorite,
      removeFavorite,
      isFavorite,
      clearFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom Hook
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

// 편의 함수들
export const useFavoriteQuestions = () => {
  const { state } = useFavorites();
  return state.favoriteQuestions;
};

export const useIsFavorite = (questionId: string) => {
  const { isFavorite } = useFavorites();
  return isFavorite(questionId);
};
