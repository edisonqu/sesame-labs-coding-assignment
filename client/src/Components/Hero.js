import {useState} from 'react'
import usdcLogo from '../Assets/USDC Coin.png'
import {useStore} from "../Store/store";
import {ethers} from "ethers";
import axios from "axios";
import {CopyIcon} from '../Assets/SVG'


function Hero(){
    // global store of the walletAddress to take from the navbar using Zustand
    const walletAddress = useStore((state)=> state.userWallet)

    // set the coupon as null so when it does get validated, the two buttons disappear
    const [coupon, setCoupon] = useState(null);

    // authenticated call using the authentication Bearer token in localStorage
    const authenticatedAxios = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
    });

    async function checkUSDC(walletAddress){
        // initialize ethers js
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contractAddress = process.env.TOKEN_CONTRACT_ADDRESS;
        // find the balance of the user from ethersJs
        const ABI = require('../Assets/abi_USDC.json')
        const tokenContract = new ethers.Contract(contractAddress, ABI, provider)
        const userBalance = await tokenContract.balanceOf(walletAddress);

        // do the logic of if they have the balance or not here
        if (userBalance > 0) {
            // if they do, verify and add to the database and get the coupon code
            try {
                const response = await authenticatedAxios.post(`${process.env.REACT_APP_BASE_URL}/api/verify`, {"walletAddress": walletAddress})
                const coupon = response.data.coupon_code
                setCoupon(coupon)
            }
            catch (e) {
                alert(e)
            }
        }
        else{
            // if they don't alert them
            alert("You do not have the token!")
        }
    }
    function copyCouponToClipboard() {
        // copy to clipboard functionality
        navigator.clipboard.writeText(coupon).then(
            () => {
                alert('Coupon copied to clipboard!');
            },
            (err) => {
                alert('Could not copy coupon:', err);
            }
        );
    }

    return(

        <div className="flex-row">
            <div className="flex flex-col md:flex-row min-h-screen">
                <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 ">
                    <h1 className="w-10/12 py-4 text-4xl md:text-6xl font-bold text-[#63B8EB] leading-snug">
                        Get rewarded for owning USDC
                    </h1>
                    <p className="text-xl md:text-2xl text-white mt-6 mb-12">
                        Come verify you own USDC and win a free coupon code
                    </p>
                    {walletAddress && coupon===null && <div className="flex gap-9">
                        <button onClick={()=> window.open("https://app.uniswap.org/#/swap")} className="text-white bg-[#63B8EB] font-semibold py-2 md:py-3 px-6 md:px-8 mr-4 rounded-md">
                            Buy USDC
                        </button>
                        <button onClick={()=> checkUSDC(walletAddress)} className="text-white bg-[#CC9F00] font-semibold py-2 md:py-3 px-6 md:px-8 rounded-md">
                            Verify Completion
                        </button>
                    </div>}

                    {walletAddress && coupon && <button onClick={()=>copyCouponToClipboard()} className={"text-white bg-[#00CC83] font-semibold py-2 md:py-3 px-6 md:px-8 rounded-md flex items-center"}>
                        Congrats! Here’s your code {coupon} <CopyIcon /> </button>}

                </div>
                <div className="w-full md:w-1/2 flex items-center justify-center">
                    <img
                        className="w-full md:w-12/12 h-auto object-cover rounded-md shadow-lg p-3"
                        src={usdcLogo}
                        alt="Coin Image"
                    />
                </div>
            </div>
        </div>
    )
}

export default Hero