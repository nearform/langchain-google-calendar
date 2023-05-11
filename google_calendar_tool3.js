import fs from 'fs'
import { google } from 'googleapis'
import { LLMChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { CLASSIFICATION_PROMPT, CREATE_EVENT_PROMPT } from './prompts.js'

export class GoogleCalendarAPIWrapper {
  constructor() {
    this.SCOPES = [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events'
    ]
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

    let creds = null

    if (fs.existsSync(tokenPath)) {
      creds = JSON.parse(fs.readFileSync(tokenPath, 'utf8'))
    }

    if (!creds) {
      throw new Error(
        'No token.json found. Please follow the Google Calendar API quickstart guide for setting up credentials.'
      )
    }

    const auth = new google.auth.OAuth2()
    auth.setCredentials(creds)

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

    try {
      const createdEvent = await this.service.events.insert({
        calendarId: 'primary',
        requestBody: event
      })
      return createdEvent
    } catch (error) {
      return `An error occurred: ${error}`
    }
  }

  async runClassification(query) {
    const classificationPrompt = new PromptTemplate(CLASSIFICATION_PROMPT, [
      'query'
    ])
    const llmChain = new LLMChain(
      new OpenAI(0, 'text-davinci-003'),
      classificationPrompt,
      true
    )

    return (await llmChain.run({ query })).trim().toLowerCase()
  }

  async runCreateEvent(query) {
    const createEventPrompt = new PromptTemplate(CREATE_EVENT_PROMPT, [
      'date',
      'query',
      'u_timezone'
    ])
    const createEventChain = new LLMChain(
      new OpenAI(0, 'text-davinci-003'),
      createEventPrompt,
      true
    )

    const date = new Date().toISOString()
    const u_timezone = new Date().getTimezoneOffset()

    const output = (
      await createEventChain.run({ query, date, u_timezone })
    ).trim()
    const loaded = JSON.parse(output)

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

    if (classification === 'create_event') {
      return await this.runCreateEvent(query)
    }

    return 'Currently only create event is supported'
  }
}
