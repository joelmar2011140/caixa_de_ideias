import { FcIdea } from "react-icons/fc";
import { FiList } from 'react-icons/fi'
import { AiOutlineOrderedList, AiOutlineUserAdd, AiOutlineFileSearch, AiFillFileAdd, AiFillDelete } from 'react-icons/ai'
import { BsFillPeopleFill } from 'react-icons/bs'
import { IoBulb } from 'react-icons/io5'
import { RiAdminFill } from 'react-icons/ri'
import { Campo, LinkItemProps, Registo } from "./app.types";
import Joi from 'joi'

export const menuAdmin: Array<LinkItemProps> = [
  {
    nome: 'Ideias',
    icone: IoBulb,
    url: '/ideias',
    path: '/listarideias',
    subMenu: [
      {
        nome: 'Minhas ideias',
        url: '/minhasideias',
        icone: FiList
      }
    ]
  },
  {
    nome: 'Funcionários',
    icone: BsFillPeopleFill,
    url: '/funcionarios',
    path: '/listarfuncionarios'
  }
]

export const menuSuperAdmin: Array<LinkItemProps> = [
  {
    nome: 'Ideias',
    icone: IoBulb,
    url: '/ideias',
    path: '/listarideias',
    subMenu: [
      {
        nome: 'Minhas ideias',
        url: '/minhasideias',
        icone: FiList
      }
    ]
  },
  {
    nome: 'Funcionários',
    icone: BsFillPeopleFill,
    url: '/funcionarios',
    path: '/listarfuncionarios',
  },
  {
    nome: 'Administradores',
    icone: RiAdminFill,
    url: '/admins',
    path: '/'
  }
]

export const menuFuncionario: Array<LinkItemProps> = [
  {
    nome: 'Ideias',
    icone: IoBulb,
    url: '/ideias',
    path: '/listarideias',
    subMenu: [
      {
        nome: 'Minhas ideias',
        url: '/minhasideias',
        icone: FiList
      }
    ]
  },
]

export const RegistoIdeiaSchema = Joi.object<Registo>({
  nome: Joi.string().required().empty().messages({
    'any.required': 'Dê por favor um nome à ideia',
    'string.empty': 'Dê por favor um nome à ideia',
    'string.base': 'Dê por favor um nome à ideia',
  }),
  area: Joi.string().required().empty().messages({
    'any.required': 'Defina a área de atuação para esta ideia',
    'string.empty': 'Defina a área de atuação para esta ideia',
    'string.base': 'Defina a área de atuação para esta ideia'
  }),
  descricao: Joi.string().required().empty().messages({
    'any.required': 'Dê por favor uma descrição à ideia',
    'string.empty': 'Dê por favor uma descrição à ideia',
    'string.base': 'Dê por favor uma descrição à ideia',
  }),
  ficheiro: Joi.any()
})

export const AtualizarUser = Joi.object<Partial<Registo>>({
  cargo: Joi.string().empty().messages({
    'any.required': 'Indique o seu cargo por favor',
    'string.empty': 'Indique o seu cargo por favor',
    'string.base': 'Indique o seu cargo por favor',
  }),
  dataNascimento: Joi.string().empty().messages({
    'any.required': 'Indique a sua data de nascimento por favor',
    'string.empty': 'Indique a sua data de nascimento por favor',
    'string.base': 'Indique a sua data de nascimento por favor',
  }),
  email: Joi.string().email({ tlds: { allow: false } }).empty().messages({
    'any.required': 'Indique o seu email por favor',
    'string.email': 'Indique por favor um email válido',
    'string.empty': 'Indique o seu email por favor',
    'string.base': 'Indique o seu email por favor',
  }),
  genero: Joi.string().empty().messages({
    'any.required': 'Indique por favor o seu género',
    'string.empty': 'Indique por favor o seu género',
    'string.base': 'Indique por favor o seu género',
  }),
  nome: Joi.string().empty().messages({
    'any.required': 'Indique por favor o seu nome',
    'string.empty': 'Indique por favor o seu nome',
    'string.base': 'Indique por favor o seu nome',
  }),
  telefone: Joi.string().empty().messages({
    'any.required': 'Indique por favor o seu telefone',
    'string.empty': 'Indique por favor o seu telefone',
    'string.base': 'Indique por favor o seu telefone',
  }),
})

export const RegistoAdminSchema = Joi.object<Registo>({
  cargo: Joi.string().required().empty().messages({
    'any.required': 'Indique o seu cargo por favor',
    'string.empty': 'Indique o seu cargo por favor',
    'string.base': 'Indique o seu cargo por favor',
  }),
  dataNascimento: Joi.string().required().empty().messages({
    'any.required': 'Indique a sua data de nascimento por favor',
    'string.empty': 'Indique a sua data de nascimento por favor',
    'string.base': 'Indique a sua data de nascimento por favor',
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().empty().messages({
    'any.required': 'Indique o seu email por favor',
    'string.email': 'Indique por favor um email válido',
    'string.empty': 'Indique o seu email por favor',
    'string.base': 'Indique o seu email por favor',
  }),
  genero: Joi.string().required().empty().messages({
    'any.required': 'Indique por favor o seu género',
    'string.empty': 'Indique por favor o seu género',
    'string.base': 'Indique por favor o seu género',
  }),
  nome: Joi.string().required().empty().messages({
    'any.required': 'Indique por favor o seu nome',
    'string.empty': 'Indique por favor o seu nome',
    'string.base': 'Indique por favor o seu nome',
  }),
  telefone: Joi.string().required().empty().messages({
    'any.required': 'Indique por favor o seu telefone',
    'string.empty': 'Indique por favor o seu telefone',
    'string.base': 'Indique por favor o seu telefone',
  }),
  palavraPasse: Joi.string().required().min(6).empty().messages({
    'any.required': 'Indique por favor uma senha',
    'string.empty': 'Indique por favor uma senha',
    'string.base': 'Indique por favor uma senha',
    'string.min': 'Palavra passe deve ter no mínimo 6 carácteres'
  }),
})

export const validarSenha = Joi.object({
  palavraPasseAtual: Joi.string().required().empty().messages({
    'any.required': 'Informe por favor a senha atual',
    'string.base': 'Informe por favor a senha atual',
    'string.empty': 'Informe por favor a senha atual'
  }),
  palavraPasseNova: Joi.string().min(6).required().empty().messages({
    'any.required': 'Informe a senha nova por favor',
    'string.base': 'Informe a senha nova por favor',
    'string.empty': 'Informe a senha nova por favor',
    'string.min': 'Senha deve ter no mínimo 6 cáracteres'
  }),
})

export const dadosRegistoFuncionario: Array<Campo> = [
  {
    field: 'nome',
    titulo: 'Nome do Administrador',
    type: 'text'
  },
  {
    field: 'dataNascimento',
    titulo: 'Data de nascimento do Administrador',
    type: 'date'
  },
  {
    field: 'genero',
    titulo: 'Gênero do Administrador',
  },
  {
    field: 'cargo',
    titulo: 'Cargo do Administrador',
    type: 'text'
  },
  {
    field: 'email',
    titulo: 'Email do Administrador',
    type: 'email'
  },
  {
    field: 'telefone',
    titulo: 'Telefone do Administrador',
    type: 'tel'
  },
  {
    field: 'palavraPasse',
    titulo: 'Senha do Administrador',
    type: 'password'
  },
]