import type { GetServerSidePropsContext, NextPage } from 'next'
import axios from 'axios'
import Layout from '../src/components/Layout'
import { Box, SkeletonText } from '@chakra-ui/react'
import AreaPerfil from '../src/components/AreaPerfil'

const Perfil: NextPage<any> = ({ user }) => {
  return (
    <Layout titulo={`Perfil de ${user.nome}`}>
      <Box p={2} w='container.md' maxW='max'>
        {!user ? (<SkeletonText mt='4' noOfLines={4} spacing='4' />) : (<AreaPerfil />)}
      </Box>
    </Layout>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const token = ctx.req.cookies.token
  if (token) {
    const { data } = await axios.get(`${process.env.API_URL}api/utilizador/perfil`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })

    if (data.funcionario) {
      return {
        props: {
          user: {
            email: data.email,
            telefone: data.telefone,
            cargo: data.funcionario.cargo,
            nome: data.funcionario.nome,
            genero: data.funcionario.genero,
            dataNascimento: data.funcionario.dataNascimento,
            estado: data.funcionario.estadoFuncionario,
          }
        }
      }
    }

    return {
      props: {
        user: {
          email: data.email,
          telefone: data.telefone,
          cargo: data.administrador.cargo,
          nome: data.administrador.nome,
          genero: data.administrador.genero,
          dataNascimento: data.administrador.dataNascimento,
          estado: data.administrador.estadoFuncionario,
        }
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

export default Perfil
