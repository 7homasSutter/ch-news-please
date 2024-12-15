import {NewspaperResponse} from "../../types";
import {baseURL} from "./urlConfig.ts";

class NewspaperService{
    URL: string = baseURL
    async get(): Promise<NewspaperResponse>{
        let newspaperResponse: NewspaperResponse = {success: false, message: '', newspapers: []}
        try {
            const response: Response = await fetch(`${this.URL}/newspapers`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
            if(!response.ok){
                newspaperResponse.message = response.statusText
                return newspaperResponse
            }

            newspaperResponse.newspapers = await response.json()
            newspaperResponse.success = true
            return newspaperResponse

        }catch (error: any){
            newspaperResponse.message = error
            return newspaperResponse
        }
    }
}
export const newspaperService = new NewspaperService()
