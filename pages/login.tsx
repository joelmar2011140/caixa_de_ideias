import { useState, ChangeEvent } from 'react'
import {
  Flex,
  Box,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery } from 'react-query'
import { AiOutlineMail } from 'react-icons/ai'
import Head from 'next/head'
import { RiLockPasswordFill } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { LoginCredentials } from '../src/app.types';
import { useRouter } from 'next/router';
import axios from 'axios';
import { setAuth } from '../src/features/auth';
import { GetServerSidePropsContext, NextPage } from 'next';

const LoginPage: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loading, setLoading] = useState<boolean>(false)
  const toast = useToast()
  const [login, setLogin] = useState<LoginCredentials>({ email: '', palavraPasse: '' })
  const roteador = useRouter()
  const dispatch = useDispatch()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLogin({ ...login, [e.target.name]: e.target.value })
  }

  const aoClicarEnter = async (e: any) => {
    if (e.key === 'Enter') {
      try {
        setLoading(true)
        e.preventDefault()
        const { data } = await axios.post('/api/auth/login', { email: login.email, palavraPasse: login.palavraPasse })
        if (data) {
          dispatch(setAuth({ user: data }))
          roteador.replace('/')
        }
      } catch (err: any) {
        setLoading(false)
        toast({
          status: 'error',
          position: 'bottom-right',
          description: err.response.data.details,
          size: '200px'
        })
      }
    }
  }

  const handleLogin = async (e: any) => {
    try {
      setLoading(true)
      e.preventDefault()
      const { data } = await axios.post('/api/auth/login', { email: login.email, palavraPasse: login.palavraPasse })
      if (data) {
        dispatch(setAuth({ user: data }))
        roteador.replace('/')
      }
    } catch (err: any) {
      setLoading(false)
      toast({
        status: 'error',
        position: 'bottom-right',
        description: err.response.data.details,
        size: '200px'
      })
    }
  }


  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <meta name='description' content='Caixa de ideias, submeta as tuas ideias e deixe o mundo fluir a partir delas' />
        <meta name='keywords' content='caixa de ideias, ideias, angola, proit consulting angola' />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>Caixa de ideias - Login</title>
      </Head>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={4} mx={'auto'} w={{ base: 'container.sm', md: 'container.md', lg: 'container.lg' }} maxW={'lg'} py={8} px={6} >
          <Stack align={'center'} p={2}>
            <Heading fontSize={{ base: '2xl', md: '2xl', lg: '4xl' }}>Caixa de ideias💡</Heading>
            <Text fontSize={'md'} color={'gray.600'}>Faça o login para acessar sua conta</Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={6}>
            <Stack spacing={4}>
              <InputGroup>
                <InputLeftElement pointerEvents='none'><AiOutlineMail color='gray.300' /></InputLeftElement>
                <Input required type='email' placeholder='Email' name='email' onChange={handleChange} value={login.email} />
              </InputGroup>
              <InputGroup>
                <InputLeftElement pointerEvents='none'><RiLockPasswordFill color='gray.300' /></InputLeftElement>
                <Input required type='password' onKeyDown={aoClicarEnter} name='palavraPasse' placeholder='Palavra-passe' onChange={handleChange} value={login.palavraPasse} />
              </InputGroup>

              <Stack spacing={10}>
                {
                  !login.email || !login.palavraPasse ? (
                    <Button
                      disabled={true}
                      bg={'blue.400'}
                      color={'white'}
                      _hover={{
                        bg: 'blue.500',
                      }}>
                      Iniciar sessão
                    </Button>
                  ) : (
                    <Button
                      onClick={handleLogin}
                      bg={'blue.400'}
                      isLoading={loading}
                      loadingText='Iniciando a sessão'
                      color={'white'}
                      _hover={{
                        bg: 'blue.500',
                      }}>
                      Iniciar sessão
                    </Button>
                  )
                }
                <Flex display='hidden' flexDir='row' justifyContent='space-between' alignItems='center' fontSize={{ base: 'x-small', md: 'sm', lg: 'sm' }}>
                  <Text>Esqueceu-se da senha ?</Text>
                  <Text color='blue' cursor='pointer'>Redifinir senha</Text>
                </Flex>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex >
    </>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // Se existir um token, quer dizer que está logado
  const token = ctx.req.cookies.token
  if (token) {
    return {
      redirect: {
        permanent: false,
        destination: "/perfil",
      },
      props: {},
    }
  }
  return {
    props: {

    }
  }
}

export default LoginPage
