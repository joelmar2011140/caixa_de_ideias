import axios from 'axios'

export const accoesFuncionario = async (tipo: 'ativar' | 'suspender' | 'eliminar' | 'editar', id: number) => {
  try {
    switch (tipo) {
      case 'ativar':
        if (id !== 0) {
          const { data, status } = await axios.patch<{ info: string }>(`/api/funcionarios/ativar/${id}`)
          return { data, status }
        }
        break
      case 'eliminar':
        if (id !== 0) {
          const { data, status } = await axios.delete<{ info: string }>(`/api/funcionarios/eliminar/${id}`)
          return { data, status }
        }
        break
      case 'suspender':
        if (id !== 0) {
          const { data, status } = await axios.patch<{ info: string }>(`/api/funcionarios/suspender/${id}`)
          return { data, status }
        }
        break
      case 'editar':
        if (id !== 0) {
          const { data, status } = await axios.delete<{ info: string }>(`/api/funcionarios/editar/${id}`)
          return { data, status }
        }
        break
    }
  } catch (err: any) {
    console.error(err)
  }
}

export const accoesAdmin = async (tipo: 'ativar' | 'suspender' | 'eliminar', id: number) => {
  try {
    switch (tipo) {
      case 'ativar':
        if (id !== 0) {
          const { data, status } = await axios.patch<{ info: string }>(`/api/admins/ativar/${id}`)
          return { data, status }
        }
        break
      case 'eliminar':
        if (id !== 0) {
          const { data, status } = await axios.delete<{ info: string }>(`/api/admins/${id}`)
          return { data, status }
        }
        break
      case 'suspender':
        if (id !== 0) {
          try {
            const { data, status } = await axios.patch<{ info: string }>(`/api/admins/suspender/${id}`)
            return { data, status }
          } catch (err: any) {
            throw err
          }
        }
        break
    }
  } catch (err: any) {
    console.error(err)
  }
}


export const accoes = async (tipo: 'aprovar' | 'rejeitar' | 'eliminar', id: number) => {
  try {
    switch (tipo) {
      case 'aprovar':
        if (id !== 0) {
          const { data, status } = await axios.put<{ info: string }>(`/api/ideias/aprovar/${id}`)
          return { data, status }
        }
        break
      case 'eliminar':
        if (id !== 0) {
          const { data, status } = await axios.delete<{ info: string }>(`/api/ideias/eliminar/${id}`)
          return { data, status }
        }
        break
      case 'rejeitar':
        if (id !== 0) {
          const { data, status } = await axios.patch<{ info: string }>(`/api/ideias/rejeitar/${id}`)
          return { data, status }
        }
        break
    }
  } catch (err: any) {
    console.error(err)
  }
}

export const fetchIdeias = async (tipo: 'tabela' | 'query', pagina: number, porPagina: number, searchQuery?: string) => {
  try {
    switch (tipo) {
      case 'tabela':
        const { data } = await axios.get(`/api/ideias?page=${pagina}&size=${porPagina}`)
        return data
      case 'query':
        if (searchQuery) {
          const { data } = await axios.get(`/api/ideias/filtros?search_query=${searchQuery}&page=${pagina}&size=${porPagina}`)
          return data
        }
        break
    }
  } catch (err: any) {
    console.error(err)
  }
}


export const fetchFuncionarios = async (tipo: 'tabela' | 'query', pagina: number, porPagina: number, searchQuery?: string) => {
  try {
    switch (tipo) {
      case 'tabela':
        const { data } = await axios.get(`/api/funcionarios?page=${pagina}&size=${porPagina}`)
        return data
      case 'query':
        if (searchQuery) {
          const { data } = await axios.get(`/api/funcionarios/filtros?search_query=${searchQuery}&page=${pagina}&size=${porPagina}`)
          return data
        }
        break
    }
  } catch (err: any) {
    console.error(err)
  }
}


export const fetchAdmins = async (tipo: 'tabela' | 'query', pagina: number, porPagina: number, searchQuery?: string) => {
  try {
    switch (tipo) {
      case 'tabela':
        const { data } = await axios.get(`/api/admins?page=${pagina}&size=${porPagina}`)
        return data
      case 'query':
        if (searchQuery) {
          const { data } = await axios.get(`/api/admins/filtros?search_query=${searchQuery}&page=${pagina}&size=${porPagina}`)
          return data
        }
        break
    }
  } catch (err: any) {
    console.error(err)
  }
}