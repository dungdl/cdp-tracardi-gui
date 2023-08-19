import Tag from "./Tag";
import React from "react";

export default function EventJourneyTag({children}) {
    return <Tag backgroundColor="#009688" color="white" tip="Customer Journey State">{children}</Tag>
}