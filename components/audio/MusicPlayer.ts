import { useEffect } from "react";
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  Event,
} from "react-native-track-player";

type MusicPlayerProps = {
  uri: string;
  autoplay?: boolean;
  playing?: boolean;
  onUpdate?: (option: any) => void;
  onFinish?: () => void;
  onPlaying?: (playing: boolean) => void;
};

const MusicPlayer = (props: MusicPlayerProps) => {
  const { uri, playing, autoplay, onUpdate, onFinish, onPlaying } = props;

  async function playMusic() {
    try {
      // 播放
    } catch (error) {
      console.error("Error playing music:", error);
    }
  }

  useEffect(() => {
    if (uri) playMusic();
    // 清理函数，确保在组件卸载时释放资源
    return () => {
      // soundObject.unloadAsync();
    };
  }, [uri]);

  // const [soundObject, setSoundObject] = useState(new Audio.Sound());

  // const playAsync = async () => {
  //   await soundObject.playAsync();
  //   onPlaying && onPlaying(true);
  // };
  //   } catch (error) {
  //     console.error("Error playing music:", error);
  //   }
  // }

  // const pauseAsync = async () => {
  //   await soundObject.pauseAsync();
  //   onPlaying && onPlaying(false);
  // };

  // async function playMusic() {
  //   try {
  //     // 卸载音乐
  //     await soundObject.unloadAsync();
  //     // 重新加载
  //     await soundObject.loadAsync({ uri });
  //     // 事件
  //     soundObject.setOnPlaybackStatusUpdate((playbackStatus) => {
  //       if (!playbackStatus.isLoaded) {
  //         console.log("isLoaded");
  //         if (playbackStatus.error) {
  //           console.log(
  //             `Encountered a fatal error during playback: ${playbackStatus.error}`
  //           );
  //         }
  //       } else {
  //         if (playbackStatus.isPlaying) {
  //           onUpdate && onUpdate(playbackStatus);
  //           // Update your UI for the playing state
  //         } else {
  //           // Update your UI for the paused state
  //         }

  //         if (playbackStatus.isBuffering) {
  //           console.log("isBuffering");
  //         }

  //         if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
  //           console.log("didJustFinish");
  //           onFinish && onFinish();
  //         }
  //       }
  //     });
  //     // 播放
  //     if (autoplay || playing) await playAsync();
  //   } catch (error) {
  //     console.error("Error playing music:", error);
  //   }
  // }

  // useEffect(() => {
  //   if (uri) playMusic();
  //   // 清理函数，确保在组件卸载时释放资源
  //   return () => {
  //     soundObject.unloadAsync();
  //   };
  // }, [uri]);

  // useEffect(() => {
  //   (async () => {
  //     if (playing) {
  //       await playAsync();
  //     } else {
  //       await pauseAsync();
  //     }
  //   })();
  // }, [playing]);

  return null; // 这个组件不渲染任何东西，只是播放音乐
};

export { MusicPlayer, MusicPlayerProps };
