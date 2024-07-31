type BaseTableRequest = {
  pageIndex: number;
  pageSize: number;
  orderBy: string;
  searchTerm: string;
};

type BaseApiResponse<T> = {
  data: T | null;
  error: { code: number; msg: string } | null;
};

type XPaging = Partial<{
  CurentPage: number;
  TotalPages: number;
  PageSize: number;
  TotalItems: number;
  HasPrevious: boolean;
  HasNext: boolean;
  FirstRowOnPage: number;
  LastRowOnPage: number;
}>;

export { XPaging, BaseTableRequest, BaseApiResponse };
