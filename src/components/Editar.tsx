import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../features/store";
import { Input, Button, Stack, useColorModeValue, Box, HStack, Select, useToast } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import { Registo } from "../app.types";
import { useRouter } from "next/router";
import axios from "axios";
import { update } from "../features/usuario";

const Editar = () => {
  const { id, cargo, dataNascimento, email, genero, nome, telefone } = useSelector((estado: RootState) => (estado.updateAUser))
  const toast = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const roteador = useRouter()
  const [userData, setUserData] = useState<Registo>({ cargo, nome, telefone, email, dataNascimento, genero })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setUserData({ ...userData, [e.target.name]: e.target.value })

  // Adicionar um admin
  const atualizarAdmin = async () => {
    try {
      setLoading(true)
      const { data } = await axios.put<{ info: string }>(`/api/admins/${id}`, userData)
      if (data) {

        toast({
          status: 'success',
          position: 'bottom-right',
          description: data.info
        })
        roteador.reload()
        return
      }
    } catch (err: any) {
      setLoading(false)
      if (err.name === 'ValidationError') {
        return toast({
          status: 'error',
          position: 'bottom-right',
          description: err.response.data.details
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
    <Box
      maxW={{ base: '640px', md: '100vw', lg: '640px' }}
      w={'full'}
      bg={useColorModeValue('white', 'gray.900')}
      p={6}
    >
      <Stack direction={'column'} spacing={4}>
        <Input p={2} placeholder='Nome' value={userData.nome} name='nome' type='text' onChange={handleChange} />
        <Input p={2} placeholder='Cargo' value={userData.cargo} name='cargo' type='text' onChange={handleChange} />
        <HStack>
          <Input type='date' p={2} value={userData.dataNascimento} name='dataNascimento' onChange={handleChange} />
          <Select placeholder='Selecione um gênero' value={userData.genero} name='genero' onChange={handleChange}>
            <option value='Masculino'>Masculino</option>
            <option value='Feminino'>Feminino</option>
          </Select>
        </HStack>
        <HStack>
          <Input p={2} placeholder='Email' value={userData.email} name='email' type='email' onChange={handleChange} />
          <Input p={2} value={userData.telefone} placeholder='Telefone' name='telefone' type='tel' onChange={handleChange} />
        </HStack>
      </Stack>
      <Stack mt={8} direction={'row'} spacing={4} alignItems='flex-end' justifySelf='flex-end'>
        <Button
          fontSize={'sm'}
          rounded={'full'}
          bg={'blue.400'}
          color={'white'}
          onClick={atualizarAdmin}
          isLoading={loading}
          loadingText='Por favor aguarde'
          boxShadow={'0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'}
          _hover={{ bg: 'blue.500' }}
          _focus={{ bg: 'blue.500' }}>Atualizar</Button>
      </Stack>
    </Box>
  )
}

export default Editar

function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
