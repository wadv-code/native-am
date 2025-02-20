import { useAppDispatch } from "@/hooks/useStore";
import type { RootState } from "@/store";
import { Audio, type AVPlaybackSource, type AVPlaybackStatus } from "expo-av";
import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { GetAudioSource, onSwitchAudio } from ".";
import type { GetItem } from "@/api";
import { Toast } from "../theme";
import { AppState, type AppStateStatus } from "react-native";
import { formatMilliseconds, sleep, throttle } from "@/utils/lib";
import { GetCover } from "@/api/api";
import { handleCoverItems } from "@/utils/store";
import { IMAGE_DEFAULT_URL } from "@/utils";
import {
  setAudioCover,
  setAudioInfo,
  setLoading,
  setPlaying,
  setPosition,
} from "@/store/slices/audioSlice";

Audio.setAudioModeAsync({
  interruptionModeAndroid: 1,
  staysActiveInBackground: true,
});

const MusicPlayer = () => {
  const dispatch = useAppDispatch();
  const audioState = useSelector((state: RootState) => state.audio);
  const { audioInfo, playing, seek } = audioState;
  const source = useRef<AVPlaybackSource | undefined>();
  const sound = useRef<Audio.Sound | null>(null);
  const playingRef = useRef<boolean>(playing);
  const positionRef = useRef<number>(audioInfo.position ?? 0);
  const audioRef = useRef<GetItem | undefined>();
  const initPlaying = useRef<boolean>(false);
  const initSeek = useRef<boolean>(false);
  const appStateRef = useRef<AppStateStatus>("active");

  const onThrottle = throttle((status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        console.log(status.error);
      }
    } else {
      if (playingRef.current !== status.isPlaying) {
        initPlaying.current = false;
        dispatch(setPlaying(status.isPlaying));
      }
      if (status.didJustFinish && !status.isLooping) {
        console.log("播放完成");
        if (audioRef.current) {
          onSwitchAudio(audioRef.current, 1, !audioRef.current.parent).then(
            (audio) => {
              if (audio) dispatch(setAudioInfo(audio));
            }
          );
        }
      } else {
        // console.log("position => ", status.positionMillis);
        dispatch(
          setPosition({
            position: status.positionMillis,
            duration: status.durationMillis ?? 0,
          })
        );
      }
    }
  }, 1000);

  const onUpdate = useCallback((status: AVPlaybackStatus) => {
    onThrottle(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setUpdate = (func: ((status: AVPlaybackStatus) => void) | null) => {
    sound.current?.setOnPlaybackStatusUpdate(func);
  };

  const loadAsync = useCallback(
    async (source: AVPlaybackSource, shouldPlay: boolean) => {
      try {
        dispatch(setLoading(true));
        // 无论有没有都卸载
        await unloadAsync();
        // 初始化
        const soundObject = new Audio.Sound();
        const status = await soundObject.loadAsync(source, {
          shouldPlay,
          positionMillis: positionRef.current,
          volume: 1,
        });
        const isActive = appStateRef.current === "active";
        isActive && soundObject.setOnPlaybackStatusUpdate(onUpdate);
        sound.current = soundObject;
        if (status.isLoaded) {
          console.log(
            `播放时长 => ${formatMilliseconds(status.durationMillis)}`
          );
        }
        onUpdate(status);
        dispatch(setLoading(false));
      } catch {
        Toast.warn(`音频播放错误 => ${audioRef.current?.name}`);
        dispatch(setLoading(false));
      }
    },
    [dispatch, onUpdate]
  );

  const getSource = useCallback(async () => {
    if (audioRef.current) {
      try {
        dispatch(setLoading(true));
        const result = await GetAudioSource({
          parent: audioRef.current.parent,
          name: audioRef.current.name,
          raw_url: audioRef.current.raw_url,
        });
        if (result) {
          console.log("获取音频源 => ", result);
          source.current = result;
          initPlaying.current = false;
          await loadAsync(result, true);
          if (!playingRef.current) dispatch(setPlaying(true));
        } else {
          Toast.warn(`正在重新尝试获取源 => ${audioRef.current.name}`);
          await sleep(2000);
          await getSource();
        }
      } catch {
        Toast.warn(`正在重新尝试获取源 => ${audioRef.current.name}`);
        await sleep(2000);
        await getSource();
      }
    }
  }, [dispatch, loadAsync]);

  const playAsync = useCallback(async () => {
    if (sound.current) await sound.current.playAsync();
    else await getSource();
  }, [getSource]);

  const pauseAsync = async () => {
    if (sound.current) await sound.current.pauseAsync();
  };

  const unloadAsync = async () => {
    if (sound.current) {
      sound.current.setOnPlaybackStatusUpdate(null);
      await sound.current.unloadAsync();
      sound.current = null;
    }
  };

  useEffect(() => {
    playingRef.current = playing;
    if (!initPlaying.current) {
      initPlaying.current = true;
      return;
    }
    async function onPlaying() {
      if (playing) {
        await playAsync();
      } else {
        await pauseAsync();
      }
    }
    onPlaying();
  }, [playAsync, playing]);

  useEffect(() => {
    audioRef.current = {
      id: audioInfo.id,
      name: audioInfo.name,
      parent: audioInfo.parent,
      raw_url: audioInfo.raw_url,
    };
    if (!audioInfo.duration && audioInfo.id) {
      positionRef.current = 0;
      console.log("切换音频 => ", audioInfo.name);
      // setUpdate(null);
      getSource();
    }
  }, [
    getSource,
    audioInfo.id,
    audioInfo.name,
    audioInfo.parent,
    audioInfo.duration,
    audioInfo.raw_url,
  ]);

  useEffect(() => {
    const getAudioCover = async (key: string) => {
      try {
        const url = await GetCover();
        if (url) {
          console.log("获取音频封面 => ", url);
          handleCoverItems({ key, value: url });
          dispatch(setAudioCover(url));
        } else {
          console.log("获取音频封面失败 => ", IMAGE_DEFAULT_URL);
        }
      } catch {
        console.log("获取音频封面失败 => ", IMAGE_DEFAULT_URL);
        dispatch(setAudioCover(IMAGE_DEFAULT_URL));
      }
    };
    if (!audioInfo.cover) getAudioCover(audioInfo.id);
  }, [dispatch, audioInfo.cover, audioInfo.id]);

  useEffect(() => {
    if (!initSeek.current) {
      initSeek.current = true;
      return;
    }
    if (sound.current) {
      sound.current.setPositionAsync(seek ?? 0);
    } else {
      positionRef.current = seek ?? 0;
      dispatch(setPlaying(true));
    }
  }, [dispatch, seek]);

  // 后台监听
  useEffect(() => {
    let subscription = null;
    subscription = AppState.addEventListener("change", (appState) => {
      if (appState === "active") {
        setUpdate(onUpdate);
        console.log("前台");
      } else if (appState === "background") {
        setUpdate(null);
        console.log("后台");
      }
      appStateRef.current = appState;
    });
    return () => {
      subscription?.remove();
    };
  }, [onUpdate]);

  return null;
};
export { MusicPlayer };
