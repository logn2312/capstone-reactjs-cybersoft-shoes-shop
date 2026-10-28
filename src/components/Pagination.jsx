function getPages(current, total) {
  const nums = [...new Set([1, 2, current, total - 1, total])]
    .filter((n) => n >= 1 && n <= total)
    .sort((a, b) => a - b)

  const pages = []
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) pages.push(`gap-${n}`)
    pages.push(n)
  })
  return pages
}

export default function Pagination({ current, total, onChange }) {
  return (
    <div className="pagination-ui d-flex justify-content-center gap-2">
      <button
        className="page-btn"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        aria-label="Previous page"
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      {getPages(current, total).map((p) =>
        typeof p === 'string' ? (
          <span className="page-btn page-gap" key={p}>...</span>
        ) : (
          <button
            key={p}
            className={`page-btn ${p === current ? 'active' : ''}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ),
      )}

      <button
        className="page-btn"
        disabled={current === total}
        onClick={() => onChange(current + 1)}
        aria-label="Next page"
      >
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  )
}
