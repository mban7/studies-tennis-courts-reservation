import axiosInstance from './axios';
import type {
  ApiResponse,
  User,
  LoginCredentials,
  RegisterData,
  UserUpdateData,
  Court,
  CourtCreateData,
  CourtUpdateData,
  Reservation,
  ReservationCreateData,
  ReservationUpdateData,
} from '@/types';

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse> => {
    const response = await axiosInstance.post('/auth/login/', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<ApiResponse> => {
    const response = await axiosInstance.post('/auth/register/', data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await axiosInstance.post('/auth/logout/');
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get('/auth/me/');
    return response.data;
  },

  updateMe: async (data: UserUpdateData): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.patch('/auth/me/update/', data);
    return response.data;
  },
};

// Users API (Admin only)
export const usersApi = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await axiosInstance.get('/api/users/get/');
    return response.data;
  },

  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get(`/api/users/${id}/get/`);
    return response.data;
  },

  createUser: async (data: UserUpdateData & { password: string; role: 'user' | 'admin' }): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.post('/api/users/create/', data);
    return response.data;
  },

  updateUser: async (id: string, data: UserUpdateData): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.patch(`/api/users/${id}/update/`, data);
    return response.data;
  },

  deactivateUser: async (id: string): Promise<ApiResponse> => {
    const response = await axiosInstance.delete(`/api/users/${id}/deactivate/`);
    return response.data;
  },
};

// Courts API
export const courtsApi = {
  getCourts: async (): Promise<ApiResponse<Court[]>> => {
    const response = await axiosInstance.get('/api/courts/get/');
    return response.data;
  },

  getCourt: async (id: string): Promise<ApiResponse<Court>> => {
    const response = await axiosInstance.get(`/api/courts/${id}/get/`);
    return response.data;
  },

  createCourt: async (data: CourtCreateData): Promise<ApiResponse<Court>> => {
    const response = await axiosInstance.post('/api/courts/create/', data);
    return response.data;
  },

  updateCourt: async (id: string, data: CourtUpdateData): Promise<ApiResponse<Court>> => {
    const response = await axiosInstance.patch(`/api/courts/${id}/update/`, data);
    return response.data;
  },

  toggleCourt: async (id: string): Promise<ApiResponse<Court>> => {
    const response = await axiosInstance.post(`/api/courts/${id}/toggle/`);
    return response.data;
  },
};

// Reservations API
export const reservationsApi = {
  getReservations: async (): Promise<ApiResponse<Reservation[]>> => {
    const response = await axiosInstance.get('/api/reservations/get/');
    return response.data;
  },

  getReservation: async (id: string): Promise<ApiResponse<Reservation>> => {
    const response = await axiosInstance.get(`/api/reservations/${id}/get/`);
    return response.data;
  },

  getCourtReservations: async (courtId: string): Promise<ApiResponse<Reservation[]>> => {
    const response = await axiosInstance.get(`/api/reservations/court/${courtId}/`);
    return response.data;
  },

  createReservation: async (data: ReservationCreateData): Promise<ApiResponse<Reservation>> => {
    const response = await axiosInstance.post('/api/reservations/create/', data);
    return response.data;
  },

  updateReservation: async (id: string, data: ReservationUpdateData): Promise<ApiResponse<Reservation>> => {
    const response = await axiosInstance.patch(`/api/reservations/${id}/update/`, data);
    return response.data;
  },

  cancelReservation: async (id: string): Promise<ApiResponse<Reservation>> => {
    const response = await axiosInstance.post(`/api/reservations/${id}/cancel/`);
    return response.data;
  },

  confirmReservation: async (id: string): Promise<ApiResponse<Reservation>> => {
    const response = await axiosInstance.post(`/api/reservations/${id}/confirm/`);
    return response.data;
  },
};
