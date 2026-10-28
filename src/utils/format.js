const IMG_BASE = 'https://shop.cyberlearn.vn/images/'

const SHOE_FILES = [
  'van-old-school.png',
  'converse-chuck-taylor.png',
  'nike-adapt-bb.png',
  'nike-air-max-270-react.png',
  'nike-air-max-97.png',
  'nike-air-max-97-blue.png',
  'nike-flyknit.png',
  'nike-react-element.png',
  'nike-shox-tl.png',
  'nike-sp-dunk.png',
  'adidas-prophere.png',
  'adidas-prophere-black-white.png',
  'adidas-prophere-customize.png',
  'adidas-super-star-red.png',
  'adidas-swift-run.png',
  'adidas-tenisky-super-star.png',
  'adidas-ultraboost-4.png',
  'adidas-yeezy-350.png',
]

const REAL_IMAGE = /^https:\/\/shop\.cyberlearn\.vn\/images\/[\w-]+\.(png|jpe?g|webp)$/i

export const isOriginalProduct = (product) => REAL_IMAGE.test(product?.image ?? '')

export function getProductImage(src, seed = 0) {
  if (src && REAL_IMAGE.test(src)) return src
  const n = typeof seed === 'number' ? seed : [...String(seed)].reduce((sum, c) => sum + c.charCodeAt(0), 0)
  return IMG_BASE + SHOE_FILES[Math.abs(n) % SHOE_FILES.length]
}

export function getCategoryIds(product) {
  let list = product?.categories ?? []
  if (typeof list === 'string') {
    try {
      list = JSON.parse(list)
    } catch {
      return []
    }
  }
  return Array.isArray(list) ? list.map((c) => c.id).filter(Boolean) : []
}

export const formatCategory = (id) =>
  id.toLowerCase().replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())

export function formatPrice(price) {
  return `${Number(price).toLocaleString('en-US')}$`
}
