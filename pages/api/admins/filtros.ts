import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import nc from 'next-connect'

const handler: NextApiHandler = nc()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { data } = await axios.get(`${process.env.API_URL}api/administradores/filtros?campo=${req.query.search_query}&page=${req.query.page}&size=${req.query.size}`, {
        headers: {
          authorization: `Bearer ${req.cookies.token}`
        }
      })
      return res.status(200).json({
        lista: data.content,
        totalPaginas: data.totalPages,
        totalElementos: data.content.length
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