import './index.css'
import Map from "./components/Map.tsx";
import {ArticleSelection} from "./components/ArticleSelection.tsx";
import {Loader, MantineProvider} from '@mantine/core';
import {Article, FilterData} from "./types";
import {useEffect, useState} from "react";
import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css'
import {ArticeOverlay} from "./components/ArticeOverlay.tsx";
import {useArticles} from "./services/hooks/hooks/useArticles.tsx";
import Filter from "./components/Filter.tsx";
import {useNewspapers} from "./services/hooks/hooks/useNewspapers.tsx";

function App() {

    const defaultFilter: FilterData = {
        limit: 1000,
        newspapers: [],
        keywords: [],
        maxAge: 100
    }

    const {getNewspapers, newspaperErrorProps, newsPapersAreLoading} = useNewspapers()
    const {getArticles, errorMessageProps, isLoading} = useArticles()

    const [articles, setArticles] = useState<Article[]>([])
    const [allNewspapers, setNewspapers] = useState<string[]>([])
    const [selectedFilter, setFilterSelection] = useState<FilterData>(defaultFilter)

    useEffect(() => {
        loadArticles(defaultFilter).then()
        getNewspapers().then((newspapers: string[]) => setNewspapers(newspapers))
    }, []);

    const [activeArticle, setActiveArticle] = useState<Article | undefined>()

    const [visibleArticles, setVisibleArticles] = useState<Article[]>([])

    const loadArticles = async (filter: FilterData) => {
        const loadedArticles = await getArticles(filter)
        setArticles(loadedArticles)
    }

    const onArticleSelected = (article: Article) => {
        setActiveArticle(article)
    }

    const onMarkerSelected = (article: Article) => {
        setActiveArticle(article)
    }

    const onFilterChanged = (filter: FilterData) => {
        setFilterSelection(filter)
        loadArticles(filter).then()
    }

    return (
        <MantineProvider
            //@ts-ignore
            withCSSVariables
            withGlobalStyles
        >
            <div>
                {isLoading && <Loader className="loadingCenter" color="white" size={90}></Loader>}
                    <Map articles={articles} onMapSectionChanged={setVisibleArticles}
                         notifyParentOnMarkerSelection={onMarkerSelected} selectedMarker={activeArticle}/>
                    <ArticleSelection data={visibleArticles} selectedArticle={activeArticle}
                                      notifyParentOnArticleSelection={onArticleSelected}/>
                    <ArticeOverlay defaultArticle={activeArticle}/>
                <Filter onFilterChanged={onFilterChanged} defaultFilter={selectedFilter} newspapers={allNewspapers}/>
            </div>
        </MantineProvider>
    )
}

export default App
