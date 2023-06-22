import { google } from 'googleapis'
import { Tool } from 'langchain/tools'
import { OpenAI } from 'langchain/llms/openai'

export interface GoogleCalendarAgentParams {
  credentials: {
    clientEmail?: string
    privateKey?: string
    calendarId?: string
  }
  scopes?: string[]
}

export class GoogleCalendarBase extends Tool {
  name = 'Google Calendar'
  description =
    'A tool to lookup Google Calendar events and create events in Google Calendar'

  protected clientEmail: string
  protected privateKey: string
  protected calendarId: string
  protected scopes: string[]

  constructor(
    fields: GoogleCalendarAgentParams = {
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
  ) {
    super()
    if (!fields.credentials) {
      throw new Error('Missing credentials')
    }

    if (!fields.credentials.clientEmail) {
      throw new Error('Missing client email')
    }

    if (!fields.credentials.privateKey) {
      throw new Error('Missing private key')
    }

    if (!fields.credentials.calendarId) {
      throw new Error('Missing calendar ID')
    }

    this.clientEmail = fields.credentials.clientEmail
    this.privateKey = fields.credentials.privateKey
    this.calendarId = fields.credentials.calendarId
    this.scopes = fields.scopes || []
  }

  getModel() {
    return new OpenAI({
      temperature: 0
    })
  }

  async getAuth() {
    const auth = new google.auth.JWT(
      this.clientEmail,
      undefined,
      this.privateKey,
      this.scopes
    )

    return auth
  }

  async _call(input: string) {
    return input
  }
}
