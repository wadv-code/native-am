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
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { isNumber } from "@/utils/helper";
import { setStorage } from "@/storage/long";
import { getStorageAsync, type OptionType } from "@/utils/store";
import { useRoute, type RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "@/types";
import { formatPath, isImageFile, removeLastPath } from "@/utils/lib";
import { Toast } from "@/components/theme";

type VideoScreenRouteProp = RouteProp<RootStackParamList, "video">;

type ImageScreenType = "image" | "viewer";

const ImageScreen = () => {
  const mode = useColorScheme();
  const { theme } = useTheme();
  const route = useRoute<VideoScreenRouteProp>();
  const [index, setIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<OptionType[]>([]);
  const [imageUrl, setImageUrl] = useState(IMAGE_DEFAULT_URL);
  const type = useRef<ImageScreenType>("image");

  const router = useRouter();

  const setImagesAsync = async (list: OptionType[]) => {
    setImages(list);
    await setStorage("coverItems", list);
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
      setLoading(true);
      setIndex(index - 1);
    } else {
      Toast.warn("到头了", "top");
    }
  }, [index]);

  const nextPicture = useCallback(() => {
    setLoading(true);
    if (type.current === "image") {
      if (index < images.length - 1) {
        setIndex(index + 1);
      }
    } else {
      setIndex(index + 1);
    }
  }, [index, images]);

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
      password: "",
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
      if (type.current === "viewer") setStorage("viewerIndex", index);
      if (cover && cover.value) {
        setImageUrl(cover.value);
      } else if (type.current === "viewer") {
        setLoading(true);
        GetCover()
          .then((url) => {
            const option = { key: Date.now().toString(), value: url };
            setImagesAsync([...images, option]);
          })
          .catch(() => {
            setLoading(false);
          });
      } else if (cover && type.current === "image") {
        setLoading(true);
        GetDetail({ path: cover.key, password: "" })
          .then(({ data }) => {
            if (!data) setLoading(false);
            const raw_url = data.raw_url ?? "";
            const sign = data.sign ?? "";
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
          .catch(() => {
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
        <Image
          src={imageUrl}
          style={styles.imageViewer}
          onError={() => setLoading(false)}
          onLoadEnd={() => setLoading(false)}
          onLoadStart={() => setLoading(true)}
        />
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
