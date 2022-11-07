import * as PusherWeb from '@pusher/push-notifications-web'
import type { NextPage, GetServerSidePropsContext } from 'next'
import { useEffect } from 'react'
import Layout from '../../src/components/Layout'
import ListarNotificacoes from '../../src/components/ListaDeNotificacoes'
import { pusher } from '../../src/lib/pusher.service'
import { useSelector } from 'react-redux'
import { RootState } from '../../src/features/store'

const NotificacoesPage: NextPage<any> = ({ user, token }) => {
  const { pusher_id } = useSelector((estado: RootState) => (estado.auth.user))

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const provider = new PusherWeb.TokenProvider({
        url: `${process.env.API_URL}api/pusher/beams-auth`,
        queryParams: { user_id: pusher_id },
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: 'omit'
      })
      pusher(pusher_id).then((resp) => {
        resp.pusherCliente?.start()
          .then((beamsClient: any) => beamsClient.getDeviceId())
          .then(() => resp.pusherCliente?.setUserId(pusher_id, provider))
          .catch((e: any) => console.error('Could not authenticate with Beams:', e))
      })
    }
  }, [pusher_id, token])

  return (
    <Layout titulo='Notificacoes'>
      <ListarNotificacoes />
    </Layout>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // Se existir um token, quer dizer que está logado
  const token = ctx.req.cookies.token
  
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    }
  }
  return {
    props: {
      token: ctx.req.cookies.token
    }
  }
}


export default NotificacoesPage
