import { Box, FormLabel, Select, FormControl, Input, HStack } from '@chakra-ui/react';
import { FC } from 'react'
import { Registo } from "../app.types";

interface FormularioProps extends Registo {
  aoMudar: any
}

const Formulario:FC<FormularioProps> = ({ aoMudar, cargo, dataNascimento, email, genero, nome, telefone, palavraPasse }) => {
  return (
    <Box w='full'>
      <FormControl isRequired>
        <FormLabel>Nome</FormLabel>
        <Input isRequired name='nome' onChange={aoMudar} type='text' value={nome} />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input isRequired name='email' onChange={aoMudar} type='email' value={email} />
      </FormControl>
      <HStack w='full'>
        <FormControl isRequired>
          <FormLabel>Gênero</FormLabel>
          <Select name='genero' value={genero} onChange={aoMudar} placeholder='Seleccione o seu gênero'>
            <option value='Masculino'>Masculino</option>
            <option value='Feminino'>Feminino</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Data de nascimento</FormLabel>
          <Input isRequired name='dataNascimento' onChange={aoMudar} type='date' value={dataNascimento} />
        </FormControl>
      </HStack>
      <HStack>
        <FormControl isRequired>
          <FormLabel>Cargo</FormLabel>
          <Input isRequired name='cargo' onChange={aoMudar} type='text' value={cargo} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Telefone</FormLabel>
          <Input isRequired name='telefone' onChange={aoMudar} type='tel' value={telefone} />
        </FormControl>
      </HStack>
      <FormControl isRequired>
        <FormLabel>Palavra passe</FormLabel>
        <Input isRequired name='palavraPasse' onChange={aoMudar} type='password' value={palavraPasse} />
      </FormControl>
    </Box>
  )
}

export default Formulario