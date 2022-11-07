import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import nc from 'next-connect'

const handler: NextApiHandler = nc()
  .patch(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { data } = await axios.put(`${process.env.API_URL}api/administrador/perfil`, req.body, {
        headers: {
          authorization: `Bearer ${req.cookies.token}`
        }
      })
      return res.status(201).json({
        info: 'Dados do administrador atualizados com sucesso'
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