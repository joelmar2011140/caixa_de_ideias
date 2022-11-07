import { createSlice } from '@reduxjs/toolkit'
import { NotificacoesProps } from '../app.types'

const initialState = {
  totalNaoLidas: 0
}

const setNotify = createSlice({
  name: 'notificacao',
  initialState,
  reducers: {
    setNotificacao: (state: any, { type, payload } : any) => {
      state.totalNaoLidas = payload.totalNaoLidas
    }
  }
})

export const { setNotificacao } = setNotify.actions
export default setNotify.reducer