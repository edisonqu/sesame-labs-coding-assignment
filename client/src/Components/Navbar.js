import { ethers } from "ethers";
import {useState} from "react"
import {useStore} from "../Store/store";
import axios from 'axios'
import {DoorSVG, LogoSvg} from "../Assets/SVG";


function Navbar(){
    const setWalletAddress = useStore((state)=> state.setWalletAddress)
    const [displayWallet, setDisplayWallet] = useState("Connect Wallet")

    const authorizeWallet = async (walletAddress) =>{
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth`, {"walletAddress": walletAddress})
        console.log(response.status)

        const token = response.data.access_token;
        localStorage.setItem('access_token', token);
    }

    const signWallet = async (walletAddress) => {
        const randomNonce = Math.floor(Math.random()*10000)
        const exampleMessage = `This is proof to Sesame that I own the wallet ${walletAddress} with random nonce ${randomNonce}`
        const encoder = new TextEncoder()
        const msgUint8 = encoder.encode(exampleMessage)
        const msgHex = Array.prototype.map.call(msgUint8, x => ('00' + x.toString(16)).slice(-2)).join('')
        await ethereum.request({
            method: 'personal_sign',
            params: [`0x${msgHex}`, walletAddress, 'Example password'], // TODO: change the password
        });
    }

    const connectWallet = async () => {
        if (window.ethereum) {
            if (displayWallet !== "Connect Wallet") {
            } else {

            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await window.ethereum.request({method: 'eth_requestAccounts'});
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{chainId: "0x1"}],
                });

                const signer = await provider.getSigner();
                const walletAddress = await signer.getAddress()
                setWalletAddress(walletAddress)

                // api authorize
                await authorizeWallet(walletAddress)

                // display truncated wallet on website
                const displayWallet = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-6)}`
                setDisplayWallet(displayWallet)

                // sign wallet
                await signWallet(walletAddress)

            } catch (error) {
                if (error.code === 4001) {
                    alert("You have rejected the signature!")
                }
                else {
                    console.log(error)
                }
            }
        }
        }
        else {
            alert("Please install Metamask, there is no Ethereum wallet detected.")
        }
    }


    const disconnectWallet = async () => {
        if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts', params: [] });

        }
        setWalletAddress(null);
        setDisplayWallet("Connect Wallet");
        await window.location.reload()
    };

    return(
        <header className="shadow-m">
            <nav className="w-full my-auto px-6 py-5 md:py-4 fixed">
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-white">
                        <LogoSvg className="w-8 h-8 md:w-12 md:h-12" />
                    </div>
                    <div className="hidden md:flex items-center">
                        <button
                            onClick={connectWallet}
                            className="ml-4 px-4 py-2 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 outline focus:outline-none"
                        >
                            {displayWallet}
                        </button>
                        {displayWallet !== "Connect Wallet" && (
                            <button
                                onClick={disconnectWallet}
                                className="ml-2 px-4 py-2 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 outline focus:outline-none"
                            >
                                <DoorSVG/>
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Navbar