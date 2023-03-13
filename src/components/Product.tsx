import { ProductType } from "../context/ProductsProvider"
import { ReducerActionType, ReducerAction } from "../context/CartProvider"
import { ReactElement, memo } from "react"

const currencyFormatter = new Intl.NumberFormat('en-GB', {style:'currency',currency:'GBP'})

type PropsType = {
    product: ProductType,
    dispatch: React.Dispatch<ReducerAction>,
    REDUCER_ACTIONS: ReducerActionType,
    inCart: boolean,
}

const Product = ({product, dispatch, REDUCER_ACTIONS, inCart}: PropsType): ReactElement => {
  
  const img: string = new URL(`../images/${product.sku}.jpg`, import.meta.url).href
  
  const onAddToCart = () => dispatch({
    type: REDUCER_ACTIONS.ADD,
    payload: { ...product, quantity: 1 }
  })

  const itemInCart = inCart ? '→ Item in cart: ✅' : null

  const content =
    <article className="product">
      <h3>{product.name}</h3>
      <img src={img} alt={product.name} className="product__img" />
      <p>{currencyFormatter.format(product.price)} {itemInCart}</p>
      <button onClick={onAddToCart}>Add to Cart</button>
    </article>

  return content
}

function areItemsEqual(
  {product: prevItem, inCart: prevInCart}: PropsType,
  {product: nextItem, inCart: nextInCart}: PropsType) {
  return Object.keys(prevItem).every(key => {
      let k = key as keyof ProductType;
      return prevItem[k] === nextItem[k] && prevInCart === nextInCart;
  })
}

const MemoizedProduct = memo<typeof Product>(Product, areItemsEqual)

export default MemoizedProduct