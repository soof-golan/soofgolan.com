import Footer from './footer'
import Meta, {Props as MetaProps} from './meta'

type Props = {
  preview?: boolean
  children: React.ReactNode
  metaProps: MetaProps
}

const Layout = ({preview, children, metaProps}: Props) => {
  return (
    <>
      <Meta imageUrl={metaProps.imageUrl} postExcept={metaProps.postExcept}/>
      <div className="min-h-screen">
        <main>{children}</main>
      </div>
      <Footer/>
    </>
  )
}

export default Layout
