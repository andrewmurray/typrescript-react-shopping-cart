import useCart from "../hooks/useCart"
import useProducts from "../hooks/useProducts"
import { UseProductsContext } from "../context/ProductsProvider"
import { ReactElement } from "react"
import Product from "./Product"

const ProductList = () => {
  const { dispatch, REDUCER_ACTIONS, cart } = useCart()
  const { products } = useProducts()

  let productContent: ReactElement | ReactElement[] = <p>Loading...</p>

  if (products?.length) {
    productContent = products.map(p => {
      const inCart: boolean = cart.some(ci => ci.sku === p.sku)

      return (
        <Product 
          key={p.sku}
          product={p}
          dispatch={dispatch}
          REDUCER_ACTIONS={REDUCER_ACTIONS}
          inCart={inCart} />
      )
    })
  }

  const content = (
    <main className="main main--products">
      {productContent}
    </main>
  ) 

  return content
}

export default ProductList