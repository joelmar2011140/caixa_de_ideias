import { Box, Button, Spinner, Text, HStack, Input, InputGroup, InputLeftAddon, SimpleGrid, useDisclosure, useToast, VStack, Center, TableContainer, Table, Thead, Tr, Th, Tbody, Td, NumberInput, NumberInputField, NumberIncrementStepper, NumberInputStepper, NumberDecrementStepper, Flex, Divider, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalFooter, ModalHeader, ModalBody } from '@chakra-ui/react'
import { fetchAdmins } from '../lib'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { BsPencil } from 'react-icons/bs'
import { RiDeleteBinLine } from 'react-icons/ri'
import { MdCancel, MdDone } from 'react-icons/md'
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr'
import RegistarAdmin from './RegistarAdmin'
import { useDispatch } from 'react-redux'
import { update } from '../features/usuario'
import Editar from './Editar'
import axios from 'axios'

export default function Listar() {
  const dispatch = useDispatch()
  const toast = useToast()
  const roteador = useRouter()
  const handleEliminar = useDisclosure()
  const handleEditar = useDisclosure()
  const handleAccoes = useDisclosure()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [pagina, setPagina] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [porPagina, setPorPagina] = useState<number>(10)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [elemento, setElemento] = useState<any>({})
  const handleSearchQuery = (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)

  useEffect(() => {
    dispatch(update(elemento))
  }, [elemento, dispatch])

  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
  } = useQuery(['ideias', pagina, porPagina, searchQuery], () => {
    if (searchQuery) {
      return fetchAdmins('query', pagina, porPagina, searchQuery)
    }
    return fetchAdmins('tabela', pagina, porPagina)
  }, { keepPreviousData: true })
  

  const ativar = async (id: number) => {
    try {
      setLoading(true)
      const { data } = await axios.patch(`/api/admins/ativar/${id}`)
      toast({
        description: data.info,
        status: 'success',
        position: 'bottom-right'
      })
      setLoading(false)
      roteador.reload()
    } catch (err: any) {
      if (err.name === 'AxiosError') {
        return toast({
          description: err.response.data.details,
          status: 'error',
          position: 'bottom-right'
        })
      }
    }
  }

  const suspender = async (id: number) => {
    try {
      setLoading(true)
      const { data } = await axios.patch(`/api/admins/suspender/${id}`)
      if (data.info) {
        toast({
          description: data.info,
          status: 'success',
          position: 'bottom-right'
        })
        setLoading(false)
        roteador.reload()
      }
    } catch (err: any) {
      if (err.name === 'AxiosError') {
        return toast({
          description: err.response.data.details,
          status: 'error',
          position: 'bottom-right'
        })
      }
    }
  }

  // Eiminar um admin
  const eliminar = async (id: number) => {
    try {
      setLoading(true)
      const { data } = await axios.delete(`/api/admins/${id}`)
      toast({
        description: data.info,
        status: 'success',
        position: 'bottom-right'
      })
      setLoading(false)
      roteador.reload()
    } catch (err: any) {
      setLoading(false)
      if (err.name === 'AxiosError') {
        return toast({
          description: err.response.data.details,
          status: 'error',
          position: 'bottom-right'
        })
      }
    }
  }


  return (
    <VStack p={3} spacing={12} alignItems='flex-start' w={['90vw', '65vw', '65vw']} maxW='container.lg'>
      <HStack spacing={{ base: 2, md: 24 }} w='full'>
        <Button colorScheme='green' size={['xs', 'md']} onClick={onOpen}>+</Button>
        <InputGroup size={['xs', 'md']}>
          <InputLeftAddon><FaSearch /></InputLeftAddon>
          <Input size={['xs', 'md']} bg='white' w='full' type='search' placeholder='Procure um administrador' onChange={handleSearchQuery} />
        </InputGroup>
      </HStack>
      <SimpleGrid alignItems='flex-start' justifyContent='center' columns={{ base: 1, md: 2 }} spacing={{ base: 2, md: 2, lg: 2 }}>
        <Box
          px={{ base: 4, md: 8 }}
          py={'5'}
          w={{ base: '80vw', md: (Object.keys(elemento).length === 0) ? '60vw' : 'auto' }}
          shadow={'xl'}
          bg='white'
          rounded={'lg'}
          gap={4}
          h='auto'
        >
          <Text textAlign='center' fontWeight='bold' color='blackAlpha.700' fontFamily='monospace' fontSize={['sm', 'md']}>Lista de administradores</Text>
          {
            (isLoading || isFetching) ?
              (<Center mt={8}><Spinner size='xl' /></Center>) : isError ? (<Text colorScheme='red'>Aconteceu um erro inesperado</Text>) : (data.lista.length === 0) ? (<Text colorScheme='blackAlpha'>Sem administradores</Text>) :
                (
                  <TableContainer>
                    <Table border='0px' variant='unstyled' size='sm'>
                      <Thead>
                        <Tr>
                          <Th></Th>
                          <Th></Th>
                          <Th></Th>
                        </Tr>
                      </Thead>
                      <Tbody fontWeight='bold' textAlign='center' fontSize='sm'>
                        {data.lista.map((admin: { nome: string, cargo: string, id: number, estadoFuncionario: string }) => (
                          <Tr key={admin.id} onClick={() => setElemento(admin)} cursor='pointer' >
                            <Td>{admin.nome}</Td>
                            <Td>{admin.cargo}</Td>
                            <Td>
                              <HStack>
                                {admin.estadoFuncionario === 'ACTIVO' ? (<Button size='xs' colorScheme='green' disabled={true}  title='Ativar conta'><MdDone /></Button>) : (<Button  title='Ativar conta' size='xs' colorScheme='green' onClick={() => ativar(admin.id)}><MdDone /></Button>)}
                                {admin.estadoFuncionario === 'SUSPENSO' ? (<Button size='xs' colorScheme='red' disabled={true}  title='Suspender conta'><MdCancel /></Button>) : (<Button  title='Suspender conta' size='xs' colorScheme='red' onClick={() => suspender(admin.id)}><MdCancel /></Button>)}
                                <Button color='white' size='xs' fontWeight='bold' _hover={{ bg: 'orange' }} bg='orange' onClick={handleEditar.onOpen}  title='Editar dados'><BsPencil /></Button>
                                <Button  title='Eliminar conta' color='white' size='xs' fontWeight='bold' _hover={{ bg: 'red' }} bg='red' onClick={handleEliminar.onOpen}><RiDeleteBinLine /></Button>
                              </HStack>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                )
          }
          <Center mt={12}>
            <HStack spacing={6} alignItems='center' w='full' fontSize='sm'>
              <Button size='sm' colorScheme='gray' onClick={() => setPagina(old => Math.max(old - 1, 0))}
                disabled={pagina === 0}><GrLinkPrevious /></Button>
              <Text size={{ base: 'xs', md: 'sm' }}>Página atual: {pagina + 1} </Text>
              <NumberInput size='xs' maxW={16} value={porPagina} defaultValue={10} min={0} onChange={(valorString: string, valrNumero: number) => setPorPagina(valrNumero)}>
                <NumberInputField value={porPagina} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Button size='sm' colorScheme='gray' onClick={() => {
                if (!isPreviousData) {
                  setPagina(old => old + 1)
                }
              }}
                // Disable the Next Page button until we know a next page is available
                disabled={isPreviousData}><GrLinkNext /></Button>
            </HStack>
          </Center>
        </Box>
        {
          (Object.keys(elemento).length !== 0) && (
            <Box
              px={{ base: 4, md: 8 }}
              py={'5'}
              w={{ base: '80vw', md: 'auto' }}
              h={{ base: '50vh', md: '50vh' }}
              shadow={'xl'}
              bg='white'
              rounded={'lg'}
            >
              <Flex w='full' color='blackAlpha.700' flexDir='row' justifyContent='space-between' fontWeight='bold' mb={2} fontSize={['xs', 'sm']}>
                <Text>{elemento.nome}</Text>
                <Text>{elemento.cargo}</Text>
              </Flex>
              <Divider />
              <VStack spacing={4} w='full' alignItems='flex-start' mt={2} fontSize={['xs', 'sm']}>
                <Text>Nome completo: {elemento.nome}</Text>
                <Text>Cargo: {elemento.cargo}</Text>
                <Text>Data de nascimento: {new Date(elemento.dataNascimento).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                <Text>Gênero: {elemento.genero}</Text>
                <Text>Email: {elemento.email}</Text>
                <Text>Telefone: {elemento.telefone}</Text>
                {
                  elemento.genero === 'ACTIVO' ? (<Text colorScheme='green'>{elemento.estado}</Text>) : (<Text colorScheme='red'>{elemento.estado}</Text>)
                }
              </VStack>
            </Box>
          )
        }
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Registar Administrador</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RegistarAdmin />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={handleEliminar.isOpen} onClose={handleEliminar.onClose} >
        <ModalOverlay />
        <ModalContent h='auto'>
          <ModalHeader textAlign='center'>{loading ? 'Aguarde por favor' : 'Tem a certeza que quer eliminar ?'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign='center' h='50vh'>
            {
              loading && (
                <>
                  <Spinner size='xl' />
                  <Text>Eliminado este administrador , espere por favor</Text>
                </>
              )
            }
          </ModalBody>
          {
            !loading && (
              <ModalFooter>
                <Button colorScheme='green' mr={3} onClick={() => eliminar(elemento.id)}>
                  Sim
                </Button>
                <Button colorScheme='red' onClick={handleEliminar.onClose}>Não</Button>
              </ModalFooter>
            )
          }
        </ModalContent>
      </Modal>

      <Modal isOpen={handleEditar.isOpen} onClose={handleEditar.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader p={4} textAlign='center' fontSize={['sm', 'md']}>Editar dados do administrador</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Editar />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={loading} onClose={() => { setLoading(false) }} size={{ base: 'sm', md: 'lg' }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily='mono' textAlign='center' p={4}>Por favor aguarde</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            <VStack spacing={2}>
              <Spinner />
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
}