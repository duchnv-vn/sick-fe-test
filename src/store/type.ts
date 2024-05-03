import { UserProfile } from '@auth0/nextjs-auth0/client';
import { ThemeModes } from '@/utils/enum/theme';

export type CommonStoreData = {
  mode?: ThemeModes;
};

export type UserStoreData = {
  user?: UserProfile;
};
