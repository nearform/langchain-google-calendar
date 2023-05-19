export const TOOL_DESCRIPTION = `A tool for managing and retrieving Google Calendar events and meetings.

INPUT:
"action": "google_calendar",
"action_input": "display meetings for today"

"action": "google_calendar",
"action_input": "show events for tomorrow"

"action": "google_calendar",
"action_input": "display meetings for tomorrow between 4pm and 8pm"

"action": "google_calendar",
"action_input": "display yesterday's events"

"action": "google_calendar",
"action_input": "create a new meeting with John Doe tomorrow at 4pm"

OUTPUT:
Output is either a confirmation of a created event a structured list of events: title, start time, end time, attendees, description (if available)
`
