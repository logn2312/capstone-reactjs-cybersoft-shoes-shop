import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsLiked, toggleLike } from '../redux/slices/userSlice.js'
import { formatPrice } from '../utils/format.js'
import ProductImage from './ProductImage.jsx'

export default function ProductCard({ product }) {
  const liked = useSelector(selectIsLiked(product.id))
  const token = useSelector((state) => state.user.token)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLike = () => {
    if (!token) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    dispatch(toggleLike({ product, liked }))
  }

  return (
    <div className="product-card h-100">
      <div className="product-media">
        <Link to={`/detail/${product.id}`} className="product-img-wrap">
          <ProductImage src={product.image} alt={product.name} seed={product.id} className="product-img" />
        </Link>
        <button
          type="button"
          className={`btn-like ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <i className={`bi ${liked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
        </button>
      </div>

      <div className="product-info d-flex align-items-end justify-content-between gap-3">
        <div className="min-w-0">
          <h3 className="product-name text-truncate">{product.name}</h3>
          <p className="product-desc text-truncate">{product.shortDescription || ' '}</p>
          {product.price != null && <p className="product-price">{formatPrice(product.price)}</p>}
        </div>
        <Link to={`/detail/${product.id}`} className="btn-buy" aria-label="Buy now" title="Buy now">
          <i className="bi bi-bag-plus"></i>
        </Link>
      </div>
    </div>
  )
}
