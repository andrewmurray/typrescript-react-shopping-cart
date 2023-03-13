import { useMemo, useReducer, createContext, ReactElement } from "react"

export type CartItem = {
    sku: string,
    name: string,
    price: number,
    quantity: number
}

type CartState = { cart: CartItem[] }

const initCartState: CartState = { cart: [] }

const REDUCER_ACTION_TYPE = {
    ADD: "ADD",
    REMOVE: "REMOVE",
    QUANTITY: "QUANTITY",
    SUBMIT: "SUBMIT"
}

export type ReducerActionType = typeof REDUCER_ACTION_TYPE

export type ReducerAction = {
    type: string,
    payload?: CartItem
}

const reducer = (state: CartState, action: ReducerAction): CartState => {
    switch (action.type) {
        case REDUCER_ACTION_TYPE.ADD: {
            if (!action.payload) {
                throw new Error(`action.payload missing in ${action.type} action`)
            }
            const { sku, name, price } = action.payload
            const filteredCart = state.cart
                .filter(item => item.sku !== sku)

            const item = state.cart
                .find(item => item.sku === sku)

            const quantity = item ? item.quantity + 1 : 1

            return { ...state, cart: [ ...filteredCart, { sku, name, price, quantity }]}
        }
        case REDUCER_ACTION_TYPE.REMOVE: {
            if (!action.payload) {
                throw new Error(`action.payload missing in ${action.type} action`)
            }

            const { sku } = action.payload
            const filteredCart = state.cart
                .filter(item => item.sku !== sku)

            return { ...state, cart: [ ...filteredCart ]}
        }
        case REDUCER_ACTION_TYPE.QUANTITY: {
            if (!action.payload) {
                throw new Error(`action.payload missing in ${action.type} action`)
            }
            const { sku, quantity } = action.payload
            const filteredCart = state.cart
                .filter(item => item.sku !== sku)

            const item = state.cart
                .find(item => item.sku === sku)

            if (!item) {
                throw new Error('Item must exist in order to update quantity')
            }

            const updatedItem = { ...item, quantity }

            return { ...state, cart: [ ...filteredCart, updatedItem ]}
        }
        case REDUCER_ACTION_TYPE.SUBMIT:
            return { ...state, cart: [] }
        
        default:
            throw new Error('Unidentified reducer action type')
    }
}

const useCartContext = (initCartState: CartState) => {
    const [state, dispatch] = useReducer(reducer, initCartState)

    const REDUCER_ACTIONS = useMemo(() => {
        return REDUCER_ACTION_TYPE
    }, [])

    const totalItems = state.cart.reduce((prev, item) => {
        return prev + item.quantity
    }, 0)

    const totalPriceValue = state.cart.reduce((prev, item) => {
        return prev + item.quantity * item.price
    }, 0)

    const totalPrice = Intl
        .NumberFormat('en-GB', {style: 'currency', currency: 'GBP'})
        .format(totalPriceValue)

    const cart = state.cart.sort((a, b) => {
        return a.name.localeCompare(b.name);
    })

    return { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, cart: state.cart }
}

export type UseCartContext = ReturnType<typeof useCartContext>

const initCartContextState: UseCartContext = {
    dispatch: () => {},
    REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
    totalItems: 0,
    totalPrice: '',
    cart: [],
}

const CartContext = createContext<UseCartContext>(initCartContextState)

type ChildrenType = { children?: ReactElement | ReactElement[] }

export const CartProvider = ({ children }: ChildrenType ): ReactElement => {
    return (
        <CartContext.Provider value={useCartContext(initCartState)}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContext