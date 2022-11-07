import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import nc from 'next-connect'

const handler: NextApiHandler = nc()
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { data } = await axios.delete(`${process.env.API_URL}api/notificacao/${req.query.id}`, {
        headers: {
          authorization: `Bearer ${req.cookies.token}`
        }
      })
      return res.status(200).json({
        info: 'Notificação eliminada'
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