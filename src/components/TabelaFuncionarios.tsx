import { ChangeEvent } from 'react'
import { useRouter } from 'next/router'
import {
  TableContainer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody, Table, Th, Tr, Thead, Flex, Center, Spinner, Text, VStack, Button, Input, Tbody, Td, HStack, SimpleGrid, NumberInputField, NumberInput, NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper, useToast
} from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { useState } from 'react'
import { accoesFuncionario, fetchFuncionarios } from '../lib'
import { MdDone, MdCancel, MdDelete } from 'react-icons/md'
import { GrLinkPrevious, GrLinkNext } from 'react-icons/gr'
import { FaEdit } from 'react-icons/fa'
import Registar from './Registar'
import EditarFuncionario from './EditarFuncionario'
import { Registo } from '../app.types'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { update } from '../features/usuario'

export default function TabelaFuncionarios() {
  const toast = useToast()
  const dispatch = useDispatch()
  const roteador = useRouter()
  const [funcionario, setFuncionario] = useState<Registo>({ cargo: '', dataNascimento: '', email: '', genero: '', nome: '', telefone: '' })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loadingEdit, setLoadingEdit] = useState<boolean>(false)
  const [loadHandler, setLoadHandler] = useState<boolean>(false)
  const [pagina, setPagina] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [porPagina, setPorPagina] = useState<number>(10)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const handleSearchQuery = (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)

  const aoMudar = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFuncionario({ ...funcionario, [e.target.name]: e.target.value })

  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
  } = useQuery(['ideias', pagina, porPagina, searchQuery], () => {
    if (searchQuery) {
      return fetchFuncionarios('query', pagina, porPagina, searchQuery)
    }
    return fetchFuncionarios('tabela', pagina, porPagina)
  }, { keepPreviousData: true })


  // Atualizar um funcionário
  const atualizarFuncionario = async () => {
    try {
      setLoadHandler(true)
      const { data } = await axios.put<{ info: '' }>(`/api/funcionarios/${funcionario.id}`, funcionario)
      if (data) {
        toast({
          status: 'success',
          position: 'bottom-right',
          description: data.info
        })
        dispatch(update({}))
        setLoadHandler(false)
        roteador.reload()
        return
      }
    } catch (err: any) {
      setLoadHandler(false)
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


  const eliminar = async (id: number) => {
    try {
      setLoading(true)
      const data = await accoesFuncionario('eliminar', id)
      if (data?.data.info) {
        toast({
          description: 'Funcionário eliminado com sucesso',
          status: 'success',
          position: 'bottom-right'
        })
        setLoading(false)
        roteador.reload()
      }
    } catch (err: any) {
      switch (err.name) {
        case 'AxiosError':
          if (err.response.data) {
            return toast({
              description: err.response.data,
              status: 'error',
              position: 'bottom-right'
            })
          }
          break
      }
    }
  }

  const ativar = async (id: number) => {
    try {
      setLoading(true)
      const data = await accoesFuncionario('ativar', id)
      if (data?.data.info) {
        toast({
          description: 'Conta de funcionário ativada com sucesso',
          status: 'success',
          position: 'bottom-right'
        })
        setLoading(false)
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

  const suspender = async (id: number) => {
    try {
      setLoading(true)
      const data = await accoesFuncionario('suspender', id)
      if (data?.data.info) {
        toast({
          description: 'Conta suspensa com sucesso',
          status: 'success',
          position: 'bottom-right'
        })
        setLoading(false)
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

  return (
    <Center>
      <VStack boxShadow='lg' color='blackAlpha.800' bg='white' borderRadius='md' p={4} maxW='100%' w={['100%', '80vw']} alignItems='flex-start'>
        <Flex gap={8} w='full' p={4} justifyContent='space-between'>
          <Button colorScheme='green' size={['sm', 'md']} onClick={onOpen}>+</Button>
          <Input name='searchQuery' w='full' size={['sm', 'md']} type='search' placeholder='Pesquise um funcionário pelo nome ou cargo' onChange={handleSearchQuery} />
        </Flex>
        <Text fontWeight='bold' fontSize={['sm', 'md']} fontFamily='monospace'>Funcionários registados</Text>
        <VStack fontWeight='bold' w='full' p={4} spacing={2} alignItems='center'>
          {
            isLoading || isFetching ?
              (<Spinner />) : isError ? (<Text>Erro</Text>) : (data.lista.length === 0) ? (<Text>Sem funcionários por enquanto</Text>) : (
                <TableContainer w='full' fontSize='sm' h='auto'>
                  <Table variant='simple' size='sm' fontSize='xs' >
                    <Thead>
                      <Tr>
                        <Th>ID</Th>
                        <Th>Nome</Th>
                        <Th>Email</Th>
                        <Th>Telefone</Th>
                        <Th>Gênero</Th>
                        <Th>Data de nascimento</Th>
                        <Th>Cargo</Th>
                        <Th>Estado da conta</Th>
                        <Th>Ações</Th>
                      </Tr>
                    </Thead>
                    <Tbody >
                      {
                        data.lista.map((funcionario: { id: number, estadoFuncionario: string, nome: string, email: string, telefone: string, genero: string, dataNascimento: string, cargo: string }) => (
                          <Tr key={funcionario.id} >
                            <Td>{funcionario.id}</Td>
                            <Td>{funcionario.nome}</Td>
                            <Td>{funcionario.email}</Td>
                            <Td>{funcionario.telefone}</Td>
                            <Td>{funcionario.genero}</Td>
                            <Td>{funcionario.dataNascimento}</Td>
                            <Td>{funcionario.cargo}</Td>
                            <Td>{funcionario.estadoFuncionario}</Td>
                            <Td>
                              <HStack alignItems='center'>
                                {(funcionario.estadoFuncionario !== 'ACTIVO') ? (<Button size='sm' colorScheme='green' onClick={() => ativar(funcionario.id)} title='Ativar conta'><MdDone /></Button>) : (<Button size='sm' title='Ativar conta' colorScheme='green' disabled={true}><MdDone /></Button>)}
                                {(funcionario.estadoFuncionario !== 'SUSPENSO') ? (<Button size='sm' colorScheme='red' onClick={() => suspender(funcionario.id)} title='Suspender conta'><MdCancel /></Button>) : (<Button size='sm' disabled={true} title='Suspender conta'><MdCancel /></Button>)}
                                <Button title='Editar dados' size='sm' colorScheme='orange' onClick={() => {
                                  setFuncionario(funcionario)
                                  setLoadingEdit(true)
                                }} ><FaEdit /></Button>
                                <Button title='Eliminar conta' size='sm' colorScheme='gray' onClick={() => eliminar(funcionario.id)}><MdDelete /></Button>
                              </HStack>
                            </Td>
                          </Tr>
                        ))
                      }
                    </Tbody>
                  </Table>
                </TableContainer>
              )
          }
          <Center>
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
                disabled={isPreviousData}><GrLinkNext /></Button>
            </HStack>
          </Center>
        </VStack>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'sm', md: 'lg' }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar um funcionário</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            <Registar />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={loading} onClose={() => setLoading(false)} size={{ base: 'sm', md: 'lg' }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily='mono' textAlign='center' p={4}>Por favor aguarde</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6} h='auto'>
            <VStack spacing={2}>
              <Spinner />
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={loadingEdit} onClose={() => setLoadingEdit(false)} size={{ base: 'sm', md: 'lg' }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily='mono' textAlign='center' p={4}>Editar dados de funcionário</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6}>
            <EditarFuncionario aoMudar={aoMudar} {...funcionario} />
            <Button mt={4} size={['sm', 'md']} isLoading={loadHandler} onClick={atualizarFuncionario} loadingText='Aguarde por favor' colorScheme='green'>Alterar dados</Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Center >
  )
}