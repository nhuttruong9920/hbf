import { BaseTableRequest } from '@shared/type/api.type';

type CategoryRequest = BaseTableRequest & {
  isDeleted: boolean;
};

type Category = {
  id: number;
  title: string;
  description: string;
  url: string | null;
  tag: string | null;
  visible: boolean;
};

type CategoryCompact = {
  id: number;
  title: string;
  tag: string | null;
};

export { CategoryRequest, Category, CategoryCompact };
