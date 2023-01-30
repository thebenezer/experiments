import {create} from 'zustand';

interface IEnter {
    enterSite: boolean,
    updateEnterSite: () => void

}

export const useEnterSiteStore = create<IEnter>( (set) => ({
    enterSite: false,
    updateEnterSite: () => {set({enterSite:true})}

}));
// const useStore = create((set) => ({
//     pokemons: [{ id: 1, name: "Bulbasaur" },
//     { id: 2, name: "Ivysaur" },
//     { id: 3, name: "Venusaur" },
//     { id: 4, name: "Charmander" },
//     { id: 5, name: "Charmeleon" },
//     ],
//     addPokemons: (pokemon: { name: any; }) =>
//         set((state: { pokemons: any; }) => ({
//             pokemons: [
//                 { name: pokemon.name, id: Math.random() * 100 },
//                 ...state.pokemons,
//             ]
//         })),
//     removePokemon: (id: any) =>
//         set((state: { pokemons: any[]; }) => ({
//             pokemons: state.pokemons.filter((pokemon) => pokemon.id !== id),
//         })),
// }));
// export default useStore;