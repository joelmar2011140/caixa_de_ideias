import { ReactNode } from "react";
import { IconType } from "react-icons";

export type TAuth = {
  erro?: LoginRespostaErro,
  user: {
    nome: string,
    genero: string,
    cargo: string,
    dataNascimento: string,
    telefone: string,
    email: string,
    role: string,
    estado: string,
    papeis: Array<string>,
    pusher_id: string
  }
}

export type RegistoT = {
  cargo: string
  dataNascimento: string
  email: string
  genero: string
  nome: string
  telefone: string
  palavraPasse: string
}

export type TComponenteListar = {
  data: any
  tipo: 'admin' | 'funcionarios' 
}

export interface LinkItemProps {
  nome: string;
  icone: IconType;
  url: string
  subMenu?: Array<LinkItemProps>
  path?: string
}

export type LayoutProps = {
  titulo: string
  children: ReactNode
}

export type RegistarProps = {
  tipo: 'funcionario' | 'admin'
}

export type Campo = {
  field: string
  type?: string
  titulo: string
}

export type NavItemProps = {
  lista: Array<LinkItemProps>
}

export type LoginResposta = {
  token_acesso: string,
  dataExpiracao: string,
  papeis: string[]
}

export type LoginRespostaErro = {
  status: number,
  message: string,
  details: string,
}

export type LoginCredentials = {
  email: string
  palavraPasse: string
}

export type Registo = {
  id?: number
  cargo: string
  dataNascimento: string
  email: string
  genero: string
  nome: string
  telefone: string
  palavraPasse?: string,
  area?: string
  descricao?: string
  ficheiro?: File
}

export interface TabelaIdeiasProps {
  lista: any
}

export interface NotificacoesProps {
  dateHora: string,
  estado: string,
  id: number,
  idIdeia: any
  texto: string
  totalNaoLidas?: number
  eliminar: (id: string | number) => void
  marcar: (id: string | number) => void
  goTo: (id: string | number, idIdeia: string | number) => void
}