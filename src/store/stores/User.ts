import { makeAutoObservable } from 'mobx';
import { UserProfile } from '@auth0/nextjs-auth0/client';
import { UserStoreData } from '../type';

class UserStore {
  user: UserProfile = {} as UserProfile;

  constructor() {
    makeAutoObservable(this);
  }

  setUser = (user: UserProfile) => {
    this.user = user;
  };

  hydrate = ({ user }: UserStoreData) => {
    user && this.setUser(user);
  };
}

export default UserStore;
