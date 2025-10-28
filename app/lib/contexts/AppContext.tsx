'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { User, Worksheet, Assignment, LearningResult, Folder, StudentStats } from '@/app/types';
import {
  dummyUsers,
  dummyWorksheets,
  dummyAssignments,
  dummyLearningResults,
  dummyFolders,
  dummyStudentStats,
  dummyTeacherDashboardStats
} from '@/app/lib/data/dummy-data';
import { FavoritesProvider } from './FavoritesContext';

// 앱 상태 타입 정의
interface AppState {
  currentUser: User | null;
  users: User[];
  worksheets: Worksheet[];
  assignments: Assignment[];
  learningResults: LearningResult[];
  folders: Folder[];
  studentStats: StudentStats[];
  teacherDashboardStats: typeof dummyTeacherDashboardStats;
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// 액션 타입 정의
type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'ADD_WORKSHEET'; payload: Worksheet }
  | { type: 'UPDATE_WORKSHEET'; payload: Worksheet }
  | { type: 'DELETE_WORKSHEET'; payload: string }
  | { type: 'ADD_ASSIGNMENT'; payload: Assignment }
  | { type: 'UPDATE_ASSIGNMENT'; payload: Assignment }
  | { type: 'ADD_LEARNING_RESULT'; payload: LearningResult }
  | { type: 'ADD_FOLDER'; payload: Folder }
  | { type: 'UPDATE_FOLDER'; payload: Folder }
  | { type: 'DELETE_FOLDER'; payload: string }
  | { type: 'REFRESH_DATA' };

// localStorage 키
const STORAGE_KEY = 'bank_current_user';

// localStorage에서 사용자 정보 가져오기
const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedUser = JSON.parse(stored);
      // 더미 데이터에서 해당 사용자가 여전히 존재하는지 확인
      const existingUser = dummyUsers.find(u => u.id === parsedUser.id);
      return existingUser || null;
    }
  } catch (error) {
    console.error('localStorage에서 사용자 정보를 불러오는데 실패했습니다:', error);
    localStorage.removeItem(STORAGE_KEY);
  }
  
  return null;
};

// localStorage에 사용자 정보 저장
const setStoredUser = (user: User | null) => {
  if (typeof window === 'undefined') return;
  
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('localStorage에 사용자 정보를 저장하는데 실패했습니다:', error);
  }
};

// 초기 상태
const initialState: AppState = {
  currentUser: null, // 초기에는 null로 설정하고, useEffect에서 localStorage에서 복원
  users: dummyUsers,
  worksheets: dummyWorksheets,
  assignments: dummyAssignments,
  learningResults: dummyLearningResults,
  folders: dummyFolders,
  studentStats: dummyStudentStats,
  teacherDashboardStats: dummyTeacherDashboardStats,
  loading: false,
  error: null,
  isInitialized: false
};

// 리듀서 함수
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      // localStorage에 사용자 정보 저장
      setStoredUser(action.payload);
      return { ...state, currentUser: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    
    case 'ADD_WORKSHEET':
      return { 
        ...state, 
        worksheets: [action.payload, ...state.worksheets] 
      };
    
    case 'UPDATE_WORKSHEET':
      return {
        ...state,
        worksheets: state.worksheets.map(worksheet =>
          worksheet.id === action.payload.id ? action.payload : worksheet
        )
      };
    
    case 'DELETE_WORKSHEET':
      return {
        ...state,
        worksheets: state.worksheets.filter(worksheet => worksheet.id !== action.payload)
      };
    
    case 'ADD_ASSIGNMENT':
      return {
        ...state,
        assignments: [...state.assignments, action.payload]
      };
    
    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map(assignment =>
          assignment.id === action.payload.id ? action.payload : assignment
        )
      };
    
    case 'ADD_LEARNING_RESULT':
      return {
        ...state,
        learningResults: [...state.learningResults, action.payload]
      };
    
    case 'ADD_FOLDER':
      return {
        ...state,
        folders: [...state.folders, action.payload]
      };
    
    case 'UPDATE_FOLDER':
      return {
        ...state,
        folders: state.folders.map(folder =>
          folder.id === action.payload.id ? action.payload : folder
        )
      };
    
    case 'DELETE_FOLDER':
      return {
        ...state,
        folders: state.folders.filter(folder => folder.id !== action.payload)
      };
    
    case 'REFRESH_DATA':
      return {
        ...state,
        users: dummyUsers,
        worksheets: dummyWorksheets,
        assignments: dummyAssignments,
        learningResults: dummyLearningResults,
        folders: dummyFolders,
        studentStats: dummyStudentStats,
        teacherDashboardStats: dummyTeacherDashboardStats
      };
    
    default:
      return state;
  }
};

