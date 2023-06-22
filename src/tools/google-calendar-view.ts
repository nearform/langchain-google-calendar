import {
  GoogleCalendarAgentParams,
  GoogleCalendarBase
} from './google-calendar-base.js'
import { VIEW_TOOL_DESCRIPTION } from './tool-descriptions.js'

import { runViewEvents } from '../commands/run-view-events.js'

export class GoogleCalendarViewTool extends GoogleCalendarBase {
  name = 'google_calendar_view'
  description = VIEW_TOOL_DESCRIPTION

  constructor(fields: GoogleCalendarAgentParams) {
    super(fields)
  }

  async _call(query: string) {
    const auth = await this.getAuth()
    const model = this.getModel()

    return await runViewEvents(query, {
      auth,
      model,
      calendarId: this.calendarId
    })
  }
}
