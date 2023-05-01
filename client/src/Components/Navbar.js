import { ethers } from "ethers";
import {useState} from "react"
import {useStore} from "../Store/store";
import axios from 'axios'
import {DoorSVG, LogoSvg} from "../Assets/SVG";



function Navbar(){
    const setWalletAddress = useStore((state)=> state.setWalletAddress)
    const [displayWallet, setDisplayWallet] = useState("Connect Wallet")

    const disconnectWallet = () => {
        if (window.ethereum) {

            window.ethereum.request({ method: 'eth_requestAccounts', params: [] });

        }
        setWalletAddress(null);
        setDisplayWallet("Connect Wallet");
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            if (displayWallet !== "Connect Wallet") {
                console.log("faohihaewoifahweiohaweifohaw")
            } else {

            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                // Wallet Connect
                await window.ethereum.request({method: 'eth_requestAccounts'});

                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{chainId: "0x1"}],
                });

                const signer = await provider.getSigner();
                const walletAddress = await signer.getAddress()
                console.log("Account:", walletAddress);

                // api authorize
                const response = await axios.post("http://127.0.0.1:5000/api/auth", {"walletAddress": walletAddress})
                console.log(response)

                const token = response.data.access_token;
                localStorage.setItem('access_token', token);

                setWalletAddress(walletAddress)

                // display truncated wallet on website
                const displayWallet = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-6)}`
                setDisplayWallet(displayWallet)

                // sign message
                const exampleMessage = "i am vitalik"
                const encoder = new TextEncoder()
                const msgUint8 = encoder.encode(exampleMessage)
                const msgHex = Array.prototype.map.call(msgUint8, x => ('00' + x.toString(16)).slice(-2)).join('')

                const sign = await ethereum.request({
                    method: 'personal_sign',
                    params: [`0x${msgHex}`, walletAddress, 'Example password'],
                });
                console.log(sign)
            } catch (error) {
                if (error.code === 4001) {
                    console.log("yes")
                    alert("You have rejected the signature!")
                }
                // console.log("Error", error)
            }
        }
        }
        else {
            alert("Please install Metamask, there is no Ethereum wallet detected.")
        }
    }

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