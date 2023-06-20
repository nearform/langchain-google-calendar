import * as dotenv from 'dotenv'
import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { OpenAI } from 'langchain/llms/openai'
import { SerpAPI } from 'langchain/tools'
import { GoogleCalendarViewTool } from '../src/index.js'

dotenv.config()

async function example() {
  const model = new OpenAI({
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY
  })

  const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
      location: 'London,United Kingdom',
      hl: 'en',
      gl: 'uk'
    }),
    new GoogleCalendarViewTool({
      clientEmail: process.env.CLIENT_EMAIL,
      privateKey: process.env.PRIVATE_KEY,
      calendarId: process.env.CALENDAR_ID
    })
  ]

  const calendarAgent = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: 'zero-shot-react-description',
    verbose: true
  })

  const input = `Check the time of my meeting with Nearform on Friday afternoon. Can you get the linkedin profile of the person I'm meeting?`

  const viewResult = await calendarAgent.call({ input })
  //   View Result {
  //     output: "The meeting with Nearform on Friday afternoon is at 3:00 PM. Unfortunately, I cannot get the linkedin profile of the person you are meeting."
  //   }
  console.log('View Result', viewResult)
}

example()
