import OpenAI from "openai";
import { City } from "../models/City";
import config from '../../config.json';


const openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY
});


export async function GPTDescribeCity(city: City) {
    const prompt = `End of description. You are playing guessing game with 
                    a human your task is to describe the city above in a way that it is not
                    obvious but that user might be able to guess it.`

    const query = city.description + prompt + city.name + 'is a city: ';
    console.log("Querying Openai ", query);
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
            role: 'user',
            content: query
        }]
    })
    console.log(response);
    if (response.choices.length == 0) {
        return null 
    }
    return response.choices[0].message.content;
}
