import { ChatOpenAI } from 'langchain/chat_models/openai'
import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { RequestsGetTool, RequestsPostTool } from 'langchain/tools'
import readline from 'readline'
import { GoogleCalendarAPIWrapper } from './src/google_calendar_tool.js'
import * as dotenv from 'dotenv'
dotenv.config()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

export const run = async () => {
  const tools = [
    new RequestsGetTool(),
    new RequestsPostTool(),
    new GoogleCalendarAPIWrapper()
  ]
  const agent = await initializeAgentExecutorWithOptions(
    tools,
    new ChatOpenAI({
      temperature: 0,
      openAIApiKey: process.env.OPEN_AI_API_KEY
    }),
    { agentType: 'chat-zero-shot-react-description', verbose: true }
  )

  const askQuestion = async () => {
    rl.question('Enter your question: ', async question => {
      if (question.toLowerCase() === 'exit') {
        rl.close()
        return
      }
      const result = await agent.call({
        input: question
      })
      console.log({ result })
      askQuestion()
    })
  }

  askQuestion()
}

run()
