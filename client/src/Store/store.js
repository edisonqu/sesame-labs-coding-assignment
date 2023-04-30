 import {create} from 'zustand'

 export const useStore = create((set)=> ({
     userWallet: "",
     setWalletAddress: (str) => set({userWallet:str}),
 }))