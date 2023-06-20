import { ChatOpenAI } from 'langchain/chat_models/openai'
import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import {
  GoogleCalendarCreateTool,
  GoogleCalendarViewTool
} from './tools/index.js'

/**
 * @class GoogleCalendarAgent
 * @description An agent that can create and view Google Calendar events
 * @param {('create'|'view')} mode - The mode of the agent
 * @param {Object} credentials
 * @param {string} credentials.clientEmail - Google service account client email
 * @param {string} credentials.privateKey - Google service account private key
 * @param {string} credentials.calendarId - Google Calendar ID
 * @param {Object} openApiOptions
 * @param {Object} executorOptions
 * @example
 * const calendarAgent = new GoogleCalendarAgent({
 *  clientEmail: process.env.CLIENT_EMAIL,
 *  privateKey: process.env.PRIVATE_KEY,
 *  calendarId: process.env.CALENDAR_ID
 * })
 *
 * // Create an event in Google Calendar
 * const result = agent.execute('Create an event at 2pm on Friday to walk the dog')
 *
 * // Retrieve events from Google Calendar based on a query
 * const result = agent.execute('Show me my events for next week Friday')
 */
class GoogleCalendarAgent {
  constructor({
    mode = 'full',
    credentials,
    openApiOptions = { temperature: 0 },
    executorOptions = {
      agentType: 'chat-zero-shot-react-description',
      verbose: true
    }
  }) {
    this.openApiOptions = openApiOptions
    this.executorOptions = executorOptions
    this.tools =
      mode === 'create'
        ? [new GoogleCalendarCreateTool(credentials)]
        : mode === 'view'
        ? [new GoogleCalendarViewTool(credentials)]
        : [
            new GoogleCalendarCreateTool(credentials),
            new GoogleCalendarViewTool(credentials)
          ]
  }

  async init() {
    this.agent = await initializeAgentExecutorWithOptions(
      this.tools,
      new ChatOpenAI(this.openApiOptions),
      this.executorOptions
    )
    return this
  }

  async execute(input) {
    const response = await this.agent.call({ input })
    return response
  }
}

export { GoogleCalendarAgent, GoogleCalendarCreateTool, GoogleCalendarViewTool }
