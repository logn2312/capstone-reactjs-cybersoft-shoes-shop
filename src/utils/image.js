export const MAX_AVATAR_SIZE = 5 * 1024 * 1024

export function resizeImage(file, size = 256) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const side = Math.min(img.width, img.height)
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      canvas
        .getContext('2d')
        .drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Không đọc được file ảnh'))
    }
    img.src = url
  })
}

const avatarKey = (email) => `avatar:${email}`

export const readLocalAvatar = (email) => (email ? localStorage.getItem(avatarKey(email)) : null)

export function saveLocalAvatar(email, dataUrl) {
  if (dataUrl) localStorage.setItem(avatarKey(email), dataUrl)
  else localStorage.removeItem(avatarKey(email))
}
