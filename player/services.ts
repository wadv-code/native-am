import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
} from "react-native-track-player";

const playbackService = async () => {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    const track = await TrackPlayer.getCurrentTrack();
    if (track == 0) {
      TrackPlayer.skipToNext();
    }
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    const track = await TrackPlayer.getCurrentTrack();
    if (track == 1) {
      TrackPlayer.skipToPrevious();
    }
  });
  TrackPlayer.addEventListener(
    Event.RemoteJumpForward,
    async ({ interval }) => {
      const position = await TrackPlayer.getPosition();
      await TrackPlayer.seekTo(position + interval);
    }
  );
  TrackPlayer.addEventListener(
    Event.RemoteJumpBackward,
    async ({ interval }) => {
      const position = await TrackPlayer.getPosition();
      await TrackPlayer.seekTo(position - interval);
    }
  );
};

const setupPlayer = async () => {
  TrackPlayer.registerPlaybackService(() => playbackService);
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
    },
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.JumpForward,
      Capability.JumpBackward,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToPrevious,
      Capability.SkipToNext,
    ],
  });
};

export default function App() {
  //初始化音频播放器
  setupPlayer();

  // //在播放页面 加载音频url
  // addUrl = async () => {
  //   await TrackPlayer.add([url1, url12]);
  // };
}
