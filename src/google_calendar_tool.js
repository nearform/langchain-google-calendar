import { google } from 'googleapis'
import { Tool } from 'langchain/tools'
import { LLMChain } from 'langchain/chains'
import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'
import { EVENT_CLASSIFICATION_PROMPT } from './prompts/index.js'
import { TOOL_DESCRIPTION } from './tool-description.js'
import { runCreateEvent } from './commands/run-create-event.js'
import { runViewEvents } from './commands/run-view-events.js'

export class GoogleCalendarTool extends Tool {
  constructor({ openAIApiKey, clientEmail, privateKey, calendarId }) {
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
      value: TOOL_DESCRIPTION
    })
    this.OPEN_AI_API_KEY = openAIApiKey
    this.CLIENT_EMAIL = clientEmail
    this.PRIVATE_KEY = privateKey
    this.CALENDAR_ID = calendarId
  }

  getModel() {
    return new OpenAI({
      temperature: 0,
      openAIApiKey: this.OPEN_AI_API_KEY
    })
  }

  async getAuth() {
    const auth = new google.auth.JWT(
      this.CLIENT_EMAIL,
      null,
      this.PRIVATE_KEY,
      this.SCOPES
    )

    return auth
  }

  async runClassification(query) {
    const prompt = new PromptTemplate({
      template: EVENT_CLASSIFICATION_PROMPT,
      inputVariables: ['query']
    })
    const createEventChain = new LLMChain({
      llm: this.getModel(),
      prompt,
      verbose: true
    })

    return (await createEventChain.call({ query })).text
  }

  async _call(query) {
    const auth = await this.getAuth()
    const model = this.getModel()

    const classification = await this.runClassification(query)

    console.log('Detected classification: ', classification)

    switch (classification) {
      case 'create_event':
        return await runCreateEvent(query, {
          auth,
          model,
          calendarId: this.CALENDAR_ID
        })
      case 'view_events':
        return await runViewEvents(query, {
          auth,
          model,
          calendarId: this.CALENDAR_ID
        })
      default:
        return 'Currently only create event and view events are supported. Stopping execution.'
    }
  }
}
