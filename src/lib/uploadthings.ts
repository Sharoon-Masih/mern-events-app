// import {
//     generateUploadButton,
//     generateUploadDropzone,
//   } from "@uploadthing/react";

import { generateReactHelpers } from "@uploadthing/react/hooks";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

// export const UploadButton = generateUploadButton<OurFileRouter>(); //we dont need these bcuz we do not use button for uploading files we have used drag and drop feature so threfore dont need it.
// export const UploadDropzone = generateUploadDropzone<OurFileRouter>();//we dont need these bcuz we do not use button for uploading files we have used drag and drop feature so threfore dont need it.

export const { useUploadThing, uploadFiles } = generateReactHelpers() //but we need this "useUploadThing" func bcuz we have to use it in eventForm you can go there and check.