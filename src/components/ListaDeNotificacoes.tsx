import {
  Text, Divider,
  Heading,
  Button,
  VStack,
  Spinner,
  Box,
  SimpleGrid,
  useToast,
  Center
} from '@chakra-ui/react'
import Notificacao from './Notificacao'
import { useQuery } from 'react-query'
import InfiniteScroll from "react-infinite-scroll-component";
import axios from 'axios';
import { NotificacoesProps } from '../app.types'
import { useDispatch, useSelector } from 'react-redux';
import { setNotificacao } from '../features/notificacaoHandle';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';

export default function ListarNotificacoes() {
  const [notificacoes, setNotificacoes] = useState<Array<any>>([])
  const roteador = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()

  const fetchNaoLidas = useCallback(async () => {
    const { data } = await axios.get<{ totalNaoLidas: number }>('http://localhost:3535/api/notificacoes/naolidas')
    if (data.totalNaoLidas) {
      dispatch(setNotificacao({
        totalNaoLidas: data.totalNaoLidas,
      }))
    }
  }, [dispatch])

  useEffect(() => {
    fetchNaoLidas()
  }, [fetchNaoLidas])

  const fetchNotificacoes = async () => {
    const { data } = await axios.get('/api/notificacoes')
    // Especificar as notificações não lidas
    return data
  }

  const { isFetching, data, isFetched }: any = useQuery(['notificacoes'], fetchNotificacoes, {
    refetchOnWindowFocus: true,
    staleTime: 0,
    cacheTime: 0,
    refetchInterval: 0,
  })

  // Marcar e eliminar e go to
  const eliminar = (id: string | number) => {
    if (id) {
      axios.delete<{ info: string }>(`/api/notificacoes/${id}`).then(async (data) => {
        // Buscar todas as notificações
        const dados = await axios.get('/api/notificacoes')
        if (dados.data) {
          setNotificacoes(dados.data.lista)
          const dadosNotify = await axios.get<{ totalNaoLidas: number }>('http://localhost:3535/api/notificacoes/naolidas')
          if (dadosNotify.data) {
            dispatch(setNotificacao({ totalNaoLidas: dadosNotify.data.totalNaoLidas }))
          }
        }
      })
    }
  }

  const marcar = (id: string | number) => {
    if (id) {
      axios.patch<{ info: string }>(`/api/notificacoes/lidas/${id}`).then(async (data) => {
        // Buscar todas as notificações
        const dados = await axios.get('/api/notificacoes')
        if (dados.data) {
          setNotificacoes(dados.data.lista)
          const dadosNotify = await axios.get<{ totalNaoLidas: number }>('http://localhost:3535/api/notificacoes/naolidas')
          if (dadosNotify.data) {
            dispatch(setNotificacao({ totalNaoLidas: dadosNotify.data.totalNaoLidas }))
          }
        }
      })
    }
  }

  const goTo = (id: string | number, idIdeia: string | number) => {
    marcar(id)
    roteador.push(`http://localhost:3535/ideias/${idIdeia}`)
  }

  return (
    <VStack spacing={4} alignItems='flex-start' maxW='container.lg' w={['90vw', '65vw']} p={2}>
      <Heading fontFamily='monospace' fontWeight='semibold' color='blackAlpha.700' textAlign={['center', 'left']}>Notificações</Heading>
      {/* <SimpleGrid columns={[1, 2]} spacing={[2, 4]}>
        <Button size={['xs', 'sm']} fontSize={['xs', 'sm']} colorScheme='red' onClick={eliminarNotificacoes}>Eliminar todas as notificações</Button>
        <Button size={['xs', 'sm']} fontSize={['xs', 'sm']} colorScheme='orange' onClick={lerNotificacoes}>Marcar todas como lidas</Button>
      </SimpleGrid> */}
      {loading && (<Center><Spinner size='lg' /></Center>)}
      <Divider color='silver' />
      {
        notificacoes.length > 0 ? (
          <InfiniteScroll hasMore={isFetching} dataLength={data.lista.length} next={isFetching} loader={<Text>Carregando mais notificações</Text>}>
            {
              notificacoes.map((notify: NotificacoesProps) => (
                <Notificacao {...notify} key={notify.id} marcar={marcar} eliminar={eliminar} goTo={goTo} />
              ))
            }
          </InfiniteScroll>
        ) :
          isFetching ? (<Spinner alignSelf='center' size='lg' />) : (data.lista.length === 0) ? (<Text>Ooops sem notificações</Text>) : (
            <InfiniteScroll hasMore={isFetching} dataLength={data.lista.length} next={isFetching} loader={<Text>Carregando mais notificações</Text>}>
              {
                data.lista.map((notify: NotificacoesProps) => (
                  <Notificacao {...notify} key={notify.id} marcar={marcar} eliminar={eliminar} goTo={goTo} />
                ))
              }
            </InfiniteScroll>
          )
      }
    </VStack>
  )
}