import { PromptTemplate } from 'langchain/prompts'
import { CREATE_EVENT_PROMPT } from '../prompts/index.js'
import { LLMChain } from 'langchain/chains'
import { getTimezoneOffsetInHours } from '../utils/index.js'
import { google } from 'googleapis'

const calendar = google.calendar('v3')
const createEvent = async (
  {
    eventSummary,
    eventStartTime,
    eventEndTime,
    userTimezone,
    eventLocation = '',
    eventDescription = ''
  },
  calendarId,
  auth
) => {
  const event = {
    summary: eventSummary,
    location: eventLocation,
    description: eventDescription,
    start: {
      dateTime: eventStartTime,
      timeZone: userTimezone
    },
    end: {
      dateTime: eventEndTime,
      timeZone: userTimezone
    }
  }

  try {
    const createdEvent = await calendar.events.insert({
      auth,
      calendarId,
      requestBody: event
    })
    return createdEvent
  } catch (error) {
    return `An error occurred: ${error}`
  }
}

const runCreateEvent = async (query, { calendarId, auth, model }) => {
  const prompt = new PromptTemplate({
    template: CREATE_EVENT_PROMPT,
    inputVariables: ['date', 'query', 'u_timezone', 'dayName']
  })
  const createEventChain = new LLMChain({
    llm: model,
    prompt
  })

  const date = new Date().toISOString()
  const u_timezone = getTimezoneOffsetInHours()
  const dayName = new Date().toLocaleString('en-us', { weekday: 'long' })

  const output = await createEventChain.call({
    query,
    date,
    u_timezone,
    dayName
  })
  const loaded = JSON.parse(output['text'])

  const [
    eventSummary,
    eventStartTime,
    eventEndTime,
    eventLocation,
    eventDescription,
    userTimezone
  ] = Object.values(loaded)

  const event = await createEvent(
    {
      eventSummary,
      eventStartTime,
      eventEndTime,
      userTimezone,
      eventLocation,
      eventDescription
    },
    calendarId,
    auth
  )

  return `Event created successfully, details: event ${event.data.htmlLink}`
}

export { runCreateEvent }
