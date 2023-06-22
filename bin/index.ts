import { createInterface } from 'readline'
import { GoogleCalendarAgent } from '../dist/index.js'
import * as dotenv from 'dotenv'
import chalk from 'chalk'
import { checkEnvVars } from '../dist/utils/index.js'
import util from 'util'
dotenv.config()

checkEnvVars()

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = util.promisify(rl.question).bind(rl)

const googleCalendarParams = {
  credentials: {
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY,
    calendarId: process.env.CALENDAR_ID
  }
}

const agent = await new GoogleCalendarAgent({
  mode: 'full',
  calendarOptions: googleCalendarParams
}).init()

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
  const prompt = (await question('Enter your prompt: ')) as unknown as string
  if (prompt.toLowerCase() === 'exit') {
    rl.close()
  } else {
    const result = await agent.execute(prompt)
    console.log({ result })
    await enterPrompt()
  }
}

showInfoMessage()
await enterPrompt()
