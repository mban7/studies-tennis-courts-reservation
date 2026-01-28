// User Types
export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  first_name: string;
  last_name: string;
  date_joined: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface UserUpdateData {
  email?: string;
  first_name?: string;
  last_name?: string;
}

// Court Types
export interface CourtPrice {
  id: string;
  price_per_hour: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Court {
  id: string;
  name: string;
  court_type: 'indoor' | 'outdoor';
  surface: 'clay' | 'grass' | 'hard';
  max_players: number;
  city: string;
  street: string;
  postal_code: string;
  description: string | null;
  is_active: boolean;
  prices: CourtPrice[];
  created_at: string;
  updated_at: string;
}

export interface CourtCreateData {
  name: string;
  court_type: 'indoor' | 'outdoor';
  surface: 'clay' | 'grass' | 'hard';
  max_players: number;
  city: string;
  street: string;
  postal_code: string;
  description?: string;
  prices: {
    price_per_hour: string;
  };
}

export interface CourtUpdateData {
  name?: string;
  court_type?: 'indoor' | 'outdoor';
  surface?: 'clay' | 'grass' | 'hard';
  max_players?: number;
  city?: string;
  street?: string;
  postal_code?: string;
  description?: string;
  is_active?: boolean;
  prices?: {
    price_per_hour?: string;
  };
}

// Reservation Types
export interface Reservation {
  id: string;
  court: Court;
  user: User;
  players_count: number;
  additional_info: string | null;
  status: 'pending' | 'confirmed' | 'canceled';
  total_amount: string;
  start_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;
}

export interface ReservationCreateData {
  court_id: string;
  players_count: number;
  additional_info?: string;
  start_at: string;
  end_at: string;
}

export interface ReservationUpdateData {
  players_count?: number;
  additional_info?: string;
  start_at?: string;
  end_at?: string;
}

// API Response Type
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
