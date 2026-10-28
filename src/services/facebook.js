const FB_APP_ID = '599753691700080'

let sdkPromise = null

function loadSdk() {
  if (sdkPromise) return sdkPromise

  sdkPromise = new Promise((resolve, reject) => {
    window.fbAsyncInit = () => {
      window.FB.init({ appId: FB_APP_ID, cookie: true, xfbml: false, version: 'v19.0' })
      resolve(window.FB)
    }
    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/en_US/sdk.js'
    script.async = true
    script.onerror = () => {
      sdkPromise = null
      reject(new Error('Không tải được Facebook SDK (kiểm tra mạng hoặc trình chặn quảng cáo)'))
    }
    document.body.appendChild(script)
  })
  return sdkPromise
}

export async function getFacebookToken() {
  const FB = await loadSdk()
  return new Promise((resolve, reject) => {
    FB.login(
      (response) => {
        if (response.authResponse?.accessToken) resolve(response.authResponse.accessToken)
        else reject(new Error('Bạn đã huỷ đăng nhập Facebook'))
      },
      { scope: 'public_profile,email' },
    )
  })
}
