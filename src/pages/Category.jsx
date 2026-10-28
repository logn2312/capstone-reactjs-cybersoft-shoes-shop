import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import ProductGrid from '../components/ProductGrid.jsx'
import SortSelect from '../components/SortSelect.jsx'
import { fetchProductsByCategory } from '../redux/slices/productSlice.js'

const CHIPS = [
  { label: 'Men', to: '/men' },
  { label: 'Woman', to: '/woman' },
  { label: 'Nike', to: '/nike' },
  { label: 'Adidas', to: '/adidas' },
  { label: 'Kid', to: '/kid' },
  { label: 'Sport', to: '/sport' },
]

export default function Category({ title, categoryId = '' }) {
  const dispatch = useDispatch()
  const { categoryProducts, loading, error } = useSelector((state) => state.product)
  const [sort, setSort] = useState('decrease')

  useEffect(() => {
    dispatch(fetchProductsByCategory(categoryId))
    window.scrollTo(0, 0)
  }, [categoryId, dispatch])

  const products = _.orderBy(categoryProducts, ['price'], [sort === 'decrease' ? 'desc' : 'asc'])

  return (
    <section className="page-section pt-4">
      <div className="container-xl">
        <div className="page-head">
          <p className="eyebrow">Collection</p>
          <h1 className="page-title">{title}</h1>
          <nav className="chips">
            {CHIPS.map((c) => (
              <NavLink to={c.to} className="chip" key={c.to}>
                {c.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="toolbar">
          <p className="result-count">{loading ? 'Loading...' : `${products.length} products`}</p>
          <SortSelect value={sort} onChange={setSort} />
        </div>

        <ProductGrid key={title} products={products} loading={loading} error={error} />
      </div>
    </section>
  )
}
