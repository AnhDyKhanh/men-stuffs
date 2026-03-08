'use client'

import { useState, useEffect } from 'react'
import { MapPin, ChevronDown, Check, Loader2 } from 'lucide-react'

interface Province {
    code: number;
    name: string;
}

interface District {
    code: number;
    name: string;
}

export default function AddressSelector() {
    const [provinces, setProvinces] = useState<Province[]>([])
    const [districts, setDistricts] = useState<District[]>([])

    const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)

    const [openDropdown, setOpenDropdown] = useState<'province' | 'district' | null>(null)
    const [loading, setLoading] = useState(false)

    // 1. Lấy danh sách Tỉnh/Thành phố khi component mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const res = await fetch('https://provinces.open-api.vn/api/p/')
                const data = await res.json()
                setProvinces(data)
            } catch (error) {
                console.error("Lỗi lấy dữ liệu tỉnh thành:", error)
            }
        }
        fetchProvinces()
    }, [])

    // 2. Lấy danh sách Quận/Huyện khi Tỉnh thay đổi
    useEffect(() => {
        if (!selectedProvince) {
            setDistricts([])
            return
        }

        const fetchDistricts = async () => {
            setLoading(true)
            try {
                const res = await fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
                const data = await res.json()
                setDistricts(data.districts)
            } catch (error) {
                console.error("Lỗi lấy dữ liệu quận huyện:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchDistricts()
        setSelectedDistrict(null) // Reset huyện khi đổi tỉnh
    }, [selectedProvince])

    return (
        <div className="space-y-4">

            {/* CHỌN TỈNH / THÀNH PHỐ */}
            <div className="relative">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 ml-1 mb-2 block font-bold">
                    City / Province
                </label>
                <button
                    type="button"
                    onClick={() => setOpenDropdown(openDropdown === 'province' ? null : 'province')}
                    className="w-full bg-zinc-900/40 border border-zinc-800 p-4 rounded-md flex justify-between items-center hover:border-white transition-all text-sm group"
                >
                    <span className={selectedProvince ? 'text-white' : 'text-zinc-500 italic'}>
                        {selectedProvince ? selectedProvince.name : 'Search your city...'}
                    </span>
                    <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === 'province' ? 'rotate-180' : ''}`} />
                </button>

                {openDropdown === 'province' && (
                    <div className="absolute z-[100] w-full mt-2 bg-[#0a0a0a] border border-zinc-800 rounded-lg shadow-2xl max-h-72 overflow-y-auto custom-scrollbar ring-1 ring-white/10 animate-in fade-in slide-in-from-top-2">
                        {provinces.map((p) => (
                            <div
                                key={p.code}
                                onClick={() => { setSelectedProvince(p); setOpenDropdown(null); }}
                                className="flex items-center justify-between px-5 py-4 hover:bg-white hover:text-black cursor-pointer transition-all border-b border-zinc-900/50 last:border-0 group"
                            >
                                <div className="flex items-center gap-4">
                                    <MapPin size={14} className="text-zinc-600 group-hover:text-black" />
                                    <span className="text-[13px] font-medium">{p.name}</span>
                                </div>
                                {selectedProvince?.code === p.code && <Check size={14} className="text-white group-hover:text-black" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CHỌN QUẬN / HUYỆN */}
            <div className="relative">
                <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 ml-1 mb-2 block font-bold">
                    District
                </label>
                <button
                    type="button"
                    disabled={!selectedProvince || loading}
                    onClick={() => setOpenDropdown(openDropdown === 'district' ? null : 'district')}
                    className={`w-full bg-zinc-900/40 border border-zinc-800 p-4 rounded-md flex justify-between items-center transition-all text-sm ${!selectedProvince ? 'opacity-30 cursor-not-allowed' : 'hover:border-white'}`}
                >
                    <div className="flex items-center gap-2">
                        {loading && <Loader2 size={14} className="animate-spin" />}
                        <span className={selectedDistrict ? 'text-white' : 'text-zinc-500 italic'}>
                            {selectedDistrict ? selectedDistrict.name : 'Select district...'}
                        </span>
                    </div>
                    <ChevronDown size={14} />
                </button>

                {openDropdown === 'district' && districts.length > 0 && (
                    <div className="absolute z-[100] w-full mt-2 bg-[#0a0a0a] border border-zinc-800 rounded-lg shadow-2xl max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                        {districts.map((d) => (
                            <div
                                key={d.code}
                                onClick={() => { setSelectedDistrict(d); setOpenDropdown(null); }}
                                className="flex items-center justify-between px-5 py-4 hover:bg-white hover:text-black cursor-pointer transition-all border-b border-zinc-900/50"
                            >
                                <span className="text-[13px] font-medium">{d.name}</span>
                                {selectedDistrict?.code === d.code && <Check size={14} />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}