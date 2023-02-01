import { AudioLoader, Audio, AudioListener } from "three";
import { usePageNavStore } from "../GlassExtras/usePageNavStore";
import { useEffect, useMemo } from "react";

const audioInputsArray = [
  {
    name: "music",
    url: "./waterfallAssets/CalmAndPeaceful.mp3",
    volume: 0.3,
    loop: true,
  },
  {
    name: "uiClick",
    url: "./waterfallAssets/click-21156.mp3",
    volume: 0.3,
    loop: false,
  },
  {
    name: "river",
    url: "./waterfallAssets/River.mp3",
    volume: 0.2,
    loop: true,
  },
  {
    name: "waterfall",
    url: "./waterfallAssets/WaterfallSmall.mp3",
    volume: 0.2,
    loop: true,
  },

];

export default function Sfx() {
  const { soundLoader, soundListener, setMusic, setUiClick, setRiver, setWaterfall, setAudioListenerLoader } = usePageNavStore();

  useMemo(() => {
    if (!soundListener || !soundLoader) return;

    audioInputsArray.map((audioInput) => {
      const output = new Audio(soundListener as AudioListener);

      (soundLoader as AudioLoader).load(audioInput.url, function (buffer) {
        output.setBuffer(buffer);
        output.setLoop(audioInput.loop);
        output.setVolume(audioInput.volume);
      });
      if (audioInput.name == 'music') setMusic(output);
      else if (audioInput.name == 'uiClick') setUiClick(output);
      else if (audioInput.name == 'river') setRiver(output);
      else if (audioInput.name == 'waterfall') setWaterfall(output);
    });
    soundListener.setMasterVolume(1);
  }, [soundListener, soundLoader]);

  useEffect(() => {
    if (!soundListener || !soundLoader) {
      setAudioListenerLoader(
        new AudioListener(),
        new AudioLoader()
      );
    }
  }, [soundListener, soundLoader]);

  return null;
}

