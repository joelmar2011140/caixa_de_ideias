import { createSlice } from '@reduxjs/toolkit'
import { TAuth } from '../app.types'

const initialState: TAuth = {
  user: {
    cargo: '',
    dataNascimento: '',
    genero: '',
    nome: '',
    telefone: '',
    email: '',
    role: '',
    estado: '',
    papeis: [''],
    pusher_id: ''
  }
}

const setRegistoUser = createSlice({
  name: 'auth',
  reducers: {
    setAuth: (state: any, { type, payload } : any) => {
      const { user } = payload
      state.user = user
    }
  },
  initialState
})

export const { setAuth } = setRegistoUser.actions
export default setRegistoUser.reducer