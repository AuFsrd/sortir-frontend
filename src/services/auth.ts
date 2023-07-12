import { setAuthTokens, clearAuthTokens, getAccessToken, getRefreshToken } from 'axios-jwt'
import { client } from './client'
import { User } from '@/models/interfaces';
import { getUser } from './apiRequests';

/**
 * Interface spécifiant le format de l'objet JSON à envoyer au serveur pour l'autentification.
 * Les noms de ces clés sont importants. Ils sont utilisés par Symfony pour l'authentification.
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Fonction de login
 * Envoie l'identifiant et le mot de passe au serveur. Il reçoit un token en retour, qu'il stocke
 * dans le local storage.
 */
export const login = async (params: LoginRequest) => {
  // Requete
  const response = await client.post('login', params, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Enregistrement du token dans le local storage
  setAuthTokens({
    accessToken: response.data.token,
    refreshToken: response.data.refresh_token
  })

  // Charge les données de l'utilisateur une variable et la stocke en session
  const user: User = await getUser(response.data.user);
  sessionStorage.setItem("user", JSON.stringify(user));
}

/**
 * Fonction de logout
 */
export const logout = () => {
  clearAuthTokens()
  sessionStorage.removeItem('user')
}

/**
 * Fonction vérifiant si l'utilisateur est connecté
 * @returns true si l'utilisateur possède un token
 */
export const loggedIn = (): boolean => {
  const token = getAccessToken()
  return !!token;
}

// Get access to tokens
const accessToken = getAccessToken()
const refreshToken = getRefreshToken()