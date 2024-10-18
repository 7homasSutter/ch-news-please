import './index.css'
import Map from "./components/Map.tsx";
import {ArticleSelection} from "./components/ArticleSelection.tsx";
import {MantineProvider} from '@mantine/core';
import {Article} from "./types";
import {useState} from "react";
import '@mantine/carousel/styles.css';


function App() {

    const [articles] = useState<Article[]>([
        {id: "1", text: "An important text", title: "Ja zu Projektänderungen – autoarmer Bahnhofplatz angestrebt", newspaper: "Berner Zeitung", position: [46.94, 7.44]},
        {id: "2", text: "Alle drehen durch und keiner weiss wieso.", title: "Weil es regelrecht Bussen hagelte: Stadt Zürich ändert Regime", newspaper: "srf", position: [47.368, 8.539]},
        {id: "3",text: "Supermond und Komet erscheinen gleichzeitig am Himmel", title: "Fünf Autos kollidiert: Drei Verletzte bei Unfall im Parkhaus", newspaper: "20min", position: [47.05, 8.30]}

    ])
    const [activeArticle, setActiveArticle] = useState<Article|undefined>()

    const [visibleArticles, setVisibleArticles] = useState<Article[]>([])

    const onArticleSelected = (article: Article) => {
        setActiveArticle(article)
    }

    const onMarkerSelected = (article: Article) => {
        setActiveArticle(article)
    }


    return (
        <MantineProvider
            //@ts-ignore
            withCSSVariables
            withGlobalStyles
        >
            <div >
                <Map articles={articles} onMapSectionChanged={setVisibleArticles} notifyParentOnMarkerSelection={onMarkerSelected} selectedMarker={activeArticle} />
                <ArticleSelection data={visibleArticles} selectedArticle={activeArticle}  notifyParentOnArticleSelection={onArticleSelected}/>
            </div>
        </MantineProvider>

    )
}

export default App
