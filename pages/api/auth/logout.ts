import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      details: 'Métodoo não permitido',
      message: 'Este método não é permitido',
      status: 405
    })
  }
   res.setHeader('Set-Cookie', ['token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT', 'role=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT', 'estado=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT']);
   res.status(200).json({})
}

export default handler