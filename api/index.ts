// 请求参数
export type GetItemsParams = {
  name?: string;
  page: number;
  path: string;
  per_page: number;
  refresh?: boolean;
  keywords?: string;
  password?: string;
};

export type GetSearchParams = {
  page: number;
  per_page: number;
  keywords: string;
  parent: string;
  refresh?: boolean;
};

export type GetItemsResItem = {
  id: string;
  name: string;
  raw_url?: string;
  parent?: string;
  created?: string;
  hash_info?: object | null;
  hashinfo?: string;
  is_dir?: boolean;
  modified?: string;
  modifiedFormat?: string;
  sign?: string;
  size?: number;
  sizeFormat?: string;
  thumb?: string;
  type?: number;
  cover?: string;
};

// 请求参数
export type GetItemsRes = {
  content: GetItemsResItem[];
  page: number;
  header: string;
  provider: string;
  readme: string;
  total: number;
  write: boolean;
};

export type GetDetailParams = {
  password?: string;
  path: string;
};

export type GetDetailRes = {
  raw_url: string;
};

export type GetCoverParams = {
  type: string;
  mode: number | string;
};

export type GetCoverRes = {
  code: number;
  url: string;
};
