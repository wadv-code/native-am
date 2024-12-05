// 请求参数
export type GetItemsParams = {
  name?: string;
  page: number;
  password: string;
  path: string;
  per_page: number;
  refresh?: boolean;
  scrollName?: string;
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
  sign?: string;
  size?: number;
  thumb?: string;
  type?: number;
  cover?: string;
  onPress?: (option: GetItemsResItem, index?: number) => void;
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
  mode: number;
};

export type GetCoverRes = {
  code: number;
  url: string;
};
