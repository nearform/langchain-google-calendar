import { google } from 'googleapis'
import { Tool } from 'langchain/tools'
import { OpenAI } from 'langchain/llms/openai'
import { runCreateEvent } from './commands/run-create-event.js'
import { runViewEvents } from './commands/run-view-events.js'
import {
  CREATE_TOOL_DESCRIPTION,
  VIEW_TOOL_DESCRIPTION
} from './tool-descriptions.js'

class GoogleCalendarBase extends Tool {
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

export class GoogleCalendarCreateTool extends GoogleCalendarBase {
  constructor(params) {
    super(params)
    this.name = 'google_calendar_create'
    this.description = CREATE_TOOL_DESCRIPTION
  }

  async _call(query) {
    const auth = await this.getAuth()
    const model = this.getModel()

    return await runCreateEvent(query, {
      auth,
      model,
      calendarId: this.CALENDAR_ID
    })
  }
}

export class GoogleCalendarViewTool extends GoogleCalendarBase {
  constructor(params) {
    super(params)
    this.name = 'google_calendar_view'
    this.description = VIEW_TOOL_DESCRIPTION
  }

  async _call(query) {
    const auth = await this.getAuth()
    const model = this.getModel()

    return await runViewEvents(query, {
      auth,
      model,
      calendarId: this.CALENDAR_ID
    })
  }
}
