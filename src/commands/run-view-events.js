import { PromptTemplate } from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'
import { google } from 'googleapis'
import { VIEW_EVENTS_PROMPT } from '../prompts/index.js'
import { getTimezoneOffsetInHours } from '../utils/get-timezone-offset-in-hours.js'

const calendar = google.calendar('v3')

const runViewEvents = async (query, { model, auth, calendarId }) => {
  const prompt = new PromptTemplate({
    template: VIEW_EVENTS_PROMPT,
    inputVariables: ['date', 'query', 'u_timezone']
  })
  const viewEventsChain = new LLMChain({
    llm: model,
    prompt
  })

  const date = new Date().toISOString()
  const u_timezone = getTimezoneOffsetInHours()

  const output = await viewEventsChain.call({ query, date, u_timezone })
  const loaded = JSON.parse(output['text'])

  try {
    const response = await calendar.events.list({
      auth,
      calendarId,
      ...loaded
    })

    const curatedItems = response.data.items.map(
      ({ id, status, htmlLink, summary, description, start, end }) => ({
        id,
        status,
        htmlLink,
        summary,
        description,
        start,
        end
      })
    )

    return (
      'Stopping execution, requested events to display to the user: \n' +
      JSON.stringify(curatedItems, null, 2)
    )
  } catch (error) {
    return `An error occurred: ${error}`
  }
}

export { runViewEvents }
