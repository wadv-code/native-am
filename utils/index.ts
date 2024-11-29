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
