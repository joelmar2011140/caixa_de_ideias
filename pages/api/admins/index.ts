import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import extractDomain from 'extract-domain'
import axios from 'axios'
import nc from 'next-connect'
import { RegistoAdminSchema } from '../../../src/app.data'

const handler: NextApiHandler = nc()
  .get(async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
      return res.status(405).json({
        details: 'Métodoo não permitido',
        message: 'Este método não é permitido',
        status: 405
      })
    }
    try {
      const { data } = await axios.get(`${process.env.API_URL}api/administradores/admin?page=${req.query.page}&size=${req.query.size}`, {
        headers: {
          authorization: `Bearer ${req.cookies.token}`
        }
      })
      
      return res.status(200).json({
        lista: data.content,
        totalPaginas: data.totalPages,
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
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Registar admin
      const admin = await RegistoAdminSchema.validateAsync(req.body)
      const anoAtual = new Date().getFullYear()
      const anoUser = new Date(admin.dataNascimento).getFullYear()
      const idade = anoAtual - anoUser
      if (idade < 18) {
        return res.status(400).json({
          details: 'Data de nascimento não permitida',
          message: 'Este admin não pode ser adicionado',
          status: 400
        })
      }
      if (extractDomain(admin.email) !== 'proit-consulting.com') {
        return res.status(400).json({
          details: 'Forneça por favor o email corporativo',
          message: 'Forneça por favor o email corporativo',
          status: 400
        })
      }
      const { data } = await axios.post(`${process.env.API_URL}api/administrador`, admin,{
        headers: {
          authorization: `Bearer ${req.cookies.token}`
        }
      })
      return res.status(201).json({
        info: 'Administrador registado com sucesso'
      })
    } catch (err: any) {
      switch (err.name) {
        case 'ValidationError':
          err.details.map((err: any) => {
            return res.status(400).json({
              details: err.message,
              message: err.message,
              status: 400
            })
          })
          break
        case 'AxiosError':
          if (err.response.data) {
            return res.status(403).json(err.response.data)
          }
          break
      }
    }
  })

export default handler 