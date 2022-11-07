import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import nc from 'next-connect'

const handler: NextApiHandler = nc()
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { data } = await axios.put(`${process.env.API_URL}api/administrador/${req.query.id}`, req.body, {
        headers: {
          authorization: `Bearer ${req.cookies.token}`
        }
      })
      return res.status(201).json({
        info: 'Dados atualizados com sucesso'
      })
    } catch (err: any) {
      console.error(err);

      switch (err.name) {
        case 'AxiosError':
          if (err.response.data) {
            res.status(403).json(err.response.data)
          }
          break
      }
    }
  })
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { data } = await axios.delete(`${process.env.API_URL}api/administrador/${req.query.id}`, {
        headers: {
          authorization: `Bearer ${req.cookies.token}`
        }
      })
      return res.status(200).json({
        info: 'Adminstrador eliminado'
      })
    } catch (err: any) {
      switch (err.name) {
        case 'AxiosError':
          if (err.response.data) {
            res.status(403).json(err.response.data)
          }
          break
      }
    }
  })

export default handler