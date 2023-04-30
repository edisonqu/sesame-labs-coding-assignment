import react, {useEffect, useRef} from 'react'
import usdcLogo from '../Assets/USDC Coin.png'
import {useStore} from "../Store/store";
import {logDOM} from "@testing-library/react";

function Hero(){
    const walletAddress = useStore((state)=> state.userWallet)
    const hasUSDC = useStore((state)=>state.hasUSDC)
    const initialMount = useRef(true);

    async function checkUSDC(){

    }

    useEffect(() => {
        if (initialMount.current) {
            initialMount.current = false;
            return;
        }
        console.log("hfeowai")
        console.log(hasUSDC);

        if (walletAddress) {
            console.log(walletAddress)
            console.log("peepee poopoo");
        }
    }, [walletAddress, hasUSDC]);
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
                    {walletAddress && <div className="flex gap-9">
                        <button className="text-white bg-[#63B8EB] font-semibold py-2 md:py-3 px-6 md:px-8 mr-4 rounded-md">
                            Buy USDC
                        </button>
                        <button className="text-white bg-[#CC9F00] font-semibold py-2 md:py-3 px-6 md:px-8 rounded-md">
                            Verify Completion
                        </button>
                    </div>}
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