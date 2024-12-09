import type { GetItemsResItem } from "@/api";
import type { MaterialIconsName } from "@/types";
import dayjs, { type ConfigType } from "dayjs";

// token
export const TokenKey = "Authorization";

/**
 * 毫秒转时分秒格式
 * @param ms 毫秒
 * @returns
 */
export function formatMilliseconds(ms?: number): string {
  if (!ms) return "00:00";
  // 1 second is 1000 milliseconds
  const seconds = Math.floor((ms / 1000) % 60);
  // 1 minute is 60 seconds
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  // 1 hour is 60 minutes
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  // Format hours, minutes, and seconds with leading zeros if needed
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  // return string
  const result: string[] = [formattedMinutes, formattedSeconds];
  // hours
  if (hours) result.unshift(formattedHours);
  return result.join(":");
}

/**
 * 判断一个字符串是否是通过JSON.stringify转换而来
 * @param str
 * @returns
 */
export function isStringifiedJSON(str: string | null) {
  try {
    if (!str) return null;
    const jsonObj = JSON.parse(str);
    // 检查解析结果是否为对象或数组，因为JSON.stringify通常将对象或数组转为字符串
    return jsonObj && (typeof jsonObj === "object" || Array.isArray(jsonObj));
  } catch (e) {
    // 如果解析失败，说明不是有效的JSON字符串
    return false;
  }
}

/**
 * 定义一个函数来计算并格式化时间差
 * @param date
 * @returns
 */
export function formatTimeAgo(date: ConfigType) {
  const now = dayjs(); // 当前时间
  const past = dayjs(date); // 过去的时间
  const diffInSeconds = now.diff(past, "second"); // 计算时间差（秒）

  // 根据时间差的大小来返回不同的字符串
  if (diffInSeconds < 60) {
    return "刚刚";
  } else if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}分钟前`;
  } else if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}小时前`;
  } else if (diffInSeconds < 2592000) {
    // 30天以内
    return `${Math.floor(diffInSeconds / 86400)}天前`;
  } else if (diffInSeconds < 31536000) {
    // 1年以内
    return `${Math.floor(diffInSeconds / (86400 * 30))}个月前`;
  } else {
    return `${Math.floor(diffInSeconds / 31536000)}年前`;
  }
}

/**
 * 是否是图片格式
 * @param fileName
 * @returns
 */
export function isImageFile(fileName: string): boolean {
  // 定义一个正则表达式，匹配常见的图片文件扩展名（不区分大小写）
  const imageExtensionRegex = /\.(jpeg|jpg|png|gif|bmp|svg|tiff|webp)$/i;

  // 使用正则表达式的 test 方法来检查文件名
  return imageExtensionRegex.test(fileName);
}

/**
 * 是否是音频格式
 * @param fileName
 * @returns
 */
export function isAudioFile(fileName: string): boolean {
  // 定义一个正则表达式，匹配常见的音频文件扩展名（不区分大小写）
  const audioExtensionRegex = /\.(mp3|wav|ogg|flac|aac|m4a|wma|aiff|au)$/i;

  // 使用正则表达式的 test 方法来检查文件名
  return audioExtensionRegex.test(fileName);
}

export type FnIconSymbol = (
  name: string,
  is_dir?: boolean
) => MaterialIconsName;

/**
 * 根据名称后缀获取图标
 * @returns  SymbolViewProps['name']
 */
export const getIconSymbol: FnIconSymbol = (name: string, is_dir?: boolean) => {
  if (is_dir) {
    return "folder";
  } else if (isImageFile(name)) {
    return "photo";
  } else if (isAudioFile(name)) {
    return "music-note";
  } else {
    return "file-present";
  }
};

/**
 * 文件大小转换
 * @param bytes size
 * @param decimal 保留小数
 * @returns
 */
export function formatFileSize(
  bytes: number | undefined,
  decimal: number = 2
): string {
  if (!bytes || bytes === 0) {
    return "0 Bytes";
  }

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  let i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
  if (i === 0) {
    return `${bytes} ${sizes[i]}`;
  }

  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(decimal))} ${
    sizes[i]
  }`;
}

/**
 * 格式化路径，将多个路径片段合并成一个标准化的路径
 *
 * @param {string[]} segments 路径片段数组
 * @returns {string} 标准化后的路径
 */
export function formatPath(...segments: string[]): string {
  // 合并所有路径片段，并用 '/' 分隔
  let path = segments.join("/");

  // 使用正则表达式处理冗余的斜杠和其他特殊情况
  path = path
    .replace(/\/\/+/g, "/") // 替换多个连续的斜杠为单个斜杠
    .replace(/\/+$/, ""); // 去掉路径结尾的斜杠

  return path;
}

/**
 * 首字母大写
 * @param str
 * @returns
 */
export function capitalizeFirstLetter(str?: string) {
  if (!str || typeof str !== "string" || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
