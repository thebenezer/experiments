import { ISheet, getProject } from '@theatre/core';
import {create} from 'zustand';
import projectState from "../../../public/waterfallAssets/GlassProject.theatre-project-state.json"

interface IEnter {
    enterSite: boolean,
    page:number,
    updateEnterSite: () => void,
    updatePage: (newPage:number) => void,
    mainSheet: ISheet;

}

export const usePageNavStore = create<IEnter>( (set) => ({
    enterSite: false,
    page:0,
    updateEnterSite: () => {set({enterSite:true})},
    updatePage: (newPage:number) => {set({page:newPage})},
    mainSheet : getProject('GlassProject4',{state:projectState}).sheet('Glass'),
    // mainSheet : getProject('GlassProject').sheet('Glass'),
    // mainSheet : null,
}));