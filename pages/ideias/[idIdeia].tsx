import { Badge, Box, Button, Heading, HStack, Text, useToast, VStack } from '@chakra-ui/react'
import type { NextPage, GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import { GrLinkPrevious } from 'react-icons/gr'
import Layout from '../../src/components/Layout'
import NextLink from 'next/link'
import { BsCalendarDate, BsEye } from 'react-icons/bs'
import { MdDelete, MdDescription, MdDone, MdOutlineAlternateEmail, MdOutlineWork } from 'react-icons/md'
import { TiDelete } from 'react-icons/ti'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../src/features/store'
import { accoes } from '../../src/lib'

const SingleNotificacoesPage: NextPage<any> = ({ ideia }) => {
  const { user } = useSelector((estado: RootState) => (estado.auth))
  const { id, nome, descricao, url, area, emailUtilizador, estadoIdeia, dataPublicacao } = ideia
  const toast = useToast()
  const roteador = useRouter()

  const eliminar = async (id: number) => {
    try {
      const data = await accoes('eliminar', id)
      if (data?.data.info) {
        toast({
          description: 'Ideia eliminada',
          status: 'success',
          position: 'bottom-right'
        })
        roteador.replace('/ideias/listarideias')
      }
    } catch (err: any) {
      switch (err.name) {
        case 'AxiosError':
          if (err.response.data) {
            toast({
              description: err.response.data,
              status: 'error',
              position: 'bottom-right'
            })
          }
          break
      }
    }
  }

  const aprovar = async (id: number) => {
    try {
      const data = await accoes('aprovar', id)
      if (data?.data.info) {
        toast({
          description: 'Ideia aprovada',
          status: 'success',
          position: 'bottom-right'
        })
        roteador.reload()
      }
    } catch (err: any) {
      switch (err.name) {
        case 'AxiosError':
          if (err.response.data) {
            toast({
              description: err.response.data,
              status: 'error',
              position: 'bottom-right'
            })
          }
          break
      }
    }
  }

  const rejeitar = async (id: number) => {
    try {
      const data = await accoes('rejeitar', id)
      if (data?.data.info) {
        toast({
          description: 'Ideia rejeitada',
          status: 'success',
          position: 'bottom-right'
        })
        roteador.reload()
      }
    } catch (err: any) {
      console.log('Aqui: ', err);
    }
  }

  return (
    <Layout titulo='Notificacoes'>
      <VStack alignItems='center' w='full' p={2}>
        <HStack alignItems='center' w='full' p={2} spacing={2} fontSize={['sm', 'md']}>
          <NextLink passHref href='/ideias/listarideias'><GrLinkPrevious title='Listar ideias' cursor='pointer' /></NextLink>
          <Text fontWeight='bold'>Ideias</Text>
        </HStack>
        <VStack fontFamily='monospace' borderRadius='lg' alignItems='flex-start' spacing={4} p={8} w={['full', '60vw']} boxShadow='2xl'>
          <Text fontWeight='bold' alignSelf='center'  fontSize='lg'>{nome}</Text>
          <HStack w='full' alignItems='flex-start' fontSize='lg'>
            <MdDescription title='Descrição' />
            <Text noOfLines={[1, 2, 3]}>{descricao}</Text>
          </HStack>
          <HStack  fontSize='lg'>
            <MdOutlineWork title='área' />
            <Text>{area}</Text>
          </HStack>
          <HStack  fontSize='lg'>
            <MdOutlineAlternateEmail title='Email do utilizador' />
            <Text>{emailUtilizador}</Text>
          </HStack>
          <HStack  fontSize='lg'>
            <BsCalendarDate title='Data de publicação' />
            <Text>{dataPublicacao}</Text>
          </HStack>
          {estadoIdeia === 'PENDENTE' ? (<Badge p={2} colorScheme='orange'>{estadoIdeia}</Badge>) : estadoIdeia === 'REJEITADA' ? (<Badge colorScheme='red' p={2}>{estadoIdeia}</Badge>) : (<Badge p={2} colorScheme='green'>{estadoIdeia}</Badge>)}
          <HStack >
            {
              (user.papeis[0] === 'ROLE_MASTER_ADMIN' || user.papeis[0] === 'ROLE_ADMIN') && (<Button disabled={estadoIdeia === 'APROVADA'} title='Aprovar esta ideia' fontSize='sm' size='sm' colorScheme='green' onClick={() => aprovar(id)}><MdDone /></Button>)
            }
            {
              (user.papeis[0] === 'ROLE_MASTER_ADMIN' || user.papeis[0] === 'ROLE_ADMIN') && (<Button disabled={estadoIdeia === 'REJEITADA'} title='Rejietar esta ideia' fontSize='sm' size='sm' colorScheme='red' onClick={() => rejeitar(id)}><TiDelete /></Button>)
            }
            {
              (user.papeis[0] === 'ROLE_MASTER_ADMIN' || user.papeis[0] === 'ROLE_ADMIN') && (<Button title='Eliminar esta ideia' fontSize='sm' size='sm' colorScheme='gray' onClick={() => eliminar(id)}><MdDelete /></Button>)
            }
            <NextLink passHref href={url}><Button title='Visualizar esta ideia' fontSize='sm' size='sm' colorScheme='blackAlpha'><BsEye /></Button></NextLink>
          </HStack>
        </VStack>
      </VStack>
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
  try {
    const { data } = await axios.get(`${process.env.API_URL}api/ideia/${ctx.query.idIdeia}`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    return {
      props: {
        ideia: data
      }
    }
  } catch (err: any) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    }
  }
}


export default SingleNotificacoesPage
