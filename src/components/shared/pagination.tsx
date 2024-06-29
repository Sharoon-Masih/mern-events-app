'use client'
import React from 'react'
import { Button } from '../ui/button'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { formUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'

type paginationProp = {
    page: number | string,
    totalPage: number,
    urlParamName?: string
}
const Pagination = ({ urlParamName, totalPage, page }: paginationProp) => {

const router = useRouter()
const searchParams = useSearchParams()
const onClickBtn = (btnType:"prev" | "next") => {
//ab first yeh haka pehla yeh define krein kay agr "prev" btn pa click hua hai toh kya perform hoga or agr "next" btn pa click hua hai toh kya action perform hoga.

const pageValue= btnType === "prev" ? Number(page) - 1 : Number(page) + 1; //yaha ab humna yeh kia haka agr  "prev" btn pa click hua hai toh pageValue ko 1 kam kar denge or agr "next" btn pa click hua hai toh pageValue ko 1 zeada kar denga, or iss yeh hoga kay jab database sa query hogi toh wo automatically A/c to page number ka data ayega.

const newUrl=formUrlQuery({ //yaha basic humna ek newUrl create jisme "page" number wala query parameter hoga jiski base pa further pagination hogi, like this: www.evently.com/?page=1

    params:searchParams.toString(), //yeh string ka method normal nhi hai yeh basic jo query string ayi hai usko simple string ki form ma return krega jo hum use kreinga agay.
    key:urlParamName || "page", //yeh yaha jo urlParamName basically jab hum page.tsx pa hongay which is home page toh usme jo humary query parameter get hoga uska name "page" hoga joka humna "||" condition ka sth likh be dia, but like jo profile page hai waha two things hain ek toh Order/ticket and 2nd events hain, toh ab zahir hai hum yehi chahtay hain kay agr profile page pa event ka liya pagination ho toh phr Url ma query parameter eventPage ayy and agr order ka liya ho toh query parameter orderPage ayy, to uss ko achieve krnay ka liya humna yaha urlParamName jiska mtlb kay agr usme value hogi toh newUrl ma key jo be urlParamName ki value hogi otherwise key will be set to "page" . 
    value:pageValue.toString(),
})

router.push(newUrl,{scroll:false}) //or yaha jo be newUrl ayega uspa user navigate hojayega, basically route wgera toh same hi hongi kiu kay URL ma srf search parameter hi change hongay.

}
return (
<div className='flex gap-5 '>
    <Button //NOw we have created two btn one for prev page and other for next page
        size={"lg"}
        className='w-16 p-0 h-16 rounded-full bg-primary-50'
        variant={"outline"}
        disabled={Number(page) <= 1} //yaha yeh condition set ki haka agr page number less than or equal to 1 hoga toh phr jo previous page ka btn hai wo disable hojaga mtlb kay phr uspa click wagera jo be krein wo work nhi krega
        onClick={()=>{onClickBtn("prev")}} //yeh function ka through baki functionality perform hogi.
        >
        <ArrowLeftIcon />
    </Button>
    <Button
        size={"lg"}
        className='w-16 p-0 h-16 rounded-full bg-primary-50'
        variant={"outline"}
        disabled={Number(page) >= totalPage} //or yaha yeh cndition lgyi haka jo page number hoga agr wo totalpage ka equal hua tab be next wala btn disable hojaga ya agr page number > hua totalpage say tab, or yeh iss lia kia kiu kay obvious si bt hai let say agr 2 total page hain toh jab page = 1 hoga toh its mean user abhi page number 1 pa hai toh jo next btn hai wo disable nhi hoga bcuz totalPage = 2 its mean ka abhi ek page or hai but jasa hi user page number 2 pa jayega toh next Btn disable hojayega kiu kay total page 2 hi thay or user is now on page number 2 toh iska mtlb kay isse agay koi page hai hi nhi, iss lia wo disable hojayega.
        onClick={()=>{onClickBtn("next")}}
        >
        <ArrowRightIcon />
    </Button>
</div>
)
}

export default Pagination