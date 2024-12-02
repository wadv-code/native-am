import React, { useState, useEffect } from "react";
import { Audio } from "expo-av";
// import * as Notifications from "expo-notifications";
import { formatMilliseconds } from "@/utils/lib";
import { ThemedText } from "./theme/ThemedText";
import { ThemedButton } from "./theme/ThemedButton";
import { ThemedView } from "./theme/ThemedView";

// 设置后台播放
Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  // interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  playsInSilentModeIOS: true,
  staysActiveInBackground: true,
});

const AudioPlayerComponent = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState("00:00");
  const [current, setCurrent] = useState("00:00");
  const [soundObject, setSoundObject] = useState(new Audio.Sound());
  const sound =
    "http://nm.hzwima.com:8000/%E5%91%A8%E6%9D%B0%E4%BC%A6-%E7%A8%BB%E9%A6%99.mp3";
  useEffect(() => {
    (async () => {
      // // 请求通知栏权限
      // const { status } = await Notifications.getPermissionsAsync();
      // if (status !== "granted") {
      //   await Notifications.requestPermissionsAsync();
      // }
      // 卸载音乐
      await soundObject.unloadAsync();
      // 重新加载
      await soundObject.loadAsync({
        // 这里的 sound 应该是一个音频文件的URL
        uri: sound,
      });

      soundObject.setOnPlaybackStatusUpdate((playbackStatus) => {
        if (!playbackStatus.isLoaded) {
          console.log("isLoaded");
          // Update your UI for the unloaded state
          if (playbackStatus.error) {
            console.log(
              `Encountered a fatal error during playback: ${playbackStatus.error}`
            );
            // Send Expo team the error on Slack or the forums so we can help you debug!
          }
        } else {
          // Update your UI for the loaded state

          if (playbackStatus.isPlaying) {
            setDuration(formatMilliseconds(playbackStatus.durationMillis));
            setCurrent(formatMilliseconds(playbackStatus.positionMillis));
            // Update your UI for the playing state
          } else {
            // Update your UI for the paused state
          }

          if (playbackStatus.isBuffering) {
            console.log("isBuffering");
            // Update your UI for the buffering state
          }

          if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
            console.log("didJustFinish");
            setIsPlaying(false);
            // The player has just finished playing and will stop. Maybe you want to play something else?
          }
        }
      });
    })();
  }, [sound]);

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

  const playSound = async () => {
    await soundObject.playAsync();
    setIsPlaying(true);
  };

  const pauseSound = async () => {
    await soundObject.pauseAsync();
    setIsPlaying(false);
  };

  return (
    <ThemedView>
      <ThemedButton
        title={isPlaying ? "暂停播放" : "播放音频"}
        onPress={isPlaying ? pauseSound : playSound}
      />
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
        }}
      ></ThemedView>
    </ThemedView>
  );
};

export default AudioPlayerComponent;
