import React, {useEffect, useState} from "react";
import L, {LatLng} from "leaflet";
import "leaflet/dist/leaflet.css";
import {Marker} from "react-leaflet";

import MarkerRed from '../assets/markerRed.svg'
import MarkerBlue from '../assets/markerBlue.svg'
import {Article} from "../types";

interface CustomMarkerProps {
    article: Article,
    onClick: (article: Article, notifyParent: boolean) => void
    isActive: boolean,
    children?: React.ReactNode; // Content to display inside the marker
}

export function AppMarker({article, isActive, onClick, children}: CustomMarkerProps) {

    const [zIndexOffset, setZIndexOffset] = useState<number>(0)

    useEffect(() => {
        setZIndexOffset(isActive ? 1 : 0)
    }, [isActive]);

    const icon = L.icon({
        iconUrl: isActive ? MarkerRed : MarkerBlue,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
    })

    // @ts-ignore
    return (
        <div>
            <Marker
                zIndexOffset={zIndexOffset}
                position={new LatLng(article.position[0], article.position[1])} icon={icon}
                eventHandlers={{click: () => onClick(article, true)}}>
                <div>
                    {children}
                </div>
            </Marker>
        </div>
    )
}
