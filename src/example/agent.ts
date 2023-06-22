import * as dotenv from 'dotenv'
import { GoogleCalendarAgent } from '../index.js'

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
  const calendarAgent = await new GoogleCalendarAgent({
    mode: 'full',
    calendarOptions: googleCalendarParams,
    openApiOptions: { temperature: 0, openAIApiKey: process.env.OPENAI_API_KEY }
  }).init()

  const viewResult = await calendarAgent.execute(
    'What meetings do I have on Friday afternoon?'
  )

  // Result { output: 'You have no meetings scheduled for Friday afternoon.' }
  console.log('View Result', viewResult)

  const createResult = await calendarAgent.execute(
    'Add a reminder to call John Doe tomorrow at 2pm'
  )
  // Create Result { output: 'I have successfully created the reminder.' }
  console.log('Create Result', createResult)
}

example()
