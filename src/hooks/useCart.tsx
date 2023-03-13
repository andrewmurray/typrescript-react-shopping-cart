import { useContext } from 'react'
import CartContext, {UseCartContext} from '../context/CartProvider'

const useCart = (): UseCartContext => {
    return useContext(CartContext)
}

export default useCart