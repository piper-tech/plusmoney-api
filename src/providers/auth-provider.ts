export interface AuthData {
  accessToken: string;
}

export interface AuthenticationProvider {
  auth(id: number): Promise<AuthData>
  verify(accessToken: string): Promise<any | boolean>
}
