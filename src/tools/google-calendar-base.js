import { google } from 'googleapis'
import { Tool } from 'langchain/tools'
import { OpenAI } from 'langchain/llms/openai'

export class GoogleCalendarBase extends Tool {
  constructor({ clientEmail, privateKey, calendarId }) {
    super()
    this.SCOPES = [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events'
    ]
    this.CLIENT_EMAIL = clientEmail
    this.PRIVATE_KEY = privateKey
    this.CALENDAR_ID = calendarId
  }

  getModel() {
    return new OpenAI({
      temperature: 0
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
}
