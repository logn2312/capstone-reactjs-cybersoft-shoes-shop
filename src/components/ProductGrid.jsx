import { useState } from 'react'
import ProductCard from './ProductCard.jsx'

const PAGE_SIZE = 12

export default function ProductGrid({ products, loading, error }) {
  const [visible, setVisible] = useState(PAGE_SIZE)

  if (error) {
    return <p className="grid-empty text-danger">Không tải được sản phẩm: {error}</p>
  }
  if (products.length === 0) {
    return (
      <div className="grid-empty">
        {loading ? (
          <span className="spinner-border spinner-border-sm" aria-label="Loading"></span>
        ) : (
          <>
            <i className="bi bi-search"></i>
            <p>No products found</p>
          </>
        )}
      </div>
    )
  }

  const shown = products.slice(0, visible)

  return (
    <>
      <div className="row g-4">
        {shown.map((p) => (
          <div className="col-6 col-lg-3" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {products.length > PAGE_SIZE && (
        <div className="load-more">
          <p>
            Showing {shown.length} of {products.length} products
          </p>
          <div className="load-more-bar">
            <span style={{ width: `${(shown.length / products.length) * 100}%` }}></span>
          </div>
          {shown.length < products.length && (
            <button type="button" className="btn-pill btn-pill-outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Load more
            </button>
          )}
        </div>
      )}
    </>
  )
}
