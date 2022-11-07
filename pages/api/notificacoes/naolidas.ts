import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import nc from 'next-connect'

const handler: NextApiHandler = nc()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      let totalNaoLidas: number = 0
      const { data } = await axios.get(`${process.env.API_URL}api/notificacoes/paginacao`, {
        headers: {
          authorization: `Bearer ${req.cookies.token}`
        }
      })
      for (const notificacao of data.content) {
        if (notificacao.estado === 'NAO_LIDA') {
          totalNaoLidas++
        }
      }
      return res.status(200).json({
        totalNaoLidas
      })
    } catch (err: any) {
      switch (err.name) {
        case 'AxiosError':
          if (err.response.data) {
            return res.status(403).json(err.response.data)
          }
          break
      }
    }
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { data } = await axios.delete(`${process.env.API_URL}api/notificacoes`, {
        headers: {
          authorization: `Bearer ${req.cookies.token}`
        }
      })
      return res.status(200).json({
        info: 'Notificações eliminadas'
      })
    } catch (err: any) {
      switch (err.name) {
        case 'AxiosError':
          if (err.response.data) {
            return res.status(403).json(err.response.data)
          }
          break
      }
    }
  })

export default handler 