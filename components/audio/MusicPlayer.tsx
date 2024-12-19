import { useEffect, useState } from "react";
import { Audio, type AVPlaybackStatus } from "expo-av";
import { useSelector } from "react-redux";
import { emitter } from "@/utils/mitt";
import { useAppDispatch } from "@/hooks/useStore";
import { formatPath } from "@/utils/lib";
import type { RootState } from "@/store";
import type { GetItem } from "@/api";
import {
  setAudioInfoAsync,
  setCurrent,
  setDuration,
  setPlaying,
  setLoading,
  setAudioInfo,
} from "@/store/slices/audioSlice";
import { getStorage, setStorage } from "@/storage/long";

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  interruptionModeIOS: 0,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  staysActiveInBackground: true,
});

type MusicPlayerProps = {
  autoplay?: boolean;
  playing?: boolean;
  onUpdate?: (option: AVPlaybackStatus) => void;
  onFinish?: () => void;
  onError?: (msg?: string) => void;
  onLoaded?: () => void;
  onBuffering?: () => void;
};

type OptionType = {
  key: string;
  value: string;
};

type GetStorageAsync = {
  rawUrlItems: OptionType[];
  coverItems: OptionType[];
};

const MusicPlayer = (props: MusicPlayerProps) => {
  const { autoplay } = props;
  const dispatch = useAppDispatch();
  const { onFinish, onLoaded, onError, onBuffering } = props;
  const audioState = useSelector((state: RootState) => state.audio);
  const { audioInfo, playing, loading } = audioState;
  const [soundObject] = useState(new Audio.Sound());

  const loadAudio = async (uri: string) => {
    try {
      await unloadAudio();
      const playbackStatus = await soundObject.loadAsync(
        { uri },
        { shouldPlay: !!autoplay }
      );
      if (playbackStatus) onUpdate(playbackStatus);
      onLoaded && onLoaded();
      (autoplay || playing) && (await playAsync());
    } catch {
      // 错误就移除url
      delete audioInfo.raw_url;
      getStorage<OptionType[]>("rawUrlItems", []).then((list) => {
        if (list) {
          const path = formatPath(audioInfo.parent || "/", audioInfo.name);
          setStorage(
            "rawUrlItems",
            list.filter((s) => path !== s.key)
          );
        }
      });
      onError && onError("加载音乐错误");
    }
  };

  const unloadAudio = async () => {
    return await soundObject.unloadAsync();
  };

  // const [soundObject, setSoundObject] = useState(new Audio.Sound());

  const playAsync = async () => {
    if (loading) return;
    await soundObject.playAsync();
    dispatch(setPlaying(true));
  };

  const pauseAsync = async () => {
    if (loading) return;
    await soundObject.pauseAsync();
    dispatch(setPlaying(false));
  };

  const onUpdate = (playbackStatus: AVPlaybackStatus) => {
    if (playbackStatus.isLoaded) {
      dispatch(setCurrent(playbackStatus.positionMillis));
      dispatch(setDuration(playbackStatus.durationMillis));
    }
  };

  const loadEvent = () => {
    soundObject.setOnPlaybackStatusUpdate((playbackStatus) => {
      if (!playbackStatus.isLoaded) {
        if (playbackStatus.error) {
          onError && onError(playbackStatus.error);
        }
      } else {
        if (playbackStatus.durationMillis) dispatch(setLoading(false));
        if (playbackStatus.isPlaying) {
          onUpdate && onUpdate(playbackStatus);
          // Update your UI for the playing state
        } else {
          // Update your UI for the paused state
        }

        if (playbackStatus.isBuffering) {
          onBuffering && onBuffering();
        }

        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
          setAudioSeek(0, false);
          onFinish && onFinish();
        }
      }
    });
  };
  useEffect(() => {
    if (audioInfo.raw_url) {
      loadAudio(audioInfo.raw_url);
      dispatch(setLoading(true));
    } else {
      unloadAudio();
      dispatch(setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioInfo.raw_url]);

  const onAudioChange = (audio: GetItem) => {
    dispatch(setLoading(true));
    if (audio.parent) {
      dispatch(setAudioInfoAsync(audio));
    } else {
      dispatch(setAudioInfo(audio));
    }
  };

  const setAudioSeek = async (value: number, play: boolean = true) => {
    dispatch(setCurrent(value));
    await soundObject.setPositionAsync(value);
    if (!play) await pauseAsync();
  };

  // const setNotifications = async () => {
  //   // 请求通知栏权限
  //   const { status } = await Notifications.getPermissionsAsync();
  //   if (status !== "granted") {
  //     await Notifications.requestPermissionsAsync();
  //   }
  //   Notifications.setNotificationHandler({
  //     handleNotification: async () => ({
  //       shouldShowAlert: true,
  //       shouldPlaySound: false,
  //       shouldSetBadge: false,
  //     }),
  //   });
  // };

  useEffect(() => {
    getStorage<GetItem>("audioInfo", { name: "", id: "" }).then((audio) => {
      if (audio.id && audio.id !== audioInfo.id) onAudioChange(audio);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   console.log(audioInfo);
  //   // onFetchRawUrl();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [audioInfo]);

  useEffect(() => {
    (async () => {
      if (playing) {
        await playAsync();
      } else {
        await pauseAsync();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  useEffect(() => {
    loadEvent();
    // setNotifications();
    emitter.on("onAudioChange", onAudioChange);
    emitter.on("setAudioSeek", setAudioSeek);
    return () => {
      emitter.off("onAudioChange", onAudioChange);
      emitter.off("setAudioSeek", setAudioSeek);
      unloadAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundObject]);

  // useEffect(() => {
  //   console.log("change => ", audioInfo.raw_url);
  // }, [audioInfo]);

  // // 在通知栏上显示播放信息
  // useEffect(() => {
  //   if (soundObject) {
  //     Notifications.setNotificationHandler({
  //       handleNotification: async () => ({
  //         shouldShowAlert: true,
  //         shouldPlaySound: false,
  //         shouldSetBadge: false,
  //       }),
  //     });
  //   }
  // }, [soundObject]);

  return null;
};

export { MusicPlayer, MusicPlayerProps, OptionType, GetStorageAsync };
