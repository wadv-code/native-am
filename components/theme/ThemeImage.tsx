import React, { useState } from "react";
import { Image, type ImageProps } from "react-native";

export type ThemeImageProps = ImageProps & {};

const ThemeImage = ({ src, style, resizeMode }: ThemeImageProps) => {
  const [hasError, setHasError] = useState(false); // 加载错误状态

  // 处理图片加载错误
  const handleImageError = () => {
    setHasError(true);
  };

  // 根据是否有错误来选择图片源
  const getSource = () => {
    if (hasError) {
      // 返回本地默认图片
      return require("@/assets/images/logo.png");
    }
    // 返回网络图片URI
    return { uri: src };
  };

  return (
    <Image
      source={getSource()}
      style={style}
      resizeMode={resizeMode}
      onError={handleImageError} // 当加载失败时调用handleImageError
    />
  );
};

export default ThemeImage;
