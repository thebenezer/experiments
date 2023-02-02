import { ISheet, getProject } from '@theatre/core';
import { create } from 'zustand';
import projectState from "../../../public/waterfallAssets/GlassProject.theatre-project-state.json";
import { AudioLoader, Audio, AudioListener } from 'three';

interface IEnter {
    enterSite: boolean,
    page: number,
    updateEnterSite: () => void,
    updatePage: (newPage: number) => void,
    mainSheet: ISheet;
    soundLoader: AudioLoader | null;
    soundListener: AudioListener | null;
    soundOn: Boolean;
    music: Audio | null,
    uiClick: Audio | null,
    river: Audio | null,
    waterfall: Audio | null,
    setSoundOn: (value: Boolean) => void;
    setAudioListenerLoader: (listener: AudioListener, loader: AudioLoader) => void,
    setMusic: (sound: Audio) => void,
    setUiClick: (sound: Audio) => void,
    setRiver: (sound: Audio) => void;
    setWaterfall: (sound: Audio) => void;
}

export const usePageNavStore = create<IEnter>((set) => ({
    enterSite: false,
    page: 0,
    updateEnterSite: () => { set({ enterSite: true }); },
    updatePage: (newPage: number) => { set({ page: newPage }); },
    mainSheet: getProject('GlassProject4', { state: projectState }).sheet('Glass'),
    soundLoader: null,
    soundListener: null,
    soundOn: true,
    music: null,
    uiClick: null,
    river: null,
    waterfall: null,
    setSoundOn: (value: Boolean) => {
        set({
            soundOn: value
        });
    },
    setAudioListenerLoader: (listener, loader) => {
        set({
            soundLoader: loader,
            soundListener: listener
        });
    },
    setMusic: (sound: Audio) => {
        set({
            music: sound
        });
    },
    setUiClick: (sound: Audio) => {
        set({
            uiClick: sound
        });
    },
    setRiver: (sound: Audio) => {
        set({
            river: sound
        });
    },
    setWaterfall: (sound: Audio) => {
        set({
            waterfall: sound
        });
    },
}));