export interface IUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: Role;
  hashedRefreshToken: string;
  hashedPassword: string;
  address: IAddress;
  createdAt: Date;
  addressId: number;
  posts: string[];
}

interface IAddress {
  city: string;
  country: string;
  street: string;
}

enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
