import { useEffect, useState } from "react";
import { Audio, type AVPlaybackStatus } from "expo-av";

Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  interruptionModeIOS: 0,
  playsInSilentModeIOS: true,
  shouldDuckAndroid: true,
  staysActiveInBackground: true,
});

type MusicPlayerProps = {
  uri: string;
  autoplay?: boolean;
  playing?: boolean;
  onUpdate?: (option: AVPlaybackStatus) => void;
  onFinish?: () => void;
  onPlaying?: (playing: boolean) => void;
  onError?: (msg?: string) => void;
  onLoaded?: () => void;
  onBuffering?: () => void;
};

const MusicPlayer = (props: MusicPlayerProps) => {
  const { uri, playing, autoplay } = props;
  const { onUpdate, onFinish, onPlaying, onLoaded, onError, onBuffering } =
    props;
  const [soundObject, setSoundObject] = useState(new Audio.Sound());

  const loadAudio = async () => {
    try {
      await unloadAudio();
      const playbackStatus = await soundObject.loadAsync(
        { uri }
        // { shouldPlay: true }
      );
      onUpdate && onUpdate(playbackStatus);
      onLoaded && onLoaded();
      autoplay && (await playAsync());
    } catch {
      onError && onError("加载音乐错误");
    }
  };

  const unloadAudio = async () => {
    return await soundObject.unloadAsync();
  };

  // const [soundObject, setSoundObject] = useState(new Audio.Sound());

  const playAsync = async () => {
    await soundObject.playAsync();
    onPlaying && onPlaying(true);
  };

  const pauseAsync = async () => {
    await soundObject.pauseAsync();
    onPlaying && onPlaying(false);
  };

  const loadEvent = () => {
    soundObject.setOnPlaybackStatusUpdate((playbackStatus) => {
      if (!playbackStatus.isLoaded) {
        if (playbackStatus.error) {
          onError && onError(playbackStatus.error);
        }
      } else {
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
          onFinish && onFinish();
        }
      }
    });
  };

  useEffect(() => {
    if (uri) {
      loadAudio();
    } else {
      unloadAudio();
    }
  }, [uri]);

  useEffect(() => {
    loadEvent();

    // 清理函数，确保在组件卸载时释放资源
    return () => {
      unloadAudio();
    };
  }, [soundObject]);

  useEffect(() => {
    (async () => {
      if (playing) {
        await playAsync();
      } else {
        await pauseAsync();
      }
    })();
  }, [playing]);

  return null; // 这个组件不渲染任何东西，只是播放音乐
};

export { MusicPlayer, MusicPlayerProps };
