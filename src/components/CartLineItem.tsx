import { ChangeEvent, ReactElement, memo } from "react"
import { CartItem } from "../context/CartProvider"
import { ReducerAction, ReducerActionType } from "../context/CartProvider"

type PropsType = {
    item: CartItem,
    dispatch: React.Dispatch<ReducerAction>,
    REDUCER_ACTIONS: ReducerActionType
}

const currencyFormatter = new Intl.NumberFormat('en-GB', {style:'currency',currency:'GBP'})

const CartLineItem = ({ item, dispatch, REDUCER_ACTIONS }: PropsType) => {
    const img: string = new URL(`../images/${item.sku}.jpg`, import.meta.url).href

    const lineTotal: number = item.price * item.quantity

    const highestQty = 20 > item.quantity ? 20 : item.quantity

    const optionValues: number[] = [ ...Array(highestQty).keys() ].map(i => i + 1)

    const options: ReactElement[] = optionValues.map(v => 
        <option key={`qtyopt${v}`} value={v}>{v}</option>)

    const onChangeQty = (e: ChangeEvent<HTMLSelectElement>) => {
        dispatch({
            type: REDUCER_ACTIONS.QUANTITY,
            payload: { ...item, quantity: Number(e.target.value) }
        })
    }

    const onRemoveFromCart = () => {
        dispatch({
            type: REDUCER_ACTIONS.REMOVE,
            payload: item
        })
    }

    const content = (
        <li className="cart__item">
            <img src={img} alt={item.name} className="cart_img" />
            <div aria-label="Item name">{item.name}</div>
            <div aria-label="Price per item">{currencyFormatter.format(item.price)}</div>

            <label htmlFor="itemQty" className="offscreen">
                Item quantity
            </label>
            <select
                name="itemQty" id="itemQty"
                className="cart__select"
                value={item.quantity}
                aria-label="Item quantity"
                onChange={onChangeQty}>
                {options}
            </select>

            <div className="cart__item-subtotal" aria-label="Line item sub total">
                {currencyFormatter.format(lineTotal)}
            </div>

            <button
                className="cart__button"
                aria-label="Remove item from cart"
                title="Remove item from cart"
                onClick={onRemoveFromCart}>
                ❌
            </button>
        </li>
    )

    return content
}

function areItemsEqual(
    {item: prevItem}: PropsType,
    {item: nextItem}: PropsType) {
    return Object.keys(prevItem).every(key => {
        let k = key as keyof CartItem;
        return prevItem[k] === nextItem[k];
    })
}

const MemoizedCartLineItem = memo<typeof CartLineItem>(CartLineItem, areItemsEqual)

export default MemoizedCartLineItem