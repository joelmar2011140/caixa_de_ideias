/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@pusher/push-notifications-web']);

const nextConfig = {
  env: {
    API_URL: 'https://caixaideia.herokuapp.com/',
    PUSHER_INSTANCE_ID: 'a146f7cc-2f23-46b3-94da-09de2337815f',
  },
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/perfil',
        permanent: true
      }
    ]
  }
}

module.exports = withTM(nextConfig)
