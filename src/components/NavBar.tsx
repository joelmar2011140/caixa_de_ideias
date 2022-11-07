import { FC, useState } from 'react'
import NextLink from 'next/link'
import { LinkItemProps, NavItemProps } from '../app.types'
import { Flex, Text, Icon, HStack, Link } from '@chakra-ui/react';


const NavBar: FC<LinkItemProps> = ({ icone, nome, url, subMenu, path }) => {
  const [subnav, setSubnav] = useState<boolean>(false);
  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      {
        path ? (
          <NextLink href={url + path}>
              <Flex _hover={{ cursor: 'pointer', backgroundColor: '#0c2461', color: 'white' }} color='black' justify='space-between' alignItems='center' fontSize='16px' textDecoration='none' listStyleType='none' h='60px' p='20px' justifyContent='flex-start' onClick={subMenu && showSubnav}>
                <HStack>
                  <Icon as={icone}></Icon>
                  <Text ml='16px'>{nome}</Text>
                </HStack>
              </Flex>
          </NextLink>
        ) :
          (<Flex _hover={{ cursor: 'pointer', backgroundColor: '#0c2461', color: 'white' }} color='black' justify='space-between' alignItems='center' fontSize='16px' textDecoration='none' listStyleType='none' h='60px' p='20px' justifyContent='flex-start' onClick={subMenu && showSubnav}>
            <HStack>
              <Icon as={icone}></Icon>
              <Text ml='16px'>{nome}</Text>
            </HStack>
          </Flex>)
      }
      {
        subnav && subMenu?.map((ite: LinkItemProps, j: number) => (
          <Flex p={2} key={j} alignItems='center' ml='2rem' color='black' _hover={{ cursor: 'pointer', backgroundColor: '#0c2461', color: 'white' }}>
            <NextLink passHref href={url + ite.url}>
              <Link>
                <HStack>
                  <Icon as={ite.icone}></Icon>
                  <Text ml='16px'>{ite.nome}</Text>
                </HStack>
              </Link>
            </NextLink>
          </Flex>
        ))
      }
    </>
  )
}

export default NavBar