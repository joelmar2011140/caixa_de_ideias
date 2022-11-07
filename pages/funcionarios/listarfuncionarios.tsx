import { NextPage, GetServerSidePropsContext } from 'next'
import Layout from '../../src/components/Layout'
import TabelaFuncionarios from '../../src/components/TabelaFuncionarios'

const ListarFuncionariosPage: NextPage = () => {
  return (
    <Layout titulo='Listar funcionários'>
      <TabelaFuncionarios />
    </Layout>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const token = ctx.req.cookies.token
  const role = ctx.req.cookies.role

  if (token && (role === 'ROLE_MASTER_ADMIN' || role === 'ROLE_ADMIN')) {
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

export default ListarFuncionariosPage