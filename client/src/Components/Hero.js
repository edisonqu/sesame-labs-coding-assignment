import {useState} from 'react'
import usdcLogo from '../Assets/USDC Coin.png'
import {useStore} from "../Store/store";
import {ethers} from "ethers";
import axios from "axios";
import {CopyIcon} from '../Assets/SVG'

function Hero(){
    const walletAddress = useStore((state)=> state.userWallet)
    const [coupon, setCoupon] = useState(null);

    const authenticatedAxios = axios.create({
        baseURL: 'http://127.0.0.1:5000/',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
    });

    async function checkUSDC(walletAddress){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const usdcContractAddress = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
        const usdcABI = require('../Assets/abi_USDC.json')
        const usdcContract = new ethers.Contract(usdcContractAddress, usdcABI, provider)
        const userBalance = await usdcContract.balanceOf(walletAddress);
        console.log(userBalance.toString())

        if (userBalance > 0) {
            try {
                const response = await authenticatedAxios.post("http://127.0.0.1:5000/api/verify", {"walletAddress": walletAddress})
                const coupon = response.data.coupon_code
                setCoupon(coupon)
            }
            catch (e) {
                alert(e)
            }
        }
        else{
            alert("You have no USDC!")
        }
    }
    function copyCouponToClipboard() {
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
                        alt="Hero Image"
                    />
                </div>
            </div>
        </div>
    )
}

export default Hero