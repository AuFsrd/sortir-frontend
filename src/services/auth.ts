import { isLoggedIn, setAuthTokens, clearAuthTokens, getAccessToken, getRefreshToken } from 'axios-jwt'
import { client } from './client'
import { User } from '@/models/interfaces';
import { getUser } from './api-requests';

export interface LoginRequest {
  username: string;
  password: string;
}

export let user: User;

// 4. Post email and password and get tokens in return. Call setAuthTokens with the result.
export const login = async (params: LoginRequest) => {
  const response = await client.post('login', params, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // save tokens to storage
  setAuthTokens({
    accessToken: response.data.token,
    refreshToken: response.data.refresh_token
  })
  user = await getUser(response.data.user);
}

// 5. Remove the auth tokens from storage
export const logout = () => clearAuthTokens()

// Check if refresh token exists
if (isLoggedIn()) {
  // assume we are logged in because we have a refresh token
}

export const loggedIn = (): boolean => {
  const token = getAccessToken()
  return !!token;
}

// Get access to tokens
const accessToken = getAccessToken()
const refreshToken = getRefreshToken()