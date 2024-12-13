import {useState} from "react";
import {ErrorMessageProps, NewspaperResponse} from "../../../types";
import {newspaperService} from "../../api/NewspaperService.ts";

export const useNewspapers = () => {
    const [newspaperErrorProps, setErrorMessageProps] = useState<ErrorMessageProps>({error: false, message: ''})
    const [newsPapersAreLoading, setIsLoading] = useState(false)

    const getNewspapers = async() => {
        setIsLoading(true)
        setErrorMessageProps({error: false, message: ''})


        const newspaperResponse: NewspaperResponse = await newspaperService.get()
        if(!newspaperResponse.success){
            setErrorMessageProps({error: true, message: newspaperResponse.message})
        }
        setIsLoading(false)
        return newspaperResponse.newspapers
    }

    return {getNewspapers, newsPapersAreLoading, newspaperErrorProps}

}
