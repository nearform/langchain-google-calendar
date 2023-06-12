import { GoogleCalendarBase } from './google-calendar-base.js'
import { CREATE_TOOL_DESCRIPTION } from './tool-descriptions.js'

import { runCreateEvent } from '../commands/run-create-event.js'

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
