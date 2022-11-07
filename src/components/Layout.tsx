import { FC } from 'react'
import Head from 'next/head'
import { LayoutProps } from '../app.types'
import SidebarWithHeader from './SidebarWithHeader'

const Layout:FC<LayoutProps> = ({ children, titulo }) => {
  return (
    <>
      <Head>
        <meta charSet='utf-8'/>
        <meta name='description' content='Caixa de ideias, submeta as tuas ideias e deixe o mundo fluir a partir delas' />
        <meta name='keywords' content='caixa de ideias, ideias, angola, proit consulting angola' />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="HandheldFriendly" content="true" />
        <title>Caixa de ideias -  {titulo}</title>
      </Head>
      <SidebarWithHeader>{children}</SidebarWithHeader>
    </>
  )
}

export default Layout