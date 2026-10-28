import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from './ProductCard.jsx'
import { fetchProducts, selectRecommendations } from '../redux/slices/productSlice.js'
import { formatCategory } from '../utils/format.js'

const CATEGORY_ROUTES = { NIKE: '/nike', ADIDAS: '/adidas' }

export default function Recommendations({ className = '' }) {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.user.token)
  const hasProducts = useSelector((state) => state.product.list.length > 0)
  const { categories, products } = useSelector(selectRecommendations)

  useEffect(() => {
    if (token && !hasProducts) dispatch(fetchProducts())
  }, [token, hasProducts, dispatch])

  if (!token || products.length === 0) return null

  return (
    <section className={className}>
      <div className="section-head">
        <div>
          <p className="eyebrow">
            Because you like {categories.slice(0, 2).map(formatCategory).join(' & ')}
          </p>
          <h2 className="section-title">Recommended for you</h2>
        </div>
        {categories[0] && (
          <Link to={CATEGORY_ROUTES[categories[0]] ?? '/search'} className="btn-pill btn-pill-outline btn-pill-sm">
            Explore more <i className="bi bi-arrow-right"></i>
          </Link>
        )}
      </div>
      <div className="row g-4">
        {products.map((p) => (
          <div className="col-6 col-lg-3" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  )
}
