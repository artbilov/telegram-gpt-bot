require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api')
const tgtoken = process.env.TELEGRAM_BOT_TOKEN
const apiKey = process.env.OPENAI_API_KEY
const myChatId = process.env.MY_CHAT_ID
const bot = new TelegramBot(tgtoken, { polling: true })

// bot.onText(/\/help/, (msg) => {
//   bot.sendMessage(msg.chat.id, "This is a help message.");
// });

bot.onText(/[^\/].*/, async (msg) => {
  console.log(msg.chat.id)
  if (msg.chat.id != myChatId) {
    let response = "_You are not allowed to use this bot._"
    bot.sendMessage(msg.chat.id, response, { parse_mode: 'Markdown' });
    return
  }
  const prompt = msg.text
  const gptResponse = await askGpt(prompt)

  bot.sendMessage(msg.chat.id, gptResponse, { parse_mode: 'Markdown' });
});

async function askGpt(prompt) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  const data = JSON.stringify({
    model: 'gpt-3.5-turbo',
    max_tokens: 500,
    messages: [{ role: 'assistant', content: prompt }],
    temperature: 0.7
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: headers,
    body: data
  })
  const answer = await response.json()

  return answer.choices[0].message.content
}