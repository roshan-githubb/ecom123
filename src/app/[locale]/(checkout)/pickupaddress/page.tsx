"use client"

import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';

export default function PickupAddress() {
    const [selectedStation, setSelectedStation] = useState('elites');

    return (
        <div className="min-h-screen bg-[#f5f5f5] font-sans text-[#333] pb-24 max-w-md mx-auto border-x border-gray-200">

            <div className="bg-[#4285f4] p-4 relative">
                <button className="absolute top-4 right-4 text-white">
                    <X className="w-5 h-5" />
                </button>
                <div className="flex items-start gap-3 pr-8">
                    <div>
                        <h1 className="text-white font-bold text-[15px] mb-1">Not going to be at home?</h1>
                        <p className="text-white text-[12px] leading-tight">
                            Choose a collection point station below to pick up your parcel at your convenience
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white">

                <div
                    className="p-4 border-b border-gray-200 cursor-pointer"
                    onClick={() => setSelectedStation('elites')}
                >
                    <div className="flex items-start gap-3">
                        <div className="mt-1">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedStation === 'elites' ? 'border-myBlue' : 'border-gray-300'}`}>
                                {selectedStation === 'elites' && <div className="w-3 h-3 rounded-full bg-myBlue"></div>}
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-[14px] text-gray-900">Elites Chabahil Station</h3>
                                <button className="text-[12px] text-myBlue font-medium flex items-center gap-1">
                                    Map <MapPin className="w-3 h-3 fill-myBlue" />
                                </button>
                            </div>

                            <div className="space-y-1 text-[11px]">
                                <div className="flex">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Phone</span>
                                    <span className="text-gray-700">9801340983</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Address</span>
                                    <span className="text-gray-700 leading-tight">
                                        Opposite of Helping hand hospital, very far behind Chabahil Ganesh Mandir, Metro 7 - Chabahil Area, Kathmandu Metro 7 - Chabahil Area,Bagmati Province
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-400 text-[10px] italic">Bagmati Province,Kathmandu Metro 7 - Chabahil Area...</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Hours</span>
                                    <span className="text-gray-700">09:00:00-19:00:00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="p-4 border-b border-gray-200 cursor-pointer"
                    onClick={() => setSelectedStation('dex-gopi')}
                >
                    <div className="flex items-start gap-3">
                        <div className="mt-1">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedStation === 'dex-gopi' ? 'myBlue' : 'border-gray-300'}`}>
                                {selectedStation === 'dex-gopi' && <div className="w-3 h-3 rounded-full bg-myBlue"></div>}
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-[14px] text-gray-900">DEX Gopi Krishna Station</h3>
                                <button className="text-[12px] text-myBlue font-medium flex items-center gap-1">
                                    Map <MapPin className="w-3 h-3 fill-myBlue" />
                                </button>
                            </div>

                            <div className="space-y-1 text-[11px]">
                                <div className="flex">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Phone</span>
                                    <span className="text-gray-700">9801340982</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Address</span>
                                    <span className="text-gray-700 leading-tight">
                                        Gopi Krishna Nagar, Near Gopi Krishna Mandir, Gopi Krishna Hall Area,Kathmandu Metro 7 - Chabahil Area,Bagmati Province
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-400 text-[10px] italic">Bagmati Province,Kathmandu Metro 7 - Chabahil Area...</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Hours</span>
                                    <span className="text-gray-700">09:00:00-19:00:00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="p-4 border-b border-gray-200 cursor-pointer"
                    onClick={() => setSelectedStation('aramex')}
                >
                    <div className="flex items-start gap-3">
                        <div className="mt-1">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedStation === 'aramex' ? 'border-myBlue' : 'border-gray-300'}`}>
                                {selectedStation === 'aramex' && <div className="w-3 h-3 rounded-full bg-myBlue"></div>}
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-[14px] text-gray-900">Aramex Tushal Station</h3>
                                <button className="text-[12px] text-myBlue font-medium flex items-center gap-1">
                                    Map <MapPin className="w-3 h-3 fill-myBlue" />
                                </button>
                            </div>

                            <div className="space-y-1 text-[11px]">
                                <div className="flex">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Phone</span>
                                    <span className="text-gray-700">9710357811</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Address</span>
                                    <span className="text-gray-700 leading-tight">
                                        Opposite of Tushal KFC, Kathmandu Metro 2 - Kalanki Area, Kathmandu Outside Ring Road, Kathmandu Outside Ring Road,Bagmati Province
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-400 text-[10px] italic">Bagmati Province,Kathmandu Outside Ring Road...</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Hours</span>
                                    <span className="text-gray-700">09:00:00-17:00:00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="p-4 border-b border-gray-200 cursor-pointer"
                    onClick={() => setSelectedStation('dex-sinamangal')}
                >
                    <div className="flex items-start gap-3">
                        <div className="mt-1">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedStation === 'dex-sinamangal' ? 'border-myBlue' : 'border-gray-300'}`}>
                                {selectedStation === 'dex-sinamangal' && <div className="w-3 h-3 rounded-full bg-myBlue"></div>}
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-[14px] text-gray-900">DEX Sinamangal Station</h3>
                                <button className="text-[12px] text-myBlue font-medium flex items-center gap-1">
                                    Map <MapPin className="w-3 h-3 fill-myBlue" />
                                </button>
                            </div>

                            <div className="space-y-1 text-[11px]">
                                <div className="flex">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Phone</span>
                                    <span className="text-gray-700">9710662970</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Address</span>
                                    <span className="text-gray-700 leading-tight">
                                        Kathmandu Metro 9 - Sinamangal Area ward no.9, Sinamangal, Kathmandu Metro 9 - Sinamangal Area,Bagmati Province
                                    </span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-400 text-[10px] italic">Bagmati Province,Kathmandu Metro 9 - Sinamangal...</span>
                                </div>
                                <div className="flex">
                                    <span className="text-gray-500 w-20 flex-shrink-0">Hours</span>
                                    <span className="text-gray-700">09:00:00-19:00:00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white p-4 z-10 max-w-md mx-auto border-t border-gray-200">
                <button className="w-full bg-myBlue text-white font-medium text-[15px] py-3.5 rounded-sm shadow-sm hover:bg-myBlue transition-colors">
                    Confirm
                </button>
            </div>

        </div>
    );
}
