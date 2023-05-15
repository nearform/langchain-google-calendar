import { google } from 'googleapis'
import { Tool } from 'langchain/tools'
import { LLMChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { EVENT_CLASSIFICATION_PROMPT } from './prompts/event-classification-prompt.js'
import { CREATE_EVENT_PROMPT } from './prompts/create-event-prompt.js'
import { getTimezoneOffsetInHours } from './utils/get-timezone-offset-in-hours.js'
import { VIEW_EVENTS_PROMPT } from './prompts/view-events-prompt.js'

const calendar = google.calendar('v3')

export class GoogleCalendarAPIWrapper extends Tool {
  constructor() {
    super()
    this.SCOPES = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ]
    Object.defineProperty(this, 'name', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 'google_calendar'
    })
    Object.defineProperty(this, 'description', {
      enumerable: true,
      configurable: true,
      writable: true,
      value:
        'A tool for managing and retrieving Google Calendar events. Input should be the initial user prompt'
    })
    this.model = new OpenAI({
      temperature: 0,
      openAIApiKey: process.env.OPEN_AI_API_KEY
    })
  }

  async getAuth() {
    const auth = new google.auth.JWT(
      process.env.CLIENT_EMAIL,
      null,
      process.env.PRIVATE_KEY,
      this.SCOPES
    )

    return auth
  }

  async createEvent(
    eventSummary,
    eventStartTime,
    eventEndTime,
    userTimezone,
    eventLocation = '',
    eventDescription = ''
  ) {
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

    const auth = await this.getAuth()

    try {
      const createdEvent = await calendar.events.insert({
        auth,
        calendarId: process.env.CALENDAR_ID,
        requestBody: event
      })
      return createdEvent
    } catch (error) {
      return `An error occurred: ${error}`
    }
  }

  async runClassification(query) {
    const prompt = new PromptTemplate({
      template: EVENT_CLASSIFICATION_PROMPT,
      inputVariables: ['query']
    })
    const createEventChain = new LLMChain({
      llm: this.model,
      prompt: prompt,
      verbose: true
    })

    return (await createEventChain.call({ query })).text
  }

  async runCreateEvent(query) {
    const prompt = new PromptTemplate({
      template: CREATE_EVENT_PROMPT,
      inputVariables: ['date', 'query', 'u_timezone']
    })
    const createEventChain = new LLMChain({
      llm: this.model,
      prompt
    })

    const date = new Date().toISOString()
    const u_timezone = getTimezoneOffsetInHours()

    const output = await createEventChain.call({ query, date, u_timezone })
    const loaded = JSON.parse(output['text'])

    const [
      eventSummary,
      eventStartTime,
      eventEndTime,
      eventLocation,
      eventDescription,
      userTimezone
    ] = Object.values(loaded)

    const event = await this.createEvent(
      eventSummary,
      eventStartTime,
      eventEndTime,
      userTimezone,
      eventLocation,
      eventDescription
    )

    return `Event created successfully, details: event ${event.data.htmlLink}`
  }

  async runViewEvents(query) {
    const prompt = new PromptTemplate({
      template: VIEW_EVENTS_PROMPT,
      inputVariables: ['date', 'query', 'u_timezone']
    })
    const viewEventsChain = new LLMChain({
      llm: this.model,
      prompt
    })

    const date = new Date().toISOString()
    const u_timezone = getTimezoneOffsetInHours()

    const output = await viewEventsChain.call({ query, date, u_timezone })
    const loaded = JSON.parse(output['text'])

    const auth = await this.getAuth()

    try {
      const response = await calendar.events.list({
        auth,
        calendarId: process.env.CALENDAR_ID,
        ...loaded
      })

      let outputString = ''
      response.data.items.forEach(item => {
        let startDateTime = new Date(item.start.dateTime)
        let endDateTime = new Date(item.end.dateTime)

        let startDateTimeStr = startDateTime.toLocaleString()
        let endDateTimeStr = endDateTime.toLocaleString()

        outputString += `- ${item.summary} - (from ${startDateTimeStr} to ${endDateTimeStr})\n`
      })

      return (
        'List of events retrieved successfully, the readable list of events to print out: \n' +
        outputString
      )
    } catch (error) {
      return `An error occurred: ${error}`
    }
  }

  async _call(query) {
    const classification = await this.runClassification(query)

    console.log('classification', classification)

    if (classification === 'create_event') {
      return await this.runCreateEvent(query)
    } else if (classification === 'view_events') {
      return await this.runViewEvents()
    }

    return 'Currently only create event and view events are supported. Stopping execution.'
  }
}
