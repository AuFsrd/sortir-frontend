import axios from 'axios';
import { IAuthTokens, TokenRefreshRequest, applyAuthTokenInterceptor, getBrowserLocalStorage } from 'axios-jwt'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const client = axios.create({
    baseURL: BASE_URL
})

// 2. Define token refresh function.
const requestRefresh: TokenRefreshRequest = async (refreshToken: string): Promise<IAuthTokens | string> => {

  // Important! Do NOT use the axios instance that you supplied to applyAuthTokenInterceptor
  // because this will result in an infinite loop when trying to refresh the token.
  // Use the global axios client or a different instance
  const response = await axios.post(`${BASE_URL}/auth/refresh_token`, { token: refreshToken })

  // If your backend supports rotating refresh tokens, you may also choose to return an object containing both tokens:
  // return {
  //  accessToken: response.data.access_token,
  //  refreshToken: response.data.refresh_token
  //}

  return response.data.access_token
}

// 3. Add interceptor to your axios instance
applyAuthTokenInterceptor(client, { requestRefresh })

// New to 2.2.0+: initialize with storage: localStorage/sessionStorage/nativeStorage. Helpers: getBrowserLocalStorage, getBrowserSessionStorage
const getStorage = getBrowserLocalStorage

// You can create you own storage, it has to comply with type StorageType
applyAuthTokenInterceptor(client, { requestRefresh, getStorage })