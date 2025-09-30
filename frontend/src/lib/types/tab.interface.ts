import React from "react";

export interface TabInterface {
    title: string;
    url: string;
    icon: React.ElementType;
    children?: TabInterface[];
    isJuryMember?: boolean;
}
