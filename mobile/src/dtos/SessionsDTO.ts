export interface User {
  avatar: string
  created_at: string
  email: string
  id: string
  name: string
  tel: string
  updated_at: string
}

export interface ISession {
  refresh_token: string
  token: string
  user: User
}
