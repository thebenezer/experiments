import {create} from 'zustand';

interface IEnter {
    enterSite: boolean,
    page:number,
    updateEnterSite: () => void,
    updatePage: (newPage:number) => void,

}

export const usePageNavStore = create<IEnter>( (set) => ({
    enterSite: false,
    page:0,
    updateEnterSite: () => {set({enterSite:true})},
    updatePage: (newPage:number) => {set({page:newPage})}
}));