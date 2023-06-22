import {
  GoogleCalendarAgentParams,
  GoogleCalendarBase
} from './google-calendar-base.js'
import { CREATE_TOOL_DESCRIPTION } from './tool-descriptions.js'

import { runCreateEvent } from '../commands/run-create-event.js'

export class GoogleCalendarCreateTool extends GoogleCalendarBase {
  name = 'google_calendar_create'
  description = CREATE_TOOL_DESCRIPTION

  constructor(fields: GoogleCalendarAgentParams) {
    super(fields)
  }

  async _call(query: string) {
    const auth = await this.getAuth()
    const model = this.getModel()

    return await runCreateEvent(query, {
      auth,
      model,
      calendarId: this.calendarId
    })
  }
}
