import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import nc from 'next-connect'

const handler: NextApiHandler = nc()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const idIdeia = Number(req.query.id)
      const { data } = await axios.get(`${process.env.API_URL}api/ideia/${idIdeia}`, {
        headers: {
          authorization: `Bearer ${req.cookies.token}`
        }
      })
      if (!data) {
        return res.status(404).json({
          message: 'Ideia não encontrada'
        })
      }
      return res.status(200).json(data)
    } catch (err: any) {
      console.error(err)
    }
  })
    
      

export default handler 