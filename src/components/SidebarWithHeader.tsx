import NextLink from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../features/store';
import React, { ReactNode, useEffect, useCallback } from 'react';

import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Badge,
} from '@chakra-ui/react';
import {
  FiMenu,
  FiBell,
  FiChevronDown,
} from 'react-icons/fi';
import NavBar from './NavBar';
import { menuAdmin, menuFuncionario, menuSuperAdmin } from '../app.data';
import { useRouter } from 'next/router';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { pusher } from '../lib/pusher.service'
import { setNotificacao } from '../features/notificacaoHandle';
import axios from 'axios'
import { LinkItemProps } from '../app.types';
import { FaSignOutAlt } from 'react-icons/fa';

export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue('white.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const dispatch = useDispatch()
  const roteador = useRouter()
  const { papeis } = useSelector((state: RootState) => (state.auth.user))
  const { cargo, nome, pusher_id } = useSelector((state: RootState) => (state.auth.user))
  const role = papeis[0]
  let Menu: ReactJSXElement | any
  switch (role) {
    case 'ROLE_ADMIN':
      Menu = menuAdmin.map((item: LinkItemProps, i: number) => (<NavBar key={i}  {...item} />))
      break
    case 'ROLE_MASTER_ADMIN':
      Menu = menuSuperAdmin.map((item: LinkItemProps, i: number) => (<NavBar key={i}  {...item} />))
      break
    default:
      Menu = menuFuncionario.map((item: LinkItemProps, i: number) => (<NavBar key={i}  {...item} />))
      break
  }

  const handleTerminarSessao = async () => {
    if (typeof window !== 'undefined') {
      pusher(pusher_id).then((resp) => {
        resp.pusherCliente.clearAllState().then(() => {
          console.log('Reiniciando tudo...');
        })
      })
    }
    dispatch(setNotificacao({}))
    await fetch('/api/auth/logout', {
      method: 'DELETE'
    })
    localStorage.clear()
    roteador.replace('/login')
  }

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      overflowY='auto'
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <NextLink passHref href='/'>
          <Text fontSize="lg" fontFamily="monospace" fontWeight="bold" cursor='pointer'>
            💡Caixa de ideias
          </Text>
        </NextLink>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {Menu}
      <Text>
        <HStack cursor='pointer' p={2} ml={4} display={{ base: 'flex', md: 'none' }} onClick={handleTerminarSessao}>
          <FaSignOutAlt />
          <Text ml='16px'>Terminar sessão</Text>
        </HStack>
      </Text>
    </Box>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const dispatch = useDispatch()
  const { totalNaoLidas, dateHora, estado, id, idIdeia, texto }: any = useSelector((estado: RootState) => (estado.notificacao))
  const totalNotificacoes = (totalNaoLidas > 100) ? `${String(totalNaoLidas).slice(0, 2)}...` : totalNaoLidas

  const roteador = useRouter()
  const { isOpen, onClose } = useDisclosure()

  const { cargo, nome, pusher_id } = useSelector((state: RootState) => (state.auth.user))

  const fetchNaoLidas = useCallback(async () => {
    const { data } = await axios.get<{ totalNaoLidas: number }>('http://localhost:3535/api/notificacoes/naolidas')
    if (data.totalNaoLidas) {
      dispatch(setNotificacao({ totalNaoLidas: data.totalNaoLidas }))
    }
  }, [dispatch])

  useEffect(() => {
    fetchNaoLidas()
  }, [fetchNaoLidas])

  const handleTerminarSessao = async () => {
    if (typeof window !== 'undefined') {
      pusher(pusher_id).then((resp) => {
        resp.pusherCliente.clearAllState().then(() => {
          console.log('Reiniciando tudo...');
        })
      })
    }
    dispatch(setNotificacao({}))
    fetch('http://localhost:3535/api/auth/logout', {
      method: 'DELETE'
    }).then(() => {
      localStorage.clear()
      roteador.replace('/login')
    })
  }

  const handleNotificacoes = () => {
    roteador.replace('/notificacoes')
  }

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={4}
      maxW='100%'
      height="20"
      w='auto'
      alignItems="center"
      bg={useColorModeValue('#0c2467', 'gray.900')}
      color={{ base: 'white', md: 'black' }}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize={["md", '2xl']}
        fontFamily="monospace"
        fontWeight="bold">
        💡Caixa de ideias 
      </Text>

      <HStack spacing={{ base: '0', md: '6' }} w='auto'>
        <VStack spacing='-3' alignItems='flex-end' w='auto' justifyContent='flex-end' >
          <Badge bgColor='red' fontSize='xs' color='white'>{totalNotificacoes ? totalNotificacoes : ''}</Badge>
          <IconButton
            onClick={handleNotificacoes}
            size="lg"
            variant="ghost"
            aria-label="open menu"
            _hover={{ color: 'white', bg: '' }}
            color='white'
            fontSize='2xl'
            icon={<FiBell />}
          />
        </VStack>

        <Flex alignItems={'center'} w='auto'>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  color='white'
                  ml="2">
                  <Text fontSize="sm">{nome}</Text>
                  <Text fontSize="xs" color="white">
                    {cargo}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }} color='white'>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem onClick={() => roteador.push('/perfil')}>Meu perfil</MenuItem>
              <MenuItem onClick={handleTerminarSessao}>Terminar sessão</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};