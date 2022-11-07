import {
  Flex,
  Text,
  VStack,
  Badge,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Box,
} from '@chakra-ui/react'
import { FC } from 'react'
import { NotificacoesProps } from "../app.types";
import { MdSettings } from 'react-icons/md'

const Notificacao: FC<NotificacoesProps> = ({ dateHora, texto, estado, id, idIdeia, goTo, eliminar, marcar }) => {
  return (
    <VStack alignItems='flex-start' w={['full', '63vw']} bgColor='white' borderBottom='1px solid silver' p={4}>
      <Menu>
        <MenuButton
          alignSelf='flex-end'
          as={IconButton}
          aria-label='Options'
          padding={2}
          fontSize='xl'
          variant='outline'
        >
          <MdSettings />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => eliminar(id)}>
            Eliminar
          </MenuItem>
          <MenuItem onClick={() => marcar(id)}>
            Marcar como lida
          </MenuItem>
        </MenuList>
      </Menu>
      <Box w='full' cursor='pointer' onClick={() => goTo(id, idIdeia)}>
        <Text>{texto}</Text>
        <Text>
          {(estado === 'NAO_LIDA') ? <Badge colorScheme='red' >Não lida</Badge> : <Badge colorScheme='green'>Lida</Badge>}
        </Text>
      </Box>
    </VStack>
  )
}

export default Notificacao
