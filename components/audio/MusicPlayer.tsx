import { GetCover } from "@/api/api";
import { useAppDispatch } from "@/hooks/useStore";
import type { RootState } from "@/store";
import { IMAGE_DEFAULT_URL } from "@/utils";
import { player } from "@/utils/audio";
import { throttle } from "@/utils/lib";
import { getStorageAsync, handleCoverItems } from "@/utils/store";
import type { AVPlaybackStatus } from "expo-av";
import { useEffect } from "react";
import { AppState } from "react-native";
import { useSelector } from "react-redux";
import {
  setAudioCover,
  setAudioInfo,
  setCovering,
  setLoading,
  setPlaying,
  setPosition,
} from "@/store/slices/audioSlice";
import { onSwitchAudio } from ".";

const MusicPlayer = () => {
  const dispatch = useAppDispatch();
  const audioState = useSelector((state: RootState) => state.audio);
  const { audioInfo, playing } = audioState;

  const onUpdate = throttle((status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        console.log(status.error);
      }
    } else {
      if (status.isPlaying) {
        dispatch(setPlaying(true));
      } else {
        dispatch(setPlaying(false));
        // Update your UI for the paused state
      }

      if (status.didJustFinish && !status.isLooping) {
        console.log("isFinish");
        onSwitchAudio(audioInfo, 1, !audioInfo.parent).then((audio) => {
          if (audio) {
            dispatch(setPlaying(true));
            dispatch(setAudioInfo(audio));
          }
        });
      }
      dispatch(
        setPosition({
          position: status.positionMillis,
          duration: status.durationMillis ?? 0,
        })
      );
    }
  }, 1000);

  useEffect(() => {
    if (audioInfo.id && !audioInfo.duration && playing) {
      dispatch(setLoading(true));
      player.play(true).finally(() => {
        dispatch(setLoading(false));
      });
    }
  }, [audioInfo.duration, audioInfo.id, playing, dispatch]);

  useEffect(() => {
    (async () => {
      const { coverItems } = await getStorageAsync();
      const cover = coverItems.find((f) => f.key === audioInfo.id);
      if (cover) {
        dispatch(setAudioCover(cover.value));
      } else if (!audioInfo.cover || audioInfo.cover === IMAGE_DEFAULT_URL) {
        dispatch(setCovering(true));
        GetCover()
          .then((url) => {
            if (url) {
              handleCoverItems({ key: audioInfo.id, value: url });
              dispatch(setAudioCover(url));
            }
          })
          .finally(() => {
            dispatch(setCovering(false));
          });
      }
    })();
  }, [audioInfo.id, audioInfo.cover, dispatch]);

  useEffect(() => {
    player.setUpdate(onUpdate);
    AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "background") {
        console.log("应用进入后台");
        player.setUpdate(null);
      } else if (nextAppState === "active") {
        console.log("应用回到前台");
        player.setUpdate(onUpdate);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export { MusicPlayer };
