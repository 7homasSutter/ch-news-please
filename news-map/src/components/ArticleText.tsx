import {Article} from "../types";
import {ReactElement} from "react";


interface Props{
    article?: Article
}

function ArticleText({article}: Props){

    const isSubtitle = (text: string): boolean => {
        return text.split(".").length === 1
    }

    const toParagraph = (text: string, bold: boolean): ReactElement => {
        if(bold){
            return <p><strong>{text}</strong></p>
        }
        return <p>{text}</p>
    }

    return (
        <div>
            {article?.text.split("\n").map((paragraph: string) => toParagraph(paragraph, isSubtitle(paragraph)))}
        </div>
    )
}

export default ArticleText
