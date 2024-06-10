'use client'

import { useCallback, Dispatch, SetStateAction } from 'react'
// import type { FileWithPath } from '@uploadthing/react'
import { useDropzone } from '@uploadthing/react/hooks'
import { generateClientDropzoneAccept } from 'uploadthing/client'

import { Button } from '@/components/ui/button'
import { convertFileToUrl } from '@/lib/utils'
import Image from 'next/image'

interface FileUploaderProps {
    onFieldChange: (url: string) => void, //this is for onChange func that we are getting from "field.onChange".
    setFiles: Dispatch<SetStateAction<File[]>>, //this is a setState func for setting the State of "File", therefore its type is like the type o setState. 
    imageUrl: string //this is for img that we got as value from "field.value"
}


export function FileUploader({ imageUrl, onFieldChange, setFiles }: FileUploaderProps) {
   
    const onDrop = useCallback((acceptedFiles: any[]) => {  //this is for to know that when the file is drop and we use that by using the "useCallback" that is waiting for specific files to upLoad.
        setFiles(acceptedFiles) //once when the file is dropped it will setFile by using the setFiles func which we are basically getting as prop.
        onFieldChange(convertFileToUrl(acceptedFiles[0])) //yeh be "onChange" func hai jo basically event hai yeh tab triger hoga jab new File Drop krenga like wo file pehla setFiles ma set hojagi or phr next line pa yeh func call hoga or isme "convertFileToUrl" ka func call hoga jo simple "acceptedFiles[0]" ma jo file ayegi usko string ma convert krka return krega, ab ques yeh haka yeh onFieldChange ko kis tarah assign hogya asl ma hua yeh kay jo  onFieldChange ka func hai wo ek string parameter leta hai jis ka mtlb hai ka "convertFileToUrl(acceptedFiles[0])" as a parameter pass kia toh usne jo "convertFileToUrl(acceptedFiles[0])" ki return value hai wo string hai toh wo srf uspa focus krega iss lia jab "convertFileToUrl(acceptedFiles[0])" yeh func as a parameter pass kiya toh use acceot krlia.
    },[])

    const { getRootProps, getInputProps } = useDropzone({  //now here we this useDropzone hook that defines the dropzone area.
        onDrop, //yehi wohi func hai jo uper humna bnya hai yeh func basically jasay hi koi file akay drop usko setFiles ma set krwadega or iska sth hi "onFieldChange" occur hoga toh jasa hi onFieldChange occur hoga jo actual field hai joka humna apnay schema ma define ki hai "imageUrl" uski value change hoja gi or wohi value as a prop hum accept kr rhay hain  joka nichay code ma use be kr rhay hain on line 36.
        accept: 'image/*' ? generateClientDropzoneAccept(['image/*']) : undefined, //this means it will accept all types of "images" but if anything other except images so it will not accept
    })

    return (
        <div 
            {...getRootProps()} //this is the main func which we are getting from useDropzone it gives us the functionality of drag and drop on UI as well as to upload file.if we remove it so we cant able to drag n drop as well as upload. and now area of drag n drop is A/c to the size of this div bcuz the main getRootProps func is putted in this div.
            className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50">
            <input {...getInputProps()} className="cursor-pointer" />

            {imageUrl ? (  //now here we simply checking that if imageUrl exist render the div with the img. otherwise the else part will be executed and this imageUrl is getting from "field.value" property of "imageUrl" field in eventFormComponent. for more info that basically how this image is coming etc. check at line 27
                <div className="flex h-full w-full flex-1 justify-center ">
                    <Image
                        src={imageUrl}
                        alt="image"
                        width={250}
                        height={250}
                        className="w-full object-cover object-center"
                    />
                </div>
            ) : (
                <div className="flex-center flex-col py-5 text-grey-500">
                    <Image src="/assets/icons/upload.svg" width={77} height={77} alt="file upload" />
                    <h3 className="mb-2 mt-2">Drag photo here</h3>
                    <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
                    <Button type="button" className="rounded-full">
                        Select from computer
                    </Button>
                </div>
            )}
        </div>
    )
}



