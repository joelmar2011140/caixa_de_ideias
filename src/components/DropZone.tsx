import { Box, useToast, useColorModeValue, Text, HStack, Input, Textarea, VStack, Button } from '@chakra-ui/react'
import { useState, ChangeEvent, useRef } from 'react'
import axios from 'axios'
import { RegistoIdeiaSchema } from '../app.data'
import { useRouter } from 'next/router'

const MyUploader = () => {
  const roteador = useRouter()
  const inputRef = useRef<any>();
  const [loading, setLoading] = useState<boolean>(false)
  const [ideiaFields, setIdeiaFields] = useState<{ nome: string, descricao: string, area: string }>({ nome: '', descricao: '', area: '' })
  const toast = useToast()
  const [nomeFicheiro, setNomeFicheiro] = useState('')
  const [ficheiro, setFicheiro] = useState<File>()

  const handleIdeiaChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setIdeiaFields({ ...ideiaFields, [e.target.name]: e.target.value })

  const handleFicheiro = (e: ChangeEvent<HTMLInputElement | any>) => {
    setFicheiro(e.target.files[0])
    if (e.target.files[0]) {
      setNomeFicheiro(e.target.files[0].name)
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const dadosIdeia = await RegistoIdeiaSchema.validateAsync(ideiaFields)
      const form = new FormData()
      if (typeof ficheiro !== 'undefined') {
        form.append('nome', dadosIdeia.nome)
        form.append('descricao', dadosIdeia.descricao)
        form.append('area', dadosIdeia.area)
        form.append('ficheiro', ficheiro, ficheiro?.name)
        if (ficheiro?.type !== 'application/pdf') {
          setLoading(false)
          return toast({
            description: 'Submeta por favor um ficheiro .pdf',
            status: 'error',
            position: 'bottom-right'
          })
        }
        if (ficheiro.size > 5242880) {
          setLoading(false)
          return toast({
            description: 'Submeta por favor um ficheiro com um tamnho inferior à 5MB',
            status: 'error',
            position: 'bottom-right'
          })
        }
        const { data, status } = await axios.post<{ info: string }>('/api/ideias', form)
        if (status === 200) {
          setLoading(false)
          toast({
            status: 'success',
            position: 'bottom-right',
            description: 'Ideia registada com sucesso'
          })
          roteador.reload()
          return
        }
      }
    } catch (err: any) {
      switch (err.name) {
        case 'ValidationError':
          err.details.map((err: any) => {
            return toast({
              status: 'error',
              position: 'bottom-right',
              description: err.message
            })
          })
          break
        case 'AxiosError':
          return toast({
            status: 'error',
            position: 'bottom-right',
            description: err.response.data.details,
            size: '200px'
          })
      }
    }
  }

  return (
    <>
      <Box
        maxW={{ base: '640px', md: '100vw', lg: '640px' }}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        p={6}
        gap={4}
      >
        <Text textAlign='center'>Preencha correctamente todos os dados</Text>
        <HStack mt={4} spacing={4} w='full'>
          <Input type="text" placeholder="Nome da ideia" size='sm' name='nome' onChange={handleIdeiaChange} w='full' />
          <Input type="text" placeholder="Área para esta ideia" size='sm' name='area' onChange={handleIdeiaChange} w='full' />
        </HStack>
        <Textarea resize='both' rows={0}  mt={4} placeholder='Descrição para esta ideia' name='descricao' onChange={handleIdeiaChange} mb={4} />
        <VStack spacing={4} w='full'>
          <Input type='file' name='file' size='md' accept='application/pdf' onChange={handleFicheiro} ref={inputRef} style={{ display: 'none' }} />
          <Input
            placeholder={nomeFicheiro || "Clique aqui para carregar o ficheiro que contém a sua ideia ..."}
            onClick={() => inputRef.current.click()}
          />
          <Button fontSize='sm' loadingText='Por favor aguarde enquanto a ideia é registada' isLoading={loading} isDisabled={!ficheiro && true} colorScheme='telegram' onClick={handleSubmit}>Submeter ideia</Button>
        </VStack>
      </Box>
    </>
  )
}

export default MyUploader