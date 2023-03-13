import { useContext } from 'react'
import ProductsContext, {UseProductsContext} from '../context/ProductsProvider'

const useProducts = (): UseProductsContext => {
    return useContext(ProductsContext)
}

export default useProducts