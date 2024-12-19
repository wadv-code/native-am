import Storage from "react-native-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storage = new Storage({
  // 最大容量, 默认 1000 key-ids
  size: 1000,
  // 使用 AsyncStorage 或 window.localStorage
  storageBackend: AsyncStorage,
  // 数据过期时间, 默认 1 天(86400 秒)
  defaultExpires: 1000 * 3600 * 24,
  // 启用后台同步
  enableCache: true,
  // 你可以在构造函数这里就写好sync的方法
  // sync: {
  //   // ...
  // },
});

// 最好在全局范围内创建一个(且只有一个)storage实例,方便直接调用
export { storage };
