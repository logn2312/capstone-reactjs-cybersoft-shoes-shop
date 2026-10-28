import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  signin,
  signup,
  getProfile,
  updateProfile,
  changePassword,
  getFavorite,
  facebookLogin,
  like,
  unlike,
  deleteOrder,
  uploadAvatar as uploadAvatarApi,
} from '../../services/api.js'
import { getFacebookToken } from '../../services/facebook.js'
import { readLocalAvatar, resizeImage, saveLocalAvatar } from '../../utils/image.js'

export const login = createAsyncThunk('user/login', async (values) => {
  const content = await signin(values)
  if (!content?.accessToken) throw new Error('Không nhận được accessToken từ server')

  const email = content.email ?? values.email
  localStorage.setItem('accessToken', content.accessToken)
  localStorage.setItem('email', email)
  return { token: content.accessToken, email }
})

export const loginFacebook = createAsyncThunk('user/loginFacebook', async () => {
  const facebookToken = await getFacebookToken()
  const content = await facebookLogin(facebookToken)
  if (!content?.accessToken) throw new Error('Không nhận được accessToken từ server')

  localStorage.setItem('accessToken', content.accessToken)
  const email = content.email ?? (await getProfile()).email
  localStorage.setItem('email', email)
  return { token: content.accessToken, email }
})

export const register = createAsyncThunk('user/register', async (values) => {
  const body = { ...values }
  delete body.passwordConfirm
  return signup(body)
})

export const fetchProfile = createAsyncThunk('user/fetchProfile', () => getProfile())

export const WRONG_PASSWORD = 'Mật khẩu hiện tại không đúng'

async function verifyPassword(email, password) {
  try {
    await signin({ email, password })
  } catch {
    throw new Error(WRONG_PASSWORD)
  }
}

export const saveProfile = createAsyncThunk('user/saveProfile', async (values, { dispatch, getState }) => {
  await verifyPassword(getState().user.email, values.password)
  await updateProfile(values)
  return dispatch(fetchProfile()).unwrap()
})

export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async ({ currentPassword, newPassword }, { getState }) => {
    await verifyPassword(getState().user.email, currentPassword)
    return changePassword(newPassword)
  },
)

export const uploadAvatar = createAsyncThunk('user/uploadAvatar', async (file, { getState, dispatch }) => {
  const { email, profile } = getState().user
  const saveLocal = async () => {
    const dataUrl = await resizeImage(file)
    saveLocalAvatar(email, dataUrl)
    return { source: 'local', localAvatar: dataUrl }
  }

  const before = profile?.avatar ?? (await getProfile()).avatar
  try {
    await uploadAvatarApi(file)
  } catch {
    return saveLocal()
  }
  const updated = await dispatch(fetchProfile()).unwrap()
  if (!updated?.avatar || updated.avatar === before) return saveLocal()

  saveLocalAvatar(email, null)
  return { source: 'server', localAvatar: null }
})

export const cancelOrder = createAsyncThunk('user/cancelOrder', async (orderId, { dispatch }) => {
  await deleteOrder(orderId)
  return dispatch(fetchProfile()).unwrap()
})

export const fetchFavorites = createAsyncThunk('user/fetchFavorites', async () => {
  const content = await getFavorite()
  return content?.productsFavorite ?? []
})

export const toggleLike = createAsyncThunk('user/toggleLike', async ({ product, liked }) => {
  if (liked) await unlike(product.id)
  else await like(product.id)
})

const findFavorite = (favorites, id) => favorites.findIndex((p) => String(p.id) === String(id))
export const selectIsLiked = (id) => (state) => findFavorite(state.user.favorites, id) !== -1

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: localStorage.getItem('accessToken'),
    email: localStorage.getItem('email'),
    profile: null,
    favorites: [],
    localAvatar: readLocalAvatar(localStorage.getItem('email')),
    loading: false,
    error: null,
  },
  reducers: {
    removeLocalAvatar: (state) => {
      saveLocalAvatar(state.email, null)
      state.localAvatar = null
    },
    logout: (state) => {
      state.token = null
      state.email = null
      state.profile = null
      state.favorites = []
      state.localAvatar = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('email')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.email = action.payload.email
        state.localAvatar = readLocalAvatar(action.payload.email)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(loginFacebook.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginFacebook.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.email = action.payload.email
        state.localAvatar = readLocalAvatar(action.payload.email)
      })
      .addCase(loginFacebook.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
        localStorage.removeItem('accessToken')
      })
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.error = action.error.message
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.localAvatar = action.payload.localAvatar
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload
      })
      .addCase(toggleLike.pending, (state, action) => {
        const { product, liked } = action.meta.arg
        if (liked) state.favorites.splice(findFavorite(state.favorites, product.id), 1)
        else state.favorites.push({ id: product.id, name: product.name, image: product.image })
      })
      .addCase(toggleLike.rejected, (state, action) => {
        const { product, liked } = action.meta.arg
        if (liked) state.favorites.push({ id: product.id, name: product.name, image: product.image })
        else state.favorites.splice(findFavorite(state.favorites, product.id), 1)
      })
  },
})

export const { logout, removeLocalAvatar } = userSlice.actions
export default userSlice.reducer
