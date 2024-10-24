import {Article} from "../types";
import {useEffect, useState} from "react";
import AppClose from "./AppClose.tsx";
import ArticleText from "./ArticleText.tsx";

interface Props {
    defaultArticle?: Article,
}

export function ArticeOverlay({defaultArticle,}: Props) {

    const [visible, setVisible] = useState<boolean>(defaultArticle !== undefined)
    const [article, setArticle] = useState<Article | undefined>(defaultArticle)


    useEffect(() => {
        setVisible(defaultArticle !== undefined)
        console.log(defaultArticle !== undefined)
        setArticle(defaultArticle)
    }, [defaultArticle]);

    return (
        <div>
            {visible && (<div className={"sideOverlay"}>
                <div style={{display: 'flex', flexDirection: "column", padding: 10}}>
                    <AppClose
                        onClick={() => {
                            setVisible(false)
                        }}
                    />
                    <div className={"sideOverlayScrollArea"}>
                        <h3>{article?.title}</h3>
                        <ArticleText article={article}/>
                    </div>
                </div>
            </div>)}
        </div>
    )
}

