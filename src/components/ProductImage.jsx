import { useState } from 'react'
import { getProductImage } from '../utils/format.js'

export default function ProductImage({ src, alt, seed, className = '' }) {
  const url = getProductImage(src, seed ?? alt)
  const [failedUrl, setFailedUrl] = useState(null)

  if (failedUrl === url) {
    return (
      <span className={`${className} img-fallback`} role="img" aria-label={alt}>
        <i className="bi bi-image"></i>
      </span>
    )
  }
  return <img src={url} alt={alt} className={className} onError={() => setFailedUrl(url)} />
}
