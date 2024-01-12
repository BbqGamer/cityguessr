import OpenAI from 'openai';

const openai = new OpenAI();

async function main() {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: 'Say this is a test' }],
        model: 'gpt-3.5-turbo',
    });
    console.log(chatCompletion.choices[0].message.content);
}

main();
