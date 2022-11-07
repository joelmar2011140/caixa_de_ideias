import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import nc from 'next-connect'

const handler: NextApiHandler = nc()
  .delete(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { data, status } = await axios.delete(`${process.env.API_URL}api/ideia/${req.query.id}`, {
        headers: {
          authorization: `Bearer ${req.cookies.token}`
        }
      })
    
      if (status === 200) {
        return res.status(200).json({
          info: 'Ideia eliminada com sucesso'
        })
      }
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