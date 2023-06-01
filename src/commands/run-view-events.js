import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'
import { google } from 'googleapis'
import { VIEW_EVENTS_PROMPT } from '../prompts/index.js'
import { getTimezoneOffsetInHours } from '../utils/index.js'

const calendar = google.calendar('v3')

const runViewEvents = async (query, { model, auth, calendarId }) => {
  const prompt = new PromptTemplate({
    template: VIEW_EVENTS_PROMPT,
    inputVariables: ['date', 'query', 'u_timezone', 'dayName']
  })
  const viewEventsChain = new LLMChain({
    llm: model,
    prompt
  })

  const date = new Date().toISOString()
  const u_timezone = getTimezoneOffsetInHours()
  const dayName = new Date().toLocaleString('en-us', { weekday: 'long' })

  const output = await viewEventsChain.call({
    query,
    date,
    u_timezone,
    dayName
  })
  const loaded = JSON.parse(output['text'])

  try {
    const response = await calendar.events.list({
      auth,
      calendarId,
      ...loaded
    })

    const curatedItems = response.data.items.map(
      ({ status, summary, description, start, end }) => ({
        status,
        summary,
        description,
        start,
        end
      })
    )

    return 'Selected events: \n' + JSON.stringify(curatedItems, null, 2)
  } catch (error) {
    return `An error occurred: ${error}`
  }
}

export { runViewEvents }
