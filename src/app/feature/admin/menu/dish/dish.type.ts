import { BaseTableRequest } from '@shared/type/api.type';
import { CategoryCompact } from '../category/category.type';

type DishRequest = BaseTableRequest & {
  isDeleted: boolean;
};

type Dish = {
  categories: CategoryCompact[];
  id: string;
  title: string;
  description: string;
  price: {
    originalPrice: number;
    currentPrice: number;
  };
  unit: string;
  url: string | null;
  tag: string | null;
  visible: boolean;
  quantity?: number;
};

type DishCompact = {
  id: string;
  price: {
    originalPrice: number;
    currentPrice: number;
  };
  title: string;
};

export { DishRequest, Dish, DishCompact };
