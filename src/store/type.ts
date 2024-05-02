import { ThemeModes } from '@/utils/enum/theme';
import { User } from '@/utils/type/user.type';

export type CommonStoreData = {
  mode?: ThemeModes;
};

export type UserStoreData = {
  user?: User;
};
