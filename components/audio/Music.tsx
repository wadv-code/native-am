import { useAppDispatch } from "@/hooks/useStore";
import type { RootState } from "@/store";
import { Audio, type AVPlaybackStatus } from "expo-av";
import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { useSelector } from "react-redux";
import { formatAudioPosition, throttle } from "@/utils/lib";
import { getStorage } from "@/storage/long";
import type { GetItem } from "@/api";
import {
  setAudioInfo,
  setLoading,
  setPlaying,
  setPosition,
} from "@/store/slices/audioSlice";

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  interruptionModeIOS: 0,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  staysActiveInBackground: true,
});

const Music = () => {
  const dispatch = useAppDispatch();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const audioState = useSelector((state: RootState) => state.audio);
  const { audioInfo, playing, loading, seek } = audioState;

  const playAsync = async () => {
    if (sound && !loading) {
      dispatch(setLoading(true));
      await sound.playAsync();
      dispatch(setPlaying(true));
    }
  };

  const pauseAsync = async () => {
    if (sound && !loading) {
      await sound.stopAsync();
      dispatch(setPlaying(false));
    }
  };

  const setAudioCurrent = (playbackStatus: AVPlaybackStatus) => {
    if (playbackStatus.isLoaded) {
      const position = playbackStatus.positionMillis;
      const duration = playbackStatus.durationMillis ?? 0;
      dispatch(
        setPosition({
          duration,
          ...formatAudioPosition(position, duration),
        })
      );
    }
  };

  const handlePlaybackStatusUpdate = throttle(
    (playbackStatus: AVPlaybackStatus) => {
      if (!playbackStatus.isLoaded) {
        if (playbackStatus.error) {
          console.log(playbackStatus.error);
        }
      } else {
        if (playbackStatus.durationMillis && loading) {
          dispatch(setLoading(false));
        }
        if (playbackStatus.isPlaying) {
          // Update your UI for the playing state
          setAudioCurrent(playbackStatus);
        } else {
          // Update your UI for the paused state
        }

        if (playbackStatus.isBuffering) {
          console.log("isBuffering");
          // onBuffering && onBuffering();
        }

        if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
          console.log("isFinish");
          sound?.setPositionAsync(0);
          dispatch(setPlaying(false));
          sound?.getStatusAsync().then((status) => {
            setAudioCurrent(status);
          });
        }
      }
    },
    1000
  );

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
    if (sound) {
      sound.setPositionAsync(seek);
      if (!playing) playAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seek]);

  useEffect(() => {
    // 根据当前音轨索引加载音频
    const loadTrack = async (uri: string) => {
      const soundObject = new Audio.Sound();
      try {
        dispatch(setLoading(true));
        // 注销旧的
        await sound?.unloadAsync();
        // 新的
        const playbackStatus = await soundObject.loadAsync(
          { uri },
          { shouldPlay: playing }
        );
        setAudioCurrent(playbackStatus);
        soundObject?.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
        setSound(soundObject);
      } catch (error) {
        console.error("音频加载失败:", error);
        setSound(null);
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (audioInfo.raw_url) loadTrack(audioInfo.raw_url);

    // 组件卸载时释放音频资源
    return () => {
      dispatch(setLoading(false));
      sound?.unloadAsync();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioInfo.raw_url]);

  useEffect(() => {
    // 监听应用状态的变化
    AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background") {
        // 应用进入后台时执行的逻辑
        console.log("应用进入后台");
        sound?.setOnPlaybackStatusUpdate(null);
      } else if (nextAppState === "active") {
        // 应用回到前台时执行的逻辑
        console.log("应用回到前台");
        sound?.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
      }
    });

    getStorage<GetItem>("audioInfo", { name: "", id: "" }).then((audio) => {
      if (audio.id && audio.id !== audioInfo.id) dispatch(setAudioInfo(audio));
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 只当作播放使用
  return null;
};

export { Music };