// Context 생성
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider 컴포넌트
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 컴포넌트 마운트 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    const initializeApp = async () => {
      const storedUser = getStoredUser();
      if (storedUser) {
        dispatch({ type: 'SET_CURRENT_USER', payload: storedUser });
      }
      // 초기화 완료 표시
      dispatch({ type: 'SET_INITIALIZED', payload: true });
    };

    if (!state.isInitialized) {
      initializeApp();
    }
  }, [state.isInitialized]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <FavoritesProvider>
        {children}
      </FavoritesProvider>
    </AppContext.Provider>
  );
};

// Custom Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// 편의 함수들
export const useCurrentUser = () => {
  const { state } = useAppContext();
  return state.currentUser;
};

export const useWorksheets = (teacherId?: string) => {
  const { state } = useAppContext();
  if (teacherId) {
    return state.worksheets.filter(worksheet => worksheet.teacherId === teacherId);
  }
  return state.worksheets;
};

export const useAssignments = (teacherId?: string, studentId?: string) => {
  const { state } = useAppContext();
  let assignments = state.assignments;
  
  if (teacherId) {
    assignments = assignments.filter(assignment => assignment.teacherId === teacherId);
  }
  
  if (studentId) {
    assignments = assignments.filter(assignment => assignment.studentIds.includes(studentId));
  }
  
  return assignments;
};

export const useStudents = (teacherId?: string) => {
  const { state } = useAppContext();
  if (teacherId) {
    return state.users.filter(user => user.role === 'student' && user.teacherId === teacherId);
  }
  return state.users.filter(user => user.role === 'student');
};

export const useFolders = (teacherId?: string) => {
  const { state } = useAppContext();
  if (teacherId) {
    return state.folders.filter(folder => folder.teacherId === teacherId);
  }
  return state.folders;
};

export const useLearningResults = (studentId?: string) => {
  const { state } = useAppContext();
  if (studentId) {
    return state.learningResults.filter(result => result.studentId === studentId);
  }
  return state.learningResults;
};

export const useStudentStats = (studentId?: string) => {
  const { state } = useAppContext();
  if (studentId) {
    return state.studentStats.find(stats => stats.studentId === studentId);
  }
  return state.studentStats;
};

export const useTeacherDashboardStats = () => {
  const { state } = useAppContext();
  return state.teacherDashboardStats;
};

// 폴더 관리 함수들
export const useFolderActions = () => {
  const { state, dispatch } = useAppContext();
  
  const createFolder = (name: string, teacherId: string, color?: string) => {
    const newFolder: Folder = {
      id: `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      teacherId,
      isShared: false,
      createdAt: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_FOLDER', payload: newFolder });
    return newFolder;
  };
  
  const updateFolder = (folderId: string, updates: Partial<Folder>) => {
    const existingFolder = state.folders.find(f => f.id === folderId);
    
    if (existingFolder) {
      const updatedFolder: Folder = {
        ...existingFolder,
        ...updates
      };
      
      dispatch({ type: 'UPDATE_FOLDER', payload: updatedFolder });
      return updatedFolder;
    }
    
    return null;
  };
  
  const deleteFolder = (folderId: string) => {
    dispatch({ type: 'DELETE_FOLDER', payload: folderId });
    
    // 폴더에 속한 학습지들을 미분류로 이동
    const worksheetsInFolder = state.worksheets.filter(w => w.folderId === folderId);
    
    worksheetsInFolder.forEach(worksheet => {
      const updatedWorksheet = { ...worksheet, folderId: undefined };
      dispatch({ type: 'UPDATE_WORKSHEET', payload: updatedWorksheet });
    });
  };
  
  return {
    createFolder,
    updateFolder,
    deleteFolder
  };
};

// 학습지 관리 함수들
export const useWorksheetActions = () => {
  const { state, dispatch } = useAppContext();
  
  const updateWorksheet = (worksheetId: string, updates: Partial<Worksheet>) => {
    const existingWorksheet = state.worksheets.find(w => w.id === worksheetId);
    
    if (existingWorksheet) {
      const updatedWorksheet: Worksheet = {
        ...existingWorksheet,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      dispatch({ type: 'UPDATE_WORKSHEET', payload: updatedWorksheet });
      return updatedWorksheet;
    }
    
    return null;
  };
  
  return {
    updateWorksheet
  };
};
