import axios, { AxiosResponse } from 'axios'
import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import { serialize } from 'cookie'
import Joi from 'joi'

const loginSchema = Joi.object({
  email: Joi.string().email().required().empty().messages({
    'string.base': 'Indique por favor o seu email',
    'string.empty': 'Indique por favor o seu email',
    'any.required': 'Indique por favor o seu email',
    'string.email': 'Indique por favor um email válido'
  }),
  palavraPasse: Joi.string().empty().messages({
    'string.base': 'Indique por favor a sua senha',
    'string.empty': 'Indique por favor a sua senha',
  })
})

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const loginData = await loginSchema.validateAsync(req.body)
    const { data } = await axios.post(`${process.env.API_URL}api/autenticacao`, loginData)
    if (data) {
      const perfil = await axios.get(`${process.env.API_URL}api/utilizador/perfil`, {
        headers: {
          authorization: `Bearer ${data.token_acesso}`
        }
      })
      const serializado = serialize('token', data.token_acesso, { httpOnly: true, expires: new Date(data.dataExpiracao), path: '/' })
      const serializadoRole = serialize('role', data.papeis[0], { httpOnly: true, expires: new Date(data.dataExpiracao), path: '/' })
      res.setHeader('Set-Cookie', [serializado, serializadoRole])
      if (perfil.data.administrador) {
        return res.status(201).json({
          nome: perfil.data.administrador.nome,
          genero: perfil.data.administrador.genero,
          cargo: perfil.data.administrador.cargo,
          dataNascimento: perfil.data.administrador.dataNascimento,
          telefone: perfil.data.telefone,
          papeis: data.papeis,
          email: perfil.data.email,
          estado: perfil.data.administrador.estadoFuncionario,
          pusher_id: data.userId
        })
      }
      return res.status(201).json({
        nome: perfil.data.funcionario.nome,
        genero: perfil.data.funcionario.genero,
        cargo: perfil.data.funcionario.cargo,
        dataNascimento: perfil.data.funcionario.dataNascimento,
        telefone: perfil.data.telefone,
        papeis: data.papeis,
        email: perfil.data.email,
        estado: perfil.data.funcionario.estadoFuncionario,
        pusher_id: data.userId
      })
    }
  } catch (err: any) {
    switch (err.name) {
      case 'ValidationError':
        err.details.map((err: any) => {
          res.status(400).json({
            details: err.message,
            message: err.message,
            status: 400
          })
        })
        break
      case 'AxiosError':
        if (err.response.data) {
          res.status(403).json(err.response.data)
        }
        break
    }
  }
}

export default handler