import { useEffect, useRef, useState } from "react";
import { getStorageAsync } from "@/store/slices/audioSlice";
import { storageManager } from "@/storage";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { IconSymbol } from "@/components/ui";
import Constants from "expo-constants";
import { ThemedText } from "@/components/theme/ThemedText";
import { useRouter } from "expo-router";
import type { OptionType } from "@/components/audio/MusicPlayer";
import { GetCover } from "@/api/api";
import { useTheme } from "@/hooks/useThemeColor";
import { ThemedView } from "@/components/theme/ThemedView";
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const ImageScreen = () => {
  const mode = useColorScheme();
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<OptionType[]>([]);
  const [imageUrl, setImageUrl] = useState(
    "http://inews.gtimg.com/newsapp_ls/0/13388781949/0"
  );
  const isInitialRender = useRef<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { coverItems, viewerIndex } = await getStorageAsync();
      setIndex(viewerIndex);
      setImages([...coverItems]);
    })();
  }, []);

  const setImagesAsync = async (list: OptionType[]) => {
    setImages(list);
    await storageManager.set("cover_items", list);
  };

  const onCoverRefresh = async (order: 1 | -1) => {
    if (loading) return;
    try {
      setLoading(true);
      const data = await GetCover({ type: "json", mode: "2,8" });
      if (data.url) {
        const uri = __DEV__ ? data.url : data.url.replace(/http:/g, "https:");
        const option = { key: Date.now().toString(), value: uri };
        if (order >= 1) {
          await setImagesAsync([...images, option]);
        } else {
          await setImagesAsync([option, ...images]);
        }
        return uri;
      }
    } catch {
      console.log("图片加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isInitialRender.current) {
      isInitialRender.current = true;
      return;
    }
    const cover = images[index];
    if (cover) setImageUrl(cover.value);
    storageManager.set("viewer_index", index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const onBack = () => {
    router.back();
  };

  const prevPicture = async () => {
    const cover = images[index - 1];
    if (cover) {
      setIndex(index - 1);
    } else {
      const url = await onCoverRefresh(-1);
      if (url) setImageUrl(url);
    }
  };
  const nextPicture = async () => {
    const cover = images[index + 1];
    if (cover) {
      setIndex(index + 1);
    } else {
      const url = await onCoverRefresh(1);
      if (url) {
        setIndex(index + 1);
      }
    }
  };

  return (
    <ThemedView style={styles.viewContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBack}>
          <IconSymbol
            name="chevron-left"
            size={Platform.OS === "android" ? 35 : 25}
          />
        </TouchableOpacity>
        <ThemedText style={{ fontWeight: "bold" }}>💗</ThemedText>
      </View>
      <ReactNativeZoomableView maxZoom={30}>
        <Image src={imageUrl} style={styles.imageViewer}></Image>
      </ReactNativeZoomableView>
      <View
        style={[
          styles.toolbar,
          {
            backgroundColor:
              mode === "dark" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)",
          },
        ]}
      >
        <TouchableOpacity onPress={() => setIndex(0)}>
          <IconSymbol
            name="keyboard-double-arrow-left"
            size={Platform.OS === "android" ? 30 : 20}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={prevPicture}>
          <IconSymbol
            name="arrow-left"
            size={Platform.OS === "android" ? 60 : 40}
          />
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size={30} color={theme.primary} />
        ) : (
          <ThemedText>
            {index + 1}/{images.length}
          </ThemedText>
        )}
        <TouchableOpacity onPress={nextPicture}>
          <IconSymbol
            name="arrow-right"
            size={Platform.OS === "android" ? 60 : 40}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIndex(images.length - 1)}>
          <IconSymbol
            name="keyboard-double-arrow-right"
            size={Platform.OS === "android" ? 30 : 20}
          />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  imageViewer: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  headerContainer: {
    width: "100%",
    paddingTop: Constants.statusBarHeight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingRight: 10,
  },
  toolbar: {
    opacity: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1,
    paddingVertical: 5,
  },
});
export default ImageScreen;
