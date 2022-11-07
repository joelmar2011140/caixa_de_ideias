import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../features/store";
import { Text, VStack, Input, Button, Stack, useColorModeValue, Tabs, TabList, TabPanels, Tab, TabPanel, Box, Container, Heading, HStack, SimpleGrid, FormControl, FormLabel, useToast, Select } from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { setAuth } from "../features/auth";

const AreaPerfil = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((estado: RootState) => (estado.auth))
  const toast = useToast()
  const roteador = useRouter()
  const { cargo, nome, telefone, dataNascimento, genero, email, estado, papeis, pusher_id, role } = useSelector((state: RootState) => (state.auth.user))
  const [userData, setUserData] = useState({ cargo, nome, telefone, email, dataNascimento, genero, estado, papeis, pusher_id, role })
  const [senha, setSenha] = useState({ palavraPasseAtual: '', palavraPasseNova: '' })
  const [loading, setLoading] = useState<boolean>(false)

  const handleMudarSenha = (e: ChangeEvent<HTMLInputElement>) => setSenha({ ...senha, [e.target.name]: e.target.value })
  const handleUserData = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setUserData({ ...userData, [e.target.name]: e.target.value })

  const alterarPerfil = async () => {
    try {
      if (user.papeis[0] === 'ROLE_MASTER_ADMIN' || user.papeis[0] === 'ROLE_ADMIN') {
        setLoading(true)
        const { data } = await axios.patch<{ info: string }>('/api/admins/perfil', userData)
        toast({
          status: 'success',
          position: 'bottom-right',
          description: data.info
        })
        dispatch(setAuth({ user: userData }))
        roteador.reload()
        return
      }
      setLoading(true)
      const { data } = await axios.patch<{ info: string }>('/api/funcionarios/perfil', userData)
      toast({
        status: 'success',
        position: 'bottom-right',
        description: data.info
      })
      dispatch(setAuth({ user: userData }))
      roteador.reload()
      return
    } catch (err: any) {
      setLoading(false)
      return toast({
        status: 'error',
        description: err.response.data.details,
        position: 'bottom-right',
      })
    }
  }

  const alterarSenha = async () => {
    try {
      setLoading(true)
      const { data } = await axios.put('/api/auth/reset_password', senha)
      if (data) {
        setLoading(false)
        toast({
          status: 'success',
          position: 'bottom-right',
          description: data.info
        })
        roteador.reload()
      }
    } catch (err: any) {
      setLoading(false)
      return toast({
        status: 'error',
        description: err.response.data.details,
        position: 'bottom-right',
      })
    }
  }

  return (
    <VStack alignItems={['center', 'flex-start']} maxW='container.lg' w={['85vw', '67vw', '65vw']} p={2} spacing={2}>
      <Heading color='blackAlpha.700' fontSize={['xl', '2xl']} fontFamily='monospace' textAlign={{ base: 'center', md: 'left', lg: 'left' }}>Meu Perfil</Heading>
      <Tabs w='full'>
        <TabList w='full' fontSize={['xs', 'sm']} border='0px'>
          <Tab>Alterar dados pessoais</Tab>
          {user.papeis[0] !== 'ROLE_FUNCIONARIO' && (<Tab>Modificar senha</Tab>)}
        </TabList>
        <TabPanels w='full'>
          <TabPanel>
            <SimpleGrid columns={1} row={1} spacing={4}>
              <Box
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'2xl'}
                rounded={'lg'}
                p={6}
              >
                <Stack mt={8} direction={'column'} spacing={4}>
                  <FormControl id="nome">
                    <FormLabel>Nome</FormLabel>
                    <Input type='text' onChange={handleUserData} name='nome' p={2} value={userData.nome} size={['sm', 'md', 'lg']} w='full' />
                  </FormControl>
                  <FormControl id="cargo" display={'none'}>
                    <FormLabel>Cargo</FormLabel>
                    <Input type='text' onChange={handleUserData} name='cargo' p={2} value={userData.cargo} size={['sm', 'md', 'lg']} w='full' />
                  </FormControl>
                  <FormControl id="dataNascimento">
                    <FormLabel>Data de nascimento</FormLabel>
                    <Input type='date' onChange={handleUserData} name='dataNascimento' p={2} value={userData.dataNascimento} size={['sm', 'md', 'lg']} w='full' />
                  </FormControl>
                  <FormControl id="genero">
                    <FormLabel>Gênero</FormLabel>
                    <Select name='genero' onChange={handleUserData} placeholder='Seleccione o seu gênero'>
                      <option value='Masculino'>Masculino</option>
                      <option value='Feminino'>Feminino</option>
                    </Select>
                  </FormControl>

                  <HStack>
                    <FormControl id="email">
                      <FormLabel>Email</FormLabel>
                      <Input type='email' onChange={handleUserData} name='email' p={2} value={userData.email} size={['sm', 'md', 'lg']} w='full' />
                    </FormControl>
                    <FormControl id="telefone">
                      <FormLabel>Telefone</FormLabel>
                      <Input type='tel' onChange={handleUserData} name='telefone' p={2} value={userData.telefone} size={['sm', 'md', 'lg']} w='full' />
                    </FormControl>
                  </HStack>
                </Stack>
                <Stack mt={8} direction={'row'} spacing={4}>
                  <Button
                    fontSize={['xs', 'sm']}
                    rounded={'full'}
                    bg={'blue.400'}
                    color={'white'}
                    onClick={alterarPerfil}
                    isLoading={loading}
                    loadingText='Aguarde por favor enquanto atualizamos'
                    boxShadow={'0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'}
                    _hover={{ bg: 'blue.500' }}
                    _focus={{ bg: 'blue.500' }}>Alterar dados</Button>
                </Stack>
              </Box>
            </SimpleGrid>
          </TabPanel>
          {(user.papeis[0] !== 'ROLE_FUNCIONARIO') && (
            <TabPanel>
              <Box w={['full', '50vw']}
                bg='white'
                boxShadow={'2xl'}
                rounded={'lg'}
                p={6}
              >
                <Stack mt={8} direction={'column'} spacing={4}>
                  <FormControl id="nova_senha">
                    <FormLabel>Senha atual</FormLabel>
                    <Input type='password' onChange={handleMudarSenha} name='palavraPasseAtual' p={2} size={['sm', 'md', 'lg']} w='full' />
                  </FormControl>
                  <FormControl id="senha_confirmacao">
                    <FormLabel>Nova senha</FormLabel>
                    <Input type='password' onChange={handleMudarSenha} name='palavraPasseNova' p={2} size={['sm', 'md', 'lg']} w='full' />
                  </FormControl>
                </Stack>
                <Stack mt={8} direction={'row'} spacing={4}>
                  <Button
                    fontSize={'sm'}
                    rounded={'full'}
                    bg={'blue.400'}
                    color={'white'}
                    loadingText='Aguarde por favor enquanto a senha é atualizada'
                    isLoading={loading}
                    onClick={alterarSenha}
                    boxShadow={'0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'}
                    _hover={{ bg: 'blue.500' }}
                    _focus={{ bg: 'blue.500' }}>Atualizar senha</Button>
                </Stack>
              </Box>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </VStack>
  )
}

export default AreaPerfil