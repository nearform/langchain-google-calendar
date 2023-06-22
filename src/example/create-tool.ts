import * as dotenv from 'dotenv'
import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { OpenAI } from 'langchain/llms/openai'
import { Calculator } from 'langchain/tools/calculator'
import { GoogleCalendarCreateTool } from '../index.js'

dotenv.config()

const googleCalendarParams = {
  credentials: {
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY,
    calendarId: process.env.CALENDAR_ID
  },
  scopes: [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ]
}

async function example() {
  const model = new OpenAI({
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY
  })

  const tools = [
    new Calculator(),
    new GoogleCalendarCreateTool(googleCalendarParams)
  ]

  const calendarAgent = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: 'zero-shot-react-description',
    verbose: true
  })

  const input = `Create a meeting with John Doe on Friday - adding to the agenda of it the result of 99 + 99`

  const createResult = await calendarAgent.call({ input })
  //   Create Result {
  //     output: 'A meeting with John Doe on Friday at 4pm with the result of 99 + 99 added to the agenda has been created.'
  //   }
  console.log('Create Result', createResult)
}

example()
