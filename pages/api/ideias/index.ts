import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import nc from 'next-connect'
import formidable from 'formidable'
import { createReadStream } from 'fs'
import FormData from 'form-data'

const handler: NextApiHandler = nc()
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const form = new formidable.IncomingForm({ keepExtensions: true })
    form.parse(req, async (err: any, fields: any, files: any) => {
      if (!files.ficheiro) {
        return res.status(400).json({ message: 'Forneça por favor um ficheiro contendo a ideia' })
      }
      const form = new FormData()
      form.append('nome', fields.nome)
      form.append('area', fields.area)
      form.append('descricao', fields.descricao)
      form.append('ficheiro', createReadStream(files.ficheiro?.filepath))
      let config = {
        method: 'post',
        url: `${process.env.API_URL}api/ideia`,
        headers: {
          Authorization: `Bearer ${req.cookies.token}`,
          ...form.getHeaders(),
        },
        data: form
      }
      const { data } = await axios(config)
      return res.status(200).json({
        data
      })
    })
  })
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
      return res.status(405).json({
        details: 'Método não permitido',
        message: 'Este método não é permitido',
        status: 405
      })
    }
    try {
      const { data } = await axios.get(`${process.env.API_URL}api/ideias?page=${req.query.page}&size=${req.query.size}`, {
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

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler 