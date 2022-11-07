import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import nc from 'next-connect'
import { validarSenha } from '../../../src/app.data'

const handler: NextApiHandler = nc()
  .put(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const dataUpdateSenha = await validarSenha.validateAsync(req.body)
      const { status } = await axios.put(`${process.env.API_URL}api/utilizador/palavraPasse`, dataUpdateSenha, {
        headers: {
          authorization: `Bearer ${req.cookies.token}`
        }
      })
      if (status === 200) {
        return res.status(201).json({
          info: 'Senha alterada com sucesso'
        })
      }
    } catch (err: any) {
      switch (err.name) {
        case 'ValidationError':
          for (const erro of err.details) {
            return res.status(403).json({
              message: erro.message
            })
          }
          break
        case 'AxiosError':
          if (err.response.data) {
            res.status(403).json(err.response.data)
          }
          break
      }
    }
  })
  

export default handler 