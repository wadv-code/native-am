import React, { useState, useEffect } from "react";
import { View, Button } from "react-native";
import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";

// 设置后台播放
Audio.setAudioModeAsync({
  allowsRecordingIOS: false,
  // interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
  playsInSilentModeIOS: true,
  staysActiveInBackground: true,
});

const AudioPlayerComponent = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundObject, setSoundObject] = useState(new Audio.Sound());
  const sound =
    "http://nm.hzwima.com:8000/%E5%91%A8%E6%9D%B0%E4%BC%A6-%E7%A8%BB%E9%A6%99.mp3";
  useEffect(() => {
    (async () => {
      // 请求通知栏权限
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
      // 卸载音乐
      await soundObject.unloadAsync();
      // 重新加载
      await soundObject.loadAsync({
        // 这里的 sound 应该是一个音频文件的URL
        uri: sound,
      });
    })();
  }, [sound]);

  // 在通知栏上显示播放信息
  useEffect(() => {
    if (soundObject) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    }
  }, [soundObject]);

  const playSound = async () => {
    await soundObject.playAsync();
    setIsPlaying(true);
  };

  const pauseSound = async () => {
    await soundObject.pauseAsync();
    setIsPlaying(false);
  };

  return (
    <View>
      <Button
        title={isPlaying ? "暂停播放" : "播放音频"}
        onPress={isPlaying ? pauseSound : playSound}
      />
    </View>
  );
};

export default AudioPlayerComponent;

// import React, { useState, useEffect } from "react";
// import { Audio } from "expo-av";
// import * as Notifications from "expo-notifications";
// import { Button, View } from "react-native";

// export default function App() {
//   const [soundObject, setSoundObject] = useState(null);

//   useEffect(() => {
//     (async () => {
//       // 请求权限
//       const { status } = await Notifications.getPermissionsAsync();
//       if (status !== "granted") {
//         await Notifications.requestPermissionsAsync();
//       }
//     })();
//   }, []);

//   const playSound = async (sound: string) => {
//     const { sound: loadedSound } = await Audio.Sound.createAsync(sound, {
//       shouldPlay: true,
//     });
//     setSoundObject(loadedSound);
//   };

//   const stopSound = async () => {
//     if (soundObject) {
//       await soundObject.unloadAsync();
//       setSoundObject(null);
//     }
//   };

//   // 在通知栏上显示播放信息
//   useEffect(() => {
//     if (soundObject) {
//       Notifications.setNotificationHandler({
//         handleNotification: async () => ({
//           shouldShowAlert: true,
//           shouldPlaySound: false,
//           shouldSetBadge: false,
//         }),
//       });
//     }
//   }, [soundObject]);

//   return (
//     <View>
//       <Button
//         title="Play Sound"
//         onPress={() =>
//           playSound(
//             "http://nm.hzwima.com:8000/%E5%91%A8%E6%9D%B0%E4%BC%A6-%E7%A8%BB%E9%A6%99.mp3"
//           )
//         }
//       />
//       <Button title="Stop Sound" onPress={stopSound} />
//     </View>
//   );
// }
