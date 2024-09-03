import PusherClient from 'pusher-js'
import PusherServer from 'pusher'
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_APP_KEY as string,
  useTLS: true,
})

export const pusherClient = new PusherClient(
  process.env.PUSHER_APP_KEY as string
)

