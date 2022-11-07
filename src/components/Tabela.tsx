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
  IconButton,
  MenuList,
  MenuItem,
  ModalBody, Table, Th, Tr, Thead, Flex, Center, Spinner, Text, VStack, Button, Input, Tbody, Td, HStack, SimpleGrid, NumberInputField, NumberInput, NumberInputStepper, NumberDecrementStepper, NumberIncrementStepper, useToast, Menu, MenuButton, Badge
} from '@chakra-ui/react'
import { MdSettings } from 'react-icons/md'
import { useQuery } from 'react-query'
import { useState } from 'react'
import { accoes, fetchIdeias } from '../lib'
import { MdDone, MdCancel, MdDelete, MdDownload } from 'react-icons/md'
import { GrLinkPrevious, GrLinkNext } from 'react-icons/gr'
import NextLink from 'next/link'
import Dropzone from './DropZone'
import { useSelector } from 'react-redux'
import { RootState } from '../features/store'

export default function Tabela() {
  const { user } = useSelector((estado: RootState) => (estado.auth))
  const toast = useToast()
  const roteador = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const accoesDisclosure = useDisclosure()
  const [pagina, setPagina] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [porPagina, setPorPagina] = useState<number>(10)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const handleSearchQuery = (e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)

  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
  } = useQuery(['ideias', pagina, porPagina, searchQuery], () => {
    if (searchQuery) {
      return fetchIdeias('query', pagina, porPagina, searchQuery)
    }
    return fetchIdeias('tabela', pagina, porPagina)
  }, { keepPreviousData: true })

  const eliminar = async (id: number) => {
    try {
      setLoading(true)
      const data = await accoes('eliminar', id)
      if (data?.data.info) {
        toast({
          description: 'Ideia eliminada',
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

  const aprovar = async (id: number) => {
    try {
      setLoading(true)
      const data = await accoes('aprovar', id)
      if (data?.data.info) {
        toast({
          description: 'Ideia aprovada',
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

  const rejeitar = async (id: number) => {
    try {
      setLoading(true)
      const data = await accoes('rejeitar', id)
      if (data?.data.info) {
        toast({
          description: 'Ideia rejeitada',
          status: 'success',
          position: 'bottom-right'
        })
        setLoading(false)
        roteador.reload()
      }
    } catch (err: any) {
      console.log('Aqui: ', err);
    }
  }


  return (
    <Center>
      <VStack boxShadow='lg' color='blackAlpha.800' bg='white' borderRadius='md' p={4} maxW='100%' w={['100%', '80vw']} alignItems='flex-start'>
        <Flex gap={8} w='full' p={4} justifyContent='space-between'>
          <Button colorScheme='green' size={['sm', 'md']} onClick={onOpen}>+</Button>
          <Input name='searchQuery' w='full' size={['sm', 'md']} type='search' placeholder='Pesquisar uma ideia' onChange={handleSearchQuery} />
        </Flex>
        <Text fontWeight='bold' fontSize={['sm', 'md']} fontFamily='monospace'>Ideias registadas</Text>
        <VStack fontWeight='bold' w='full' p={4} spacing={2} alignItems='center'>
          {
            isLoading || isFetching ?
              (<Spinner />) : isError ? (<Text>Erro</Text>) : (data.lista.length === 0) ? (<Text>Sem ideias por enquanto</Text>) : (
                <TableContainer w='full' fontSize='sm' h='auto'>
                  <Table variant='simple' size='sm' fontSize='xs' >
                    <Thead>
                      <Tr>
                        <Th>Nome da ideia</Th>
                        <Th>Submetida por</Th>
                        <Th>Área</Th>
                        <Th>Estado</Th>
                        <Th>Data</Th>
                        {(user.papeis[0] === 'ROLE_MASTER_ADMIN' || user.papeis[0] === 'ROLE_ADMIN') && (<Th>Ações</Th>)}
                      </Tr>
                    </Thead>
                    <Tbody >
                      {
                        data.lista.map((ideia: { id: number, url: string, nome: string, emailUtilizador: string, area: string, estadoIdeia: string, dataPublicacao: string }) => (
                          <Tr key={ideia.id} >
                            <Td cursor='pointer' _hover={{ color: 'blue', textDecoration: 'underline' }} onClick={() => roteador.push(`/ideias/${ideia.id}`)}>{ideia.nome}</Td>
                            <Td>{ideia.emailUtilizador}</Td>
                            <Td>{ideia.area}</Td>
                            <Td>{ideia.estadoIdeia === 'REJEITADA' ? (<Badge p={2} colorScheme='red'>{ideia.estadoIdeia}</Badge>) : <Badge p={2} colorScheme={(ideia.estadoIdeia === 'APROVADA') ? 'green' : 'orange'}>{ideia.estadoIdeia}</Badge>}</Td>
                            <Td>{ideia.dataPublicacao}</Td>
                            {
                              (user.papeis[0] === 'ROLE_MASTER_ADMIN' || user.papeis[0] === 'ROLE_ADMIN') && (
                                <Td>
                                  <Menu>
                                    <MenuButton
                                      alignSelf='flex-end'
                                      as={IconButton}
                                      aria-label='Options'
                                      padding={2}
                                      fontSize='xl'
                                      variant='outline'
                                    ><MdSettings /></MenuButton>
                                    <MenuList fontSize='lg'>
                                      <MenuItem onClick={() => aprovar(ideia.id)} isDisabled={(ideia.estadoIdeia === 'APROVADA')}>Aprovar ideia</MenuItem>
                                      <MenuItem onClick={() => rejeitar(ideia.id)} isDisabled={(ideia.estadoIdeia === 'REJEITADA')}>Rejeitar ideia</MenuItem>
                                      <MenuItem onClick={() => eliminar(ideia.id)}>Eliminar ideia</MenuItem>
                                      <NextLink href={ideia.url} passHref>
                                        <MenuItem>Fazer download da ideia</MenuItem>
                                      </NextLink>
                                    </MenuList>
                                  </Menu>
                                </Td>
                              )
                            }
                          </Tr>
                        ))
                      }
                    </Tbody>
                  </Table>
                </TableContainer>
              )
          }
          <Center>
            <HStack spacing={6} alignItems='center' justifyContent='space-between' w='full' fontSize='sm'>
              <Text>Total de ideias:  {data && data.totalElementos}</Text>
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
        </VStack>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'sm', md: 'lg' }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Adicionar uma ideia</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Dropzone />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={loading} onClose={() => setLoading(false)} size={{ base: 'sm', md: 'lg' }}>
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
    </Center>
  )
}