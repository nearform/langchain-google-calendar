import { ChatOpenAI } from 'langchain/chat_models/openai'
import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import readline from 'readline'
import { GoogleCalendarTool } from './src/google_calendar_tool.js'
import * as dotenv from 'dotenv'
import chalk from 'chalk'
import { checkEnvVars } from './src/utils/index.js'
dotenv.config()

checkEnvVars()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const tools = [
  new GoogleCalendarTool({
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY,
    calendarId: process.env.CALENDAR_ID
  })
]
const agent = await initializeAgentExecutorWithOptions(
  tools,
  new ChatOpenAI({
    temperature: 0
  }),
  { agentType: 'chat-zero-shot-react-description', verbose: true }
)

const showInfoMessage = () => {
  console.log(
    chalk.bold.green('Welcome to the LangChain with Google Calendar tool!')
  )
  console.log(
    chalk.bold.yellow('Supported operations: create_event, view_events')
  )
  console.log(chalk.bold('Here are examples of what you can ask:'))
  console.log(
    chalk.cyan('- Create a new meeting tomorrow at 4pm with John Doe')
  )
  console.log(
    chalk.cyan('- Create a new event today morning to discuss the project')
  )
  console.log(chalk.cyan('- What are my meetings today?'))
  console.log(chalk.cyan('- How many meetings do I have today?'))
  console.log(chalk.bold('----------------------------------------------'))
}

const enterPrompt = async () => {
  rl.question('Enter your prompt: ', async prompt => {
    if (prompt.toLowerCase() === 'exit') {
      rl.close()
      return
    }
    const result = await agent.call({
      input: prompt
    })
    console.log({ result })
    await enterPrompt()
  })
}

showInfoMessage()
await enterPrompt()
