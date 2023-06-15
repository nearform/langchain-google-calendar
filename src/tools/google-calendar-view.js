import { GoogleCalendarBase } from './google-calendar-base.js'
import { VIEW_TOOL_DESCRIPTION } from './tool-descriptions.js'

import { runViewEvents } from '../commands/run-view-events.js'

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
