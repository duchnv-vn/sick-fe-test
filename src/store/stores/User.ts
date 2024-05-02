import { makeAutoObservable } from 'mobx';
import { UserStoreData } from '../type';
import { User } from '@/utils/type/user.type';

class UserStore {
  user: User = {} as User;

  constructor() {
    makeAutoObservable(this);
  }

  setUser = (user: User) => {
    this.user = user;
  };

  hydrate = ({ user }: UserStoreData) => {
    user && this.setUser(user);
  };
}

export default UserStore;
