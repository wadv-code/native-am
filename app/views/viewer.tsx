import { useCallback, useEffect, useRef, useState } from "react";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { IconSymbol } from "@/components/ui";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { GetCover, GetDetail, GetItems } from "@/api/api";
import { ThemedView } from "@/components/theme/ThemedView";
import { globalStyles } from "@/styles";
import { Text, useTheme } from "@rneui/themed";
import { IMAGE_BASE_URL, IMAGE_DEFAULT_URL } from "@/utils";
import { isNumber } from "@/utils/helper";
import { setStorage } from "@/storage/long";
import { getStorageAsync, type OptionType } from "@/utils/store";
import { useRoute, type RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "@/types";
import { Toast } from "@/components/theme";
import { getImageDefaultItem } from "@/components/mine/util";
import { COVER_ITEMS, VIEWER_INDEX } from "@/storage/storage-keys";
import {
  formatPath,
  isImageFile,
  randomNum,
  removeLastPath,
} from "@/utils/lib";
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type VideoScreenRouteProp = RouteProp<RootStackParamList, "video">;

type ImageScreenType = "image" | "viewer";

const ImageScreen = () => {
  const mode = useColorScheme();
  const { theme } = useTheme();
  const route = useRoute<VideoScreenRouteProp>();
  const [index, setIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [images, setImages] = useState<OptionType[]>([]);
  const [imageUrl, setImageUrl] = useState(IMAGE_DEFAULT_URL);
  const [serverName, setServerName] = useState<string>("");
  const type = useRef<ImageScreenType>("image");

  const router = useRouter();

  const setImagesAsync = async (list: OptionType[]) => {
    setImages(list);
    await setStorage(COVER_ITEMS, list);
  };

  const updateImage = (id: string, key: keyof OptionType, value: any) => {
    setImages((prevItems) => {
      return prevItems.map((item) => {
        if (item.key === id) {
          return { ...item, [key]: value };
        }
        return item;
      });
    });
  };

  const onBack = () => {
    router.back();
  };

  const prevPicture = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
    } else {
      Toast.warn("到头了", "top");
    }
  }, [index]);

  const nextPicture = useCallback(() => {
    if (type.current === "image") {
      if (index < images.length - 1) {
        setIndex(index + 1);
      }
    } else {
      setIndex(index + 1);
    }
  }, [index, images]);

  const handleRefresh = useCallback(() => {
    const randomIndex = randomNum(images.length - 1);
    const option = images[randomIndex];
    if (option) setIndex(randomIndex);
  }, [images]);

  const handleDelete = async () => {
    if (type.current === "image") return;
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
        nextPicture();
      }
      setImagesAsync([...images]);
    }
  };

  const onFetch = useCallback((path: string) => {
    const catalogPath = removeLastPath(path);
    setLoading(true);
    GetItems({
      page: 1,
      password: "asmrgay",
      path: catalogPath,
      per_page: 1000,
      refresh: false,
    })
      .then(({ data }) => {
        const imageItems = data.content.filter((f) => isImageFile(f.name));
        const index = imageItems.findIndex(
          (f) => formatPath(f.parent ?? "/", f.name) === path
        );
        const list = imageItems.map((v) => {
          const key = formatPath(v.parent ?? "/", v.name);
          return {
            value: "",
            key: key,
          };
        });
        setIndex(index > -1 ? index : 0);
        setImages([...list]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (index > -1) {
      const cover = images[index];
      if (type.current === "viewer") setStorage(VIEWER_INDEX, index);
      if (cover && cover.value) {
        setImageUrl(cover.value);
      } else if (type.current === "viewer") {
        setLoading(true);
        GetCover()
          .then((url) => {
            const option = { key: Date.now().toString(), value: url };
            setImagesAsync([...images, option]);
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (cover && type.current === "image") {
        setLoading(true);
        GetDetail({ path: cover.key, password: "asmrgay" })
          .then(({ data }) => {
            const raw_url = data.raw_url ?? "";
            const sign = data.sign ?? "";
            if (data.name) setServerName(data.name);
            if (raw_url.indexOf(IMAGE_BASE_URL) !== -1) {
              setImages([
                ...images.map((v) => {
                  return {
                    ...v,
                    value: `${IMAGE_BASE_URL}${v.key}?sign=${sign}`,
                  };
                }),
              ]);
            } else {
              updateImage(cover.key, "value", raw_url);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [images, index]);

  useEffect(() => {
    (async () => {
      if (route.params.path) {
        type.current = "image";
        onFetch(route.params.path);
      } else {
        const server = await getImageDefaultItem();
        if (server) setServerName(server.title);
        type.current = "viewer";
        const { coverItems, viewerIndex } = await getStorageAsync();
        setIndex(isNumber(viewerIndex) ? viewerIndex : 0);
        if (coverItems.length) {
          setImages([...coverItems]);
        } else {
          setImages([
            { key: Math.random().toString(), value: IMAGE_DEFAULT_URL },
          ]);
        }
      }
    })();
  }, [onFetch, route.params.path]);

  return (
    <ThemedView style={styles.viewContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBack} style={{ width: 60 }}>
          <IconSymbol
            name="chevron-left"
            size={Platform.OS === "android" ? 30 : 22}
          />
        </TouchableOpacity>
        <Text
          style={{ fontSize: 16, width: "65%" }}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {serverName}
        </Text>
        <View style={[globalStyles.row, { gap: 10, width: 60 }]}>
          <TouchableOpacity onPress={handleDelete}>
            <IconSymbol name="delete-outline" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRefresh}>
            <IconSymbol name="refresh" />
          </TouchableOpacity>
        </View>
      </View>
      <ReactNativeZoomableView maxZoom={30}>
        <Image
          src={imageUrl}
          style={styles.imageViewer}
          onError={() => setImageLoading(false)}
          onLoadEnd={() => setImageLoading(false)}
          onLoadStart={() => setImageLoading(true)}
        />
        {imageLoading && (
          <ActivityIndicator
            size={40}
            color={theme.colors.primary}
            style={styles.loading}
          />
        )}
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
            <TouchableOpacity onPress={handleRefresh}>
              <Text style={styles.centerText}>
                {index + 1}/{images.length}
              </Text>
            </TouchableOpacity>
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
  loading: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    zIndex: 1,
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
    paddingHorizontal: 10,
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
