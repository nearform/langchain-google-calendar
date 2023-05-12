import fs from 'fs'
import { google } from 'googleapis'
import { Tool } from 'langchain/tools'
import { LLMChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
// import { CLASSIFICATION_PROMPT, CREATE_EVENT_PROMPT } from './prompts.js'

export class GoogleCalendarAPIWrapper extends Tool {
  constructor() {
    super()
    this.SCOPES = [
      'https://www.googleapis.com/auth/calendar.readonly',
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
      value: 'A tool for managing Google Calendar events.'
    })
    this.service = this.validateEnvironment()
  }

  async validateEnvironment() {
    // const SCOPES = this.SCOPES
    const tokenPath = './token.json'

    let credentials = null

    if (fs.existsSync(tokenPath)) {
      credentials = JSON.parse(fs.readFileSync(tokenPath, 'utf8'))
    }

    if (!credentials) {
      throw new Error(
        'No token.json found. Please follow the Google Calendar API quickstart guide for setting up credentials.'
      )
    }

    const auth = new google.auth.OAuth2()
    auth.setCredentials(credentials)

    return google.calendar({ version: 'v3', auth })
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

    console.log('this.service', this.service)
    console.log('this.service.events', this.service.events)

    try {
      const createdEvent = await this.service.events.insert({
        calendarId: 'primary',
        requestBody: event
      })
      console.log('createdEvent', createdEvent)
      return createdEvent
    } catch (error) {
      return `An error occurred: ${error}`
    }
  }

  async runClassification(query) {
    const prompt = new PromptTemplate({
      template: `
Reschedule our meeting for 5 pm today. \n
The following is an action to be taken in a calendar.
Classify it as one of the following: \n\n
1. create_event \n
2. view_event \n
3. view_events \n
4. delete_event \n
5. reschedule_event \n
Classification: Reschedule an event
{query}
The following is an action to be taken in a calendar.
Classify it as one of the following: \n\n
1. create_event \n
2. view_event \n
3. view_events \n
4. delete_event \n
5. reschedule_event \n
Classification:
`,
      inputVariables: ['query']
    })
    const model = new OpenAI({
      temperature: 0,
      openAIApiKey: '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'
    })
    const llmChain = new LLMChain({ llm: model, prompt: prompt })

    return (await llmChain.run({ query })).trim().toLowerCase()
  }

  async runCreateEvent(query) {
    const prompt = new PromptTemplate({
      template: `
Date format: YYYY-MM-DDThh:mm:ss+00:00
Based on this event description:'Joey birthday tomorrow at 7 pm',
output a json of the following parameters: 
Today's datetime on UTC time 2021-05-02T10:00:00+00:00 and timezone
of the user is -5, take into account the timezone of the user and today's date.
1. event_summary 
2. event_start_time 
3. event_end_time 
4. event_location 
5. event_description 
6. user_timezone
event_summary:
{{
    "event_summary": "Joey birthday",
    "event_start_time": "2021-05-03T19:00:00-05:00",
    "event_end_time": "2021-05-03T20:00:00-05:00",
    "event_location": "",
    "event_description": "",
    "user_timezone": "America/New_York"
}}
Date format: YYYY-MM-DDThh:mm:ss+00:00
Based on this event description: {query}, output a json of the
following parameters: 
Today's datetime on UTC time {date} and timezone of the user {u_timezone},
take into account the timezone of the user and today's date.
1. event_summary 
2. event_start_time 
3. event_end_time 
4. event_location 
5. event_description 
6. user_timezone 
event_summary:  
`,
      inputVariables: ['date', 'query', 'u_timezone']
    })
    const model = new OpenAI({
      temperature: 0,
      openAIApiKey: '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'
    })
    const createEventChain = new LLMChain({
      llm: model,
      prompt
    })

    const date = new Date().toISOString()
    const u_timezone = new Date().getTimezoneOffset()

    console.log('query', query)
    console.log('date', date)
    console.log('u_timezone', u_timezone)
    const output = await createEventChain.call({ query, date, u_timezone })
    console.log('output XXX', output)
    console.log('output XXXtext', output['text'])
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

    console.log('event', event)

    return `Event created successfully, details: event ${event.data.htmlLink}`
  }

  async _call(query) {
    console.log('query START', query)
    const classification = await this.runClassification(query)

    console.log('classification', classification)

    if (
      classification === 'create_event' ||
      classification === 'reschedule_event' // TODO remove later
    ) {
      console.log('query 2222', query)
      return await this.runCreateEvent(query)
    }

    return 'Currently only create event is supported'
  }
}
