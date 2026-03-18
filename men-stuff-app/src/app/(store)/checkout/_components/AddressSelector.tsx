'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface Province { code: number; name: string }
interface District { code: number; name: string }

interface AddressSelectorProps {
  onAddressChange?: (province: string | null, district: string | null) => void
}

export default function AddressSelector({ onAddressChange }: AddressSelectorProps) {
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null)
  const [loading, setLoading] = useState(false)

  // Fix infinite re-render với onAddressChange
  const onAddressChangeRef = useRef(onAddressChange)
  useEffect(() => { onAddressChangeRef.current = onAddressChange })

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/p/')
      .then((res) => res.json())
      .then(setProvinces)
  }, [])

  const handleProvinceSelect = async (p: Province) => {
    setSelectedProvince(p)
    setSelectedDistrict(null)
    setLoading(true)
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/p/${p.code}?depth=2`)
      const data = await res.json()
      setDistricts(data.districts ?? [])
    } catch {
      setDistricts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    onAddressChangeRef.current?.(
      selectedProvince?.name ?? null,
      selectedDistrict?.name ?? null
    )
  }, [selectedProvince?.name, selectedDistrict?.name])

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* TỈNH THÀNH */}
      <div className="flex flex-col gap-2">
        <label className="ml-1 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">City</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between">
              <span className={cn(!selectedProvince && 'text-zinc-500')}>
                {selectedProvince?.name || 'Select City'}
              </span>
              <ChevronsUpDown size={14} className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search city..." />
              <CommandList>
                <CommandEmpty>No city found.</CommandEmpty>
                <CommandGroup>
                  {provinces.map((p) => (
                    <CommandItem key={p.code} value={p.name} onSelect={() => handleProvinceSelect(p)}>
                      {p.name}
                      <Check className={cn('ml-auto', selectedProvince?.code === p.code ? 'opacity-100' : 'opacity-0')} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* QUẬN HUYỆN */}
      <div className="flex flex-col gap-2">
        <label className="ml-1 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">District</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              disabled={!selectedProvince || loading}
              className="w-full justify-between"
            >
              <div className="flex items-center gap-2">
                {loading && <Loader2 size={14} className="animate-spin" />}
                <span className={cn(!selectedDistrict && 'text-zinc-500')}>
                  {selectedDistrict?.name || 'Select District'}
                </span>
              </div>
              <ChevronsUpDown size={14} className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search district..." />
              <CommandList>
                <CommandEmpty>No district found.</CommandEmpty>
                <CommandGroup>
                  {districts.map((d) => (
                    <CommandItem key={d.code} value={d.name} onSelect={() => setSelectedDistrict(d)}>
                      {d.name}
                      <Check className={cn('ml-auto', selectedDistrict?.code === d.code ? 'opacity-100' : 'opacity-0')} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}