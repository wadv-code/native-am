import { useAppDispatch } from "@/hooks/useStore";
import type { RootState } from "@/store";
import { Audio, InterruptionModeAndroid, type AVPlaybackStatus } from "expo-av";
import { useEffect, useState } from "react";
import { AppState } from "react-native";
import { useSelector } from "react-redux";
import { formatAudioPosition, throttle } from "@/utils/lib";
import { getStorage, setStorage } from "@/storage/long";
import type { GetItem } from "@/api";
import {
  setAudioInfo,
  setLoading,
  setPlaying,
  setPosition,
} from "@/store/slices/audioSlice";

Audio.setAudioModeAsync({
  interruptionModeIOS: 0,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  staysActiveInBackground: true,
  playThroughEarpieceAndroid: true,
  interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
});

const Music = () => {
  const dispatch = useAppDispatch();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const audioState = useSelector((state: RootState) => state.audio);
  const { audioInfo, playing, loading, seek } = audioState;

  const playAsync = async () => {
    if (sound) {
      await sound.playAsync();
    }
  };

  const pauseAsync = async () => {
    if (sound) {
      await sound.pauseAsync();
      dispatch(setPlaying(false));
    }
  };

  const stopAsync = async () => {
    if (sound) {
      await sound.stopAsync();
      dispatch(setPlaying(false));
    }
  };

  const getStoragePosition = async () => {
    const option = await getStorage<{ position: number; id: string }>(
      "audioPosition",
      { position: 0, id: audioInfo.id }
    );
    return option;
  };

  const setStoragePosition = throttle((position) => {
    if (position) {
      setStorage("audioPosition", {
        id: audioInfo.id,
        position,
      });
    }
  }, 5000);

  const setAudioCurrent = (playbackStatus: AVPlaybackStatus) => {
    if (playbackStatus.isLoaded) {
      const position = playbackStatus.positionMillis;
      const duration = playbackStatus.durationMillis ?? 0;
      const option = formatAudioPosition(position, duration);
      dispatch(
        setPosition({
          duration,
          ...option,
        })
      );
      setStoragePosition(position);
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

        // if (playbackStatus.isBuffering) {
        //   console.log("isBuffering");
        //   // onBuffering && onBuffering();
        // }

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
        await stopAsync();
        // 注销旧的
        await sound?.unloadAsync();
        // 获取进度
        const option = await getStoragePosition();
        // 新的
        const playbackStatus = await soundObject.loadAsync(
          { uri },
          {
            shouldPlay: playing,
            positionMillis: audioInfo.id === option.id ? option.position : 0,
          }
        );
        if (playing) dispatch(setPlaying(true));
        setAudioCurrent(playbackStatus);
        soundObject?.setOnPlaybackStatusUpdate(handlePlaybackStatusUpdate);
        setSound(soundObject);
      } catch (error) {
        console.error("音频加载失败:", error);
        dispatch(setLoading(false));
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
