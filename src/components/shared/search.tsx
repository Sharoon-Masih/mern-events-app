'use client'
import { SearchParamProps } from '@/lib/types'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'

const Search = ({placeholder}:{placeholder:string}) => {

  const [query, Setquery] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl='';
      if (query) {  //agr query ho toh new Url create hojaga.
         newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'query',
          value: query
        })
      }
      else { //else agr search bar ma input nhi hai toh jo Url ma query wagera ho wobi remove hojaye.
         newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['query']
        })
      }

        router.push(newUrl,{scroll:false}) //yeh isme jo "scroll" property hai isko false rakha hai wo iss lia bcuz we dont want kay jab jab newUrl pa navigate hon toh jo humara current browser ki position hai wo change ho like agr scroll true krtay ya by default be jab iss tarah navigate hota hai wo browser top pa scroll hojata hai isi lia isko false kia.

    }, 300);

    return ()=> clearTimeout(delayDebounceFn) //yeh jo clearTimeout ka function hai yeh jo hum timer wagera lagatay hain usko remove krta hai, ilke mtlb yeh iss lia lgya hai taka agr debounceFn uper call hogya hai toh yaha iss lia clear krdia taka agr koi delay ma execution wagera ya kuch be hai toh wo be clear hojaye.let say user jab keys ko press krega toh yeh jo debounceFn hai yeh har dafa call hoga but jo final result hai wo 300 millisec ka bd milega ab jasa mena A press kia yeh call hua but url ma change nhi ayega kiu kay jasa hi mena A press agr ma ruk jaoga toh change ajyega warna sth hi ar B press kia toh dubara say yeh debounceFn call hoga ab jo ek dafa pehla A pa be call hua tha ab phr B pa be call hua toh final output ma glitch be aa skta hai toh isslia humna yeh clearTimepout use kia hai kay agr pehla jo call ayi thi agr wo abhi resolve nhi hui toh sth hi dusri call be agy toh pehla wali call jo hai wo clearTimeout ka through clear hojagi.
  }, [query,router,searchParams])

  return (
    <div className='flex items-center justify-center bg-grey-50 min-h-[54px] w-full overflow-hidden rounded-full relative px-4 py-2'>
      <Image src="/assets/icons/search.svg" alt="icon" width={24} height={24} />
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => { Setquery(e.target.value) }}
        className='p-regular-16 border-0  outline-offset-0 placeholder:text-grey-500 bg-grey-50 
    focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 '/>
    </div>
  )
}

export default Search