import OpenAI from 'openai';
import Express from 'express';

var app = Express();

app.get('/query/:message', async (req, res) => {
    var response = await queryopenai(req.params.message);
    res.end(JSON.stringify({
        response: response
    }))
});

const openai = new OpenAI();

async function queryopenai(query: string): Promise<string | null> {
    console.log('Querying OpenAI');
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: 'Say this is a test' }],
        model: 'gpt-3.5-turbo',
    });
    return chatCompletion.choices[0].message.content;
}

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
})

