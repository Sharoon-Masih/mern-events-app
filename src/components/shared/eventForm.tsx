import React from 'react'
type EventFormProps={
    userId:string,
    type:"create" | "update"
}

const EventForm = ({userId,type}:EventFormProps) => {
  return (
    <div>EventForm</div>
  )
}

export default EventForm