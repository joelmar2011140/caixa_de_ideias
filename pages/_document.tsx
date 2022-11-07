import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MeuDocumento extends Document {
  render () {
    return (
      <Html lang='pt-PT'>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}