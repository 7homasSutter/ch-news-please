import {MapContainer, TileLayer,} from "react-leaflet";
import {useMap} from "react-leaflet/hooks"
import {useEffect, useState} from "react";
import {LatLng} from "leaflet";
import {Article} from "../types";
import {AppMarker} from "./AppMarker.tsx";


interface MapProps {
    articles: Article[],
    onMapSectionChanged: (articles: Article[]) => void,
    selectedMarker: Article | undefined,
    notifyParentOnMarkerSelection: (article: Article) => void
}

function NewsMap({articles, selectedMarker, notifyParentOnMarkerSelection, onMapSectionChanged}: MapProps) {

    const [visibleArticles, setVisibleArticles] = useState<Article[]>([]);
    const [activeMarker, setActiveMarker] = useState<Article|undefined>(selectedMarker)

    const map = useMap()

    useEffect(() => {
        if (!map) {
            return
        }
        updateVisibleMarkers()

        map.on('move', function () {
            updateVisibleMarkers()
        })
        map.on('zoomend', function () {
            updateVisibleMarkers()

        });
    }, [map]);

    useEffect(() => {
        if(selectedMarker){
            selectArticle(selectedMarker)
        }

    }, [selectedMarker]);

    const selectArticle = (article: Article, notifyParent=false) => {
        setActiveMarker(article)
        map.setView(new LatLng(article.position[0], article.position[1]), 10, {duration: 0.5, animate: true})
        if(notifyParent){
            notifyParentOnMarkerSelection(article)
        }
    }

    const updateVisibleMarkers = () => {
        const bounds = map.getBounds()
        const newArticles = []
        for (const article of articles) {
            if (bounds.contains(new LatLng(article.position[0], article.position[1]))) {
                newArticles.push(article)
            }
        }
        setVisibleArticles(newArticles)
        onMapSectionChanged(newArticles) //todo: perhaps it's needed to check if articles changed and call method only in this case
    }

    return (
        <>
            {visibleArticles
                .map(article => <AppMarker
                    article={article}
                    onClick={selectArticle}
                    isActive={article.id === activeMarker?.id}/>)}
        </>
    )

}


export default function Map({articles, selectedMarker, notifyParentOnMarkerSelection, onMapSectionChanged}: MapProps) {

    return (
        <>
            <MapContainer
                center={[46.8, 8.3]}
                zoom={8.5}
                scrollWheelZoom={true}

            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <NewsMap onMapSectionChanged={onMapSectionChanged} articles={articles} selectedMarker={selectedMarker} notifyParentOnMarkerSelection={notifyParentOnMarkerSelection}/>
            </MapContainer>

        </>

    )
}
