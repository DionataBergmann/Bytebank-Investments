import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: number
  email: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
  initialized: boolean
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/transactions', '')

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  initialized: false
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erro ao fazer login')
      }

      const data = await response.json()

      localStorage.setItem('token', data.token)
      return {
        user: data.user,
        token: data.token
      }
    } catch (err: any) {
      return rejectWithValue(err.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.initialized = true
      localStorage.removeItem('token')
    },
    setTokenFromStorage(state) {
      const storedToken = localStorage.getItem('token')
      state.token = storedToken || null
      state.initialized = true
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.initialized = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.initialized = true
      })
  }
})

export const { logout, setTokenFromStorage } = authSlice.actions
export default authSlice.reducer
