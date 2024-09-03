"use client";
import React, { useRef, useEffect } from 'react';

const Shortcut = () => {  
    return (
        <section id="shortcut" className="relative flex flex-col flex-grow">
            <div className="flex flex-wrap justify-center px-8 py-4 w-full">
                <a href="#love" className="flex flex-1 flex-col justify-center items-center m-4 h-[25vh] rounded-lg shadow-md bg-gradient-to-br from-blue-600 to-blue-900 text-white transition duration-200 hover:shadow-lg" style={{ backgroundImage: "url('/book/Bullseye-Gradient.svg')", backgroundPosition: 'center center', backgroundSize: 'cover' }}>
                    <div className="flex m-4 p-8 rounded-[32px]">
                        <div className="inline-flex flex-col items-start">
                            <h1 className="font-semibold text-2xl">Daily Top 100</h1>
                        </div>
                    </div>
                </a>
                <a href="#feminism" className="flex flex-1 flex-col justify-center items-center m-4 h-[25vh] rounded-lg shadow-md bg-gradient-to-br from-blue-600 to-blue-900 text-white transition duration-200 hover:shadow-lg" style={{ backgroundImage: "url('/book/Cornered-Stairs.svg')", backgroundPosition: 'center center', backgroundSize: 'cover' }}>
                    <div className="flex m-4 p-8 rounded-[32px]">
                        <div className="inline-flex flex-col items-start">
                            <h1 className="font-semibold text-2xl">New releases</h1>
                        </div>
                    </div>
                </a>
                <a href="#inspirational" className="flex flex-1 flex-col justify-center items-center m-4 h-[25vh] rounded-lg shadow-md bg-gradient-to-br from-blue-600 to-blue-900 text-white transition duration-200 hover:shadow-lg" style={{ backgroundImage: "url('/book/Flat-Mountains.svg')", backgroundPosition: 'center center', backgroundSize: 'cover' }}>
                    <div className="flex m-4 p-8 rounded-[32px]">
                        <div className="inline-flex flex-col items-start">
                            <h1 className="font-semibold text-2xl">Bestsellers</h1>
                        </div>
                    </div>
                </a>
                <a href="#inspirational" className="flex flex-1 flex-col justify-center items-center m-4 h-[25vh] rounded-lg shadow-md bg-gradient-to-br from-blue-600 to-blue-900 text-white transition duration-200 hover:shadow-lg" style={{ backgroundImage: "url('/book/Quantum-Gradient.svg')", backgroundPosition: 'center center', backgroundSize: 'cover' }}>
                    <div className="flex m-4 p-8 rounded-[32px]">
                        <div className="inline-flex flex-col items-start">
                            <h1 className="font-semibold text-2xl">Top authors</h1>
                        </div>
                    </div>
                </a>
            </div>
        </section>
    );
}

export default Shortcut;


