'use client'

import { Check, ChevronDown, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface Province {
	code: number
	name: string
}

interface District {
	code: number
	name: string
}

interface AddressSelectorProps {
	onAddressChange?: (province: string | null, district: string | null) => void
}

export default function AddressSelector({ onAddressChange }: AddressSelectorProps) {
	const [provinces, setProvinces] = useState<Province[]>([])
	const [districts, setDistricts] = useState<District[]>([])
	const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
	const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
	const [openDropdown, setOpenDropdown] = useState<'province' | 'district' | null>(null)
	const [loading, setLoading] = useState(false)

	const containerRef = useRef<HTMLDivElement>(null)

	// Đóng dropdown khi click ra ngoài
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setOpenDropdown(null)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	useEffect(() => {
		fetch('https://provinces.open-api.vn/api/p/')
			.then((res) => res.json())
			.then(setProvinces)
	}, [])

	const handleProvinceSelect = async (p: Province) => {
		setSelectedProvince(p)
		setSelectedDistrict(null)
		setOpenDropdown(null)
		setLoading(true)
		try {
			const res = await fetch(`https://provinces.open-api.vn/api/p/${p.code}?depth=2`)
			const data = await res.json()
			setDistricts(data.districts)
		} finally {
			setLoading(false)
		}
	}

	// Báo cho parent (Dùng 1 Effect duy nhất để báo cáo)
	useEffect(() => {
		onAddressChange?.(selectedProvince?.name ?? null, selectedDistrict?.name ?? null);
	}, [selectedProvince?.name, selectedDistrict?.name, onAddressChange]);

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2" ref={containerRef}>
			{/* TỈNH THÀNH */}
			<div className="relative">
				<label className="mb-2 ml-1 block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">City</label>
				<button
					type="button"
					onClick={() => setOpenDropdown(openDropdown === 'province' ? null : 'province')}
					className="flex w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/40 p-4 text-sm transition-all hover:border-zinc-500"
				>
					<span className={selectedProvince ? 'text-white' : 'text-zinc-500'}>
						{selectedProvince?.name || 'Select City'}
					</span>
					<ChevronDown size={14} className={openDropdown === 'province' ? 'rotate-180' : ''} />
				</button>
				{openDropdown === 'province' && (
					<div className="absolute z-[100] mt-2 max-h-60 w-full overflow-x-hidden overflow-y-auto rounded-lg border border-zinc-800 bg-[#0c0c0c] shadow-2xl">
						{provinces.map((p) => (
							<div
								key={p.code}
								onClick={() => handleProvinceSelect(p)}
								className="flex cursor-pointer items-center justify-between px-4 py-3 text-[13px] transition-colors hover:bg-white hover:text-black"
							>
								{p.name}
								{selectedProvince?.code === p.code && <Check size={14} />}
							</div>
						))}
					</div>
				)}
			</div>

			{/* QUẬN HUYỆN */}
			<div className="relative">
				<label className="mb-2 ml-1 block text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
					District
				</label>
				<button
					type="button"
					disabled={!selectedProvince || loading}
					onClick={() => setOpenDropdown(openDropdown === 'district' ? null : 'district')}
					className="flex w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/40 p-4 text-sm disabled:opacity-30"
				>
					<div className="flex items-center gap-2">
						{loading && <Loader2 size={14} className="animate-spin" />}
						<span className={selectedDistrict ? 'text-white' : 'text-zinc-500'}>
							{selectedDistrict?.name || 'Select District'}
						</span>
					</div>
					<ChevronDown size={14} className={openDropdown === 'district' ? 'rotate-180' : ''} />
				</button>
				{openDropdown === 'district' && (
					<div className="absolute z-[100] mt-2 max-h-60 w-full overflow-y-auto rounded-lg border border-zinc-800 bg-[#0c0c0c] shadow-2xl">
						{districts.map((d) => (
							<div
								key={d.code}
								onClick={() => {
									setSelectedDistrict(d)
									setOpenDropdown(null)
								}}
								className="flex cursor-pointer items-center justify-between px-4 py-3 text-[13px] hover:bg-white hover:text-black"
							>
								{d.name}
								{selectedDistrict?.code === d.code && <Check size={14} />}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
