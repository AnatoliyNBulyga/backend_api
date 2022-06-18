export interface IUser {
  id: number | string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  hashedRefreshToken: string;
  hashedPassword: string;
}
