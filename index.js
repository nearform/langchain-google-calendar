import { ChatOpenAI } from 'langchain/chat_models/openai'
import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import readline from 'readline'
import { GoogleCalendarAPIWrapper } from './src/google_calendar_tool.js'
import * as dotenv from 'dotenv'
dotenv.config()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

export const run = async () => {
  const tools = [new GoogleCalendarAPIWrapper()]
  const agent = await initializeAgentExecutorWithOptions(
    tools,
    new ChatOpenAI({
      temperature: 0,
      openAIApiKey: process.env.OPEN_AI_API_KEY
    }),
    { agentType: 'chat-zero-shot-react-description', verbose: true }
  )

  const showInfoMessage = () => {
    console.log('Welcome to the LangChain Google Calendar!')
    console.log('Supported operations: create_event, view_events')
    console.log('Here is an example of what you can ask:')
    console.log('> Create a new meeting tomorrow at 4pm with John Doe')
    console.log('> What are my meetings for today?')
    console.log('----------------------------------------------')
  }

  const askQuestion = async () => {
    rl.question('Enter your prompt: ', async question => {
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

  showInfoMessage()
  askQuestion()
}

run()
