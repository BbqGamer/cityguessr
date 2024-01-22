import OpenAI from "openai";
import { City } from "../models/City";
import config from '../../config.json';


const openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY
});


export async function GPTDescribeCity(city: City) {
    const prompt = `End of description. You are playing guessing game with 
                    a human your task is to describe the city of ` + city.name +
                    `in a way that it is not obvious but that user might be able to guess it
                    Use many details related to the city but do not reveal its name or country `

    const query = city.description + prompt + city.name + 'is a city';
    console.log("Querying Openai ", query);
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
            role: 'user',
            content: query,
        }],
    })
    console.log(response);
    if (response.choices.length == 0) {
        return null 
    }
    const answer = response.choices[0].message.content;
    if (answer) {
        return answer.replace(new RegExp(city.name, 'gi'), 'X');
    } else {
        return null
    }
}
