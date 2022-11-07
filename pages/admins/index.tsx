import { GetServerSidePropsContext, NextPage } from "next";
import Layout from "../../src/components/Layout";
import Listar from "../../src/components/Listar";

const ListarAdminsPage: NextPage = () => {
  return (
    <Layout titulo="Listar administradores">
      <Listar />
    </Layout>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const token = ctx.req.cookies.token
  const role = ctx.req.cookies.role

  if (token && role === 'ROLE_MASTER_ADMIN') {
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

export default ListarAdminsPage