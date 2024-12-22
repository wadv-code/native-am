import type { GetItem } from "@/api";
import { GetDetail } from "@/api/api";
import { formatPath } from "./lib";
import { Audio, type AVPlaybackSource, type AVPlaybackStatus } from "expo-av";
import { getStorage } from "@/storage/long";
import { initialState } from "@/store/slices/audioSlice";
import { getStorageAsync, handleRawUrlItems } from "./store";

Audio.setAudioModeAsync({
  staysActiveInBackground: true,
  playThroughEarpieceAndroid: true,
});

type SetUpdateFn = ((status: AVPlaybackStatus) => void) | null;
type LoadSoundProps = {
  seek?: number;
  autoplay?: boolean;
};

export async function fetchSource(audio: GetItem): Promise<AVPlaybackSource> {
  if (audio.raw_url) return { uri: audio.raw_url };
  const params = {
    password: "",
    path: formatPath(audio.parent || "/", audio.name),
  };
  const { rawUrlItems } = await getStorageAsync();
  const raw = rawUrlItems.find((f) => f.key === params.path);
  if (raw) return { uri: raw.value };
  if (audio.parent) {
    try {
      const { data } = await GetDetail(params);
      handleRawUrlItems({ key: params.path, value: data.raw_url });
      return { uri: data.raw_url };
    } catch {
      return require("@/assets/audio/dx.mp3");
    }
  } else {
    return require("@/assets/audio/dx.mp3");
  }
}

export class AudioPlayer {
  private sound?: Audio.Sound;
  private onUpdate?: SetUpdateFn;
  private id?: string;

  constructor() {
    getStorage("initialAudioData", initialState.audioInfo).then((audio) => {
      this.id = audio.id;
    });
  }

  async loadSound(audio: GetItem, option: LoadSoundProps): Promise<void> {
    const { seek, autoplay } = option;
    await this.stop();
    this.sound = new Audio.Sound();
    this.sound.setOnPlaybackStatusUpdate(this.onUpdate ?? null);
    try {
      const source = await fetchSource(audio);
      await this.sound.loadAsync(source, {
        shouldPlay: autoplay || this.id !== audio.id,
        positionMillis: seek ?? audio.position,
      });
      this.id = audio.id;
    } catch (error) {
      console.error("Error loading sound:", error);
      this.id = undefined;
      throw error;
    }
  }

  async isLoaded() {
    if (this.sound) {
      try {
        const status = await this.sound.getStatusAsync();
        return status.isLoaded;
      } catch {
        return Promise.resolve(false);
      }
    } else return false;
  }

  setUpdate(func: SetUpdateFn) {
    this.onUpdate = func;
  }

  async play(autoplay?: boolean): Promise<void> {
    const audio = await getStorage("initialAudioData", initialState.audioInfo);
    if (this.sound && this.id === audio.id) {
      try {
        await this.sound.playAsync();
      } catch (error) {
        console.error("Error playing sound:", error);
        throw error;
      }
    } else {
      try {
        await this.loadSound(audio, { autoplay });
      } catch (error) {
        console.error("Error playing sound:", error);
        throw error;
      }
    }
    // else {
    //   console.warn("Sound has not been loaded yet.");
    // }
  }

  async pause(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.pauseAsync();
      } catch (error) {
        console.error("Error pausing sound:", error);
        throw error;
      }
    }
    // else {
    //   console.warn("Sound has not been loaded yet.");
    // }
  }

  async stop(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync(); // Optionally unload the sound after stopping
        this.sound = undefined;
      } catch (error) {
        console.error("Error stopping sound:", error);
        throw error;
      }
    }
    // else {
    //   console.warn("Sound has not been loaded yet.");
    // }
  }

  async seekAsync(value: number): Promise<void> {
    if (this.sound) {
      try {
        this.sound.setPositionAsync(value);
      } catch (error) {
        console.error("Error stopping sound:", error);
        throw error;
      }
    }
    // else {
    //   console.warn("Sound has not been loaded yet.");
    // }
  }

  async seek(seek: number): Promise<void> {
    const audio = await getStorage("initialAudioData", initialState.audioInfo);
    if (this.sound && this.id === audio.id) {
      try {
        await this.sound.setPositionAsync(seek);
        await this.play();
      } catch (error) {
        console.error("Error stopping sound:", error);
        throw error;
      }
    } else {
      try {
        await this.loadSound(audio, { seek, autoplay: true });
      } catch (error) {
        console.error("Error playing sound:", error);
        throw error;
      }
    }
  }
}
