export interface User {
  id: string;
  email: string;
  fullname: string;
  isActive: boolean;
  role: 'admin' | 'client' | 'agent';
  //createdAt: Date;
  //updatedAt: Date;
}
