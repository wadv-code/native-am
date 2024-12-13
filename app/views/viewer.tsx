import { useEffect, useRef, useState } from "react";
import { getStorageAsync } from "@/store/slices/audioSlice";
import { storageManager } from "@/storage";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { IconSymbol } from "@/components/ui";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import type { OptionType } from "@/components/audio/MusicPlayer";
import { GetCover } from "@/api/api";
import { ThemedView } from "@/components/theme/ThemedView";
import { globalStyles } from "@/styles";
import { Text, useTheme } from "@rneui/themed";
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
  const { theme } = useTheme();
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<OptionType[]>([]);
  const [imageUrl, setImageUrl] = useState("http://3650000.xyz/api/");
  const isInitialRender = useRef<boolean>(false);

  const router = useRouter();

  const setImagesAsync = async (list: OptionType[]) => {
    setImages(list);
    await storageManager.set("cover_items", list);
  };

  const onCoverRefresh = async (order: 1 | -1) => {
    if (loading) return;
    try {
      setLoading(true);
      const url = await GetCover();
      if (url) {
        const option = { key: Date.now().toString(), value: url };
        if (order >= 1) {
          await setImagesAsync([...images, option]);
        } else {
          await setImagesAsync([option, ...images]);
        }
        return url;
      }
    } catch {
      console.log("图片加载失败");
    } finally {
      setLoading(false);
    }
  };

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

  const handleDelete = async () => {
    const item = images[index];
    if (item) {
      images.splice(index, 1);
      if (images.length) {
        const current = images[index];
        if (current) {
          setImageUrl(current.value);
        } else {
          setIndex(index - 1);
        }
      } else {
        await nextPicture();
      }
      setImagesAsync([...images]);
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

  useEffect(() => {
    (async () => {
      const { coverItems, viewerIndex } = await getStorageAsync();
      setIndex(viewerIndex);
      setImages([...coverItems]);
    })();
  }, []);

  return (
    <ThemedView style={styles.viewContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBack}>
          <IconSymbol
            name="chevron-left"
            size={Platform.OS === "android" ? 35 : 25}
          />
        </TouchableOpacity>
        <TouchableOpacity style={globalStyles.row} onPress={handleDelete}>
          <IconSymbol name="delete-outline" />
          {/* <Text style={{ fontWeight: "bold" }}>💗</Text> */}
        </TouchableOpacity>
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
            style={{ color: theme.colors.grey0 }}
            size={Platform.OS === "android" ? 40 : 20}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={prevPicture}>
          <IconSymbol
            name="arrow-left"
            style={{ color: theme.colors.grey0 }}
            size={Platform.OS === "android" ? 50 : 30}
          />
        </TouchableOpacity>
        <View style={styles.center}>
          {loading ? (
            <ActivityIndicator size={40} color={theme.colors.grey0} />
          ) : (
            <Text style={styles.centerText}>
              {index + 1}/{images.length}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={nextPicture}>
          <IconSymbol
            name="arrow-right"
            style={{ color: theme.colors.grey0 }}
            size={Platform.OS === "android" ? 50 : 30}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIndex(images.length - 1)}>
          <IconSymbol
            name="keyboard-double-arrow-right"
            style={{ color: theme.colors.grey0 }}
            size={Platform.OS === "android" ? 40 : 20}
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
  center: {
    width: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: {
    fontSize: 16,
    fontWeight: "bold",
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
    // opacity: 0.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1,
    paddingTop: 10,
    paddingBottom: 20,
  },
});
export default ImageScreen;
