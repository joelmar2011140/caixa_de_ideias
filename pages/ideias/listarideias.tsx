import { NextPage, GetServerSidePropsContext } from 'next'
import Layout from '../../src/components/Layout'
import Tabela from '../../src/components/Tabela'

const ListarIdeiasPage: NextPage = () => {
  return (
    <Layout titulo='Listar ideias'>
      <Tabela />
    </Layout>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const token = ctx.req.cookies.token

  if (token) {
    return {
      props: {
      }
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    }
  }
}

export default ListarIdeiasPage