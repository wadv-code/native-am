/**
 * mitt 事件类型定义
 *
 * @method onAudioChange 音乐传递
 */
export type MittType<T = any> = {
  onAudioChange?: T;
};

// mitt 参数类型定义
export type LayoutMobileResize = {
  layout: string;
  clientWidth: number;
};

// mitt 参数菜单类型
export type MittMenu = {
  children: RouteItem[];
  item?: RouteItem;
};
