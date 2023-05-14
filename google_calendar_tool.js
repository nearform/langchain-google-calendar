import fs from 'fs'
import { google } from 'googleapis'
import { Tool } from 'langchain/tools'
import { LLMChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { CLASSIFICATION_PROMPT, CREATE_EVENT_PROMPT } from './prompts.js'

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
        'A tool for managing Google Calendar events. Input should be the initial user prompt'
    })
    this.auth = this.validateEnvironment
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

    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
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

    const auth = await this.validateEnvironment()

    try {
      const createdEvent = await calendar.events.insert({
        auth,
        calendarId:
          '800376f29756933f9361aca31d0578454f54e56287c22071b0a6855d67de35be@group.calendar.google.com',
        requestBody: event
      })
      return createdEvent
    } catch (error) {
      return `An error occurred XY: ${error}`
    }
  }

  async runClassification(query) {
    const prompt = new PromptTemplate({
      template: CLASSIFICATION_PROMPT,
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
      template: CREATE_EVENT_PROMPT,
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
    const u_timezone = 2

    console.log('query', query)
    console.log('date', date)
    console.log('u_timezone', u_timezone)
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

  async _call(query) {
    const classification = await this.runClassification(query)

    console.log('classification', classification)

    if (
      classification === 'create_event' ||
      classification === 'reschedule_event' // TODO remove later
    ) {
      return await this.runCreateEvent(query)
    }

    return 'Currently only create event is supported'
  }
}
