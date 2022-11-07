import { ChangeEvent, FC, useState } from 'react'
import { Registo } from '../app.types'
import { VStack, Select, Divider, Box, useToast, FormControl, FormLabel, Input, Text, Button, Flex } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Formulario from './Formulario'

const RegistarAdmin = () => {
  const toast = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const roteador = useRouter()
  const [registo, setRegisto] = useState<Registo>({ cargo: '', dataNascimento: '', email: '', genero: '', nome: '', palavraPasse: '', telefone: '' })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setRegisto({ ...registo, [e.target.name]: e.target.value })

  // Adicionar um admin
  const adicionarAdmin = async () => {
    try {
      setLoading(true)
      const { data } = await axios.post<{ info: '' }>('/api/admins', registo)
      toast({
        status: 'success',
        position: 'bottom-right',
        description: data.info
      })
      roteador.reload()
      return
    } catch (err: any) {
      setLoading(false)
      if (err.name === 'ValidationError') {
        return toast({
          status: 'error',
          position: 'bottom-right',
          description: err.response.data.message
        })
      }
      if (err.name === 'AxiosError') {
        return toast({
          status: 'error',
          position: 'bottom-right',
          description: err.response.data.message
        })
      }
    }
  }

  return (
    <VStack alignItems={{ base: 'center', md: 'flex-start', lg: 'flex-start' }} p={4} spacing={4} w={{ base: 'full', md: 'full', lg: 'full' }} maxW='100vw'>
      <Formulario aoMudar={handleChange} cargo={registo.cargo} dataNascimento={registo.dataNascimento} email={registo.email} genero={registo.genero} nome={registo.nome} telefone={registo.telefone} palavraPasse={registo.palavraPasse} />
      <Divider colorScheme='black' border='1px solid black' variant='solid' />
      <Button isLoading={loading} size={{ base: 'sm', md: 'sm' }} fontSize='sm' loadingText='Aguarde por favor enquanto o usuário está a ser adicionado' colorScheme='green' onClick={adicionarAdmin}>Registar Admin</Button>
    </VStack>
  )
}

export default RegistarAdmin
