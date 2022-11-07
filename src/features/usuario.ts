import { createSlice } from '@reduxjs/toolkit'
import { Registo } from '../app.types'

const initialState: Registo = {
  cargo: '',
  dataNascimento: '',
  genero: '',
  nome: '',
  telefone: '',
  email: '',
}

const updateAUser = createSlice({
  name: 'updateUser',
  reducers: {
    update: (state: Registo, { type, payload } : any) => {    
      state.cargo = payload.cargo
      state.dataNascimento = payload.dataNascimento
      state.email = payload.email
      state.genero = payload.genero
      state.id = payload.id
      state.nome = payload.nome
      state.telefone = payload.telefone
    }
  },
  initialState
})

export const { update } = updateAUser.actions
export default updateAUser.reducer