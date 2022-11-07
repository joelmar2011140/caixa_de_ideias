import * as PusherWeb from '@pusher/push-notifications-web'

export const pusher = async (id: string) => {
  let pusherCliente: any
  const cliente = new PusherWeb.Client({ instanceId: process.env.PUSHER_INSTANCE_ID as string })
  pusherCliente = cliente

  return { pusherCliente }
}