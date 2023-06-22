import * as dotenv from 'dotenv'
import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { OpenAI } from 'langchain/llms/openai'
import { Calculator } from 'langchain/tools/calculator'
import { GoogleCalendarCreateTool, GoogleCalendarViewTool } from '../index.js'

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
    new GoogleCalendarCreateTool(googleCalendarParams),
    new GoogleCalendarViewTool(googleCalendarParams)
  ]

  const calendarAgent = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: 'zero-shot-react-description',
    verbose: true
  })

  const createInput = `Create a meeting with John Doe on Friday - adding to the agenda of it the result of 99 + 99`

  const createResult = await calendarAgent.call({ input: createInput })
  //   Create Result {
  //     output: 'A meeting with John Doe on Friday at 4pm with the result of 99 + 99 added to the agenda has been created.'
  //   }
  console.log('Create Result', createResult)

  const viewInput = `Check the time of my meeting with Nearform on Friday afternoon. Can you get the linkedin profile of the person I'm meeting?`

  const viewResult = await calendarAgent.call({ input: viewInput })
  //   View Result {
  //     output: "The meeting with Nearform on Friday afternoon is at 3:00 PM. Unfortunately, I cannot get the linkedin profile of the person you are meeting."
  //   }
  console.log('View Result', viewResult)
}

example()
