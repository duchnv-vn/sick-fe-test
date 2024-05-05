import { makeAutoObservable } from 'mobx';
import { UserProfile } from '@auth0/nextjs-auth0/client';
import { UserStoreData } from '../type';

class UserStore {
  user: UserProfile = {} as UserProfile;
  accessToken = '';

  constructor() {
    makeAutoObservable(this);
  }

  setUser = (user: UserProfile) => {
    this.user = user;
  };

  hydrate = ({ user }: UserStoreData) => {
    user && this.setUser(user);
  };

  getUserId = () => {
    if (!this.user?.sub) return null;
    const splittedSub = this.user.sub.split('|');
    return Number(splittedSub[1]);
  };
}

export default UserStore;
