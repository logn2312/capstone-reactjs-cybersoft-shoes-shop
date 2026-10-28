import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'
import ProductGrid from '../components/ProductGrid.jsx'
import SortSelect from '../components/SortSelect.jsx'
import { searchProducts } from '../redux/slices/productSlice.js'
import { formatCategory, getCategoryIds } from '../utils/format.js'

const ALL = 'ALL'

export default function Search() {
  const dispatch = useDispatch()
  const { searchResults, loading, error } = useSelector((state) => state.product)
  const [keyword, setKeyword] = useState('')
  const [searched, setSearched] = useState('')
  const [sort, setSort] = useState('decrease')
  const [category, setCategory] = useState(ALL)

  useEffect(() => {
    dispatch(searchProducts(''))
  }, [dispatch])

  const categoryCounts = _.countBy(searchResults.flatMap(getCategoryIds))
  const activeCategory = categoryCounts[category] ? category : ALL

  const filtered =
    activeCategory === ALL
      ? searchResults
      : searchResults.filter((p) => getCategoryIds(p).includes(activeCategory))

  const results = _.orderBy(filtered, ['price'], [sort === 'decrease' ? 'desc' : 'asc'])

  const handleSubmit = (e) => {
    e.preventDefault()
    const value = keyword.trim()
    setSearched(value)
    dispatch(searchProducts(value))
  }

  return (
    <section className="page-section pt-4">
      <div className="container-xl">
        <div className="page-head">
          <p className="eyebrow">Find your pair</p>
          <h1 className="page-title">Search</h1>
          <form className="search-bar" onSubmit={handleSubmit} role="search">
            <i className="bi bi-search"></i>
            <input
              id="keyword"
              aria-label="Search"
              placeholder="Search product name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit" className="btn-pill" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="chips mt-3" role="group" aria-label="Filter by category">
              {[ALL, ...Object.keys(categoryCounts).sort()].map((id) => (
                <button
                  type="button"
                  key={id}
                  className={`chip ${activeCategory === id ? 'active' : ''}`}
                  aria-pressed={activeCategory === id}
                  onClick={() => setCategory(id)}
                >
                  {id === ALL ? 'All' : formatCategory(id)}
                  <span className="chip-count">{id === ALL ? searchResults.length : categoryCounts[id]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="toolbar">
          <p className="result-count">
            {results.length} results
            {searched && <> for <strong>“{searched}”</strong></>}
            {activeCategory !== ALL && <> in <strong>{formatCategory(activeCategory)}</strong></>}
          </p>
          <SortSelect value={sort} onChange={setSort} />
        </div>

        <ProductGrid key={`${searched}|${activeCategory}`} products={results} loading={loading} error={error} />
      </div>
    </section>
  )
}
