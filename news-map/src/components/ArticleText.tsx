import {Article} from "../types";
import {ReactElement} from "react";


interface Props{
    article?: Article
}

function ArticleText({article}: Props){

    const isSubtitle = (text: string): boolean => {
        return text.split(".").length === 1
    }

    const filterLocation = (location: string): boolean => {
        return !['Unknown', 'Undefined', 'Uncertain', 'Unclear', 'None', 'N/A', 'null',,  'NI', ''].includes(location.trim())
    }

    const toParagraph = (text: string, bold: boolean): ReactElement => {
        if(bold){
            return <p><strong>{text}</strong></p>
        }
        return <p>{text}</p>
    }

    return (
        <div>
            <div style={{fontStyle: "italic"}}>{article?.location.split(",").filter((location) => filterLocation(location)).join(", ")}</div>
            {article?.keywords && <div style={{fontStyle: "italic"}}>Keywords: {article?.keywords}</div>}
            {article?.text.split("\n").map((paragraph: string) => toParagraph(paragraph, isSubtitle(paragraph)))}

        </div>
    )
}

export default ArticleText
