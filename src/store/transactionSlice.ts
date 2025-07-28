import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export type Transaction = {
  id: number
  type: 'Entrada' | 'Saída'
  value: number
  date: string
  category: string | null
  file?: File | string | null
  isEditing?: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/transactions'

const getToken = () => localStorage.getItem('token') || ''

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async () => {
    const token = getToken()

    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await response.json()
    return data as Transaction[]
  }
)

export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (transaction: Transaction) => {
    const token = getToken()

    const formData = new FormData()
    formData.append('type', transaction.type)
    formData.append('value', String(transaction.value))
    formData.append('date', transaction.date)
    if (transaction.category) formData.append('category', transaction.category)
    if (transaction.file instanceof File) formData.append('file', transaction.file)

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    const data = await response.json()
    return data as Transaction
  }
)

export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (id: number) => {
    const token = getToken()

    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return id
  }
)

export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async ({ id, updated }: { id: number; updated: Partial<Transaction> }) => {
    const token = getToken()

    const formData = new FormData()
    formData.append('type', updated.type!)
    formData.append('value', String(updated.value!))
    formData.append('date', updated.date || new Date().toISOString())
    formData.append('category', updated.category || '')

    if (updated.file instanceof File) {
      formData.append('file', updated.file)
    }

    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    })

    const data = await res.json()

    return {
      ...data,
      id: Number(data.id)
    } as Transaction
  }
)

type TransactionState = {
  transactions: Transaction[]
  loading: boolean
  error: string | null
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null
}

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setEditingState(state, action: PayloadAction<number>) {
      state.transactions = state.transactions.map(tx =>
        tx.id === action.payload ? { ...tx, isEditing: true } : tx
      )
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload
      })
      .addCase(fetchTransactions.rejected, (state) => {
        state.loading = false
        state.error = 'Failed to load transactions'
      })

      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload)
      })

      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(tx => tx.id !== action.payload)
      })

      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.map(tx =>
          tx.id === action.payload.id ? action.payload : tx
        )
      })
  }
})

export const { setEditingState } = transactionSlice.actions
export default transactionSlice.reducer
