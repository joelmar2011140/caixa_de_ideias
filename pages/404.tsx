import { NextPage } from 'next'
import NextLink from 'next/link'
import { Center, VStack, Button, Text, Heading } from '@chakra-ui/react'
import Head from 'next/head'

const NotFoundPage: NextPage = () => {
  return (
  <>
    <Head>
      <title>Página não encontrada</title>
    </Head>
    <Center>
      <VStack spacing={4} mt={32} alignContent='center' justifyContent='center' textAlign='center'>
        <Text letterSpacing={2} fontSize='2xl'>ERRO</Text>
        <Heading fontSize='9xl'>404</Heading>
        <Text letterSpacing={2} fontSize='2xl'>Página não encontrada</Text>
        <Text letterSpacing={2} fontSize='2xl'>Ooops parece que está sem ideias</Text>
        <NextLink passHref href='/'>
          <Button colorScheme='blue'>Página inicial</Button>
        </NextLink>
      </VStack>
    </Center>
  </>
  )
}

export default NotFoundPage