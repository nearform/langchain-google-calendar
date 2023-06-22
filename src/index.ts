import { ChatOpenAI } from 'langchain/chat_models/openai'
import type {
  AzureOpenAIInput,
  OpenAIChatInput
} from 'langchain/chat_models/openai'
import {
  InitializeAgentExecutorOptions,
  initializeAgentExecutorWithOptions
} from 'langchain/agents'
import {
  GoogleCalendarCreateTool,
  GoogleCalendarViewTool
} from './tools/index.js'
import type { GoogleCalendarAgentParams } from './tools/google-calendar-base.js'
import type { BaseChatModelParams } from 'langchain/chat_models'
import type { ConfigurationParameters } from 'openai'

type OpenAIOptions = Partial<OpenAIChatInput> &
  Partial<AzureOpenAIInput> &
  BaseChatModelParams & {
    concurrency?: number
    cache?: boolean
    openAIApiKey?: string
    configuration?: ConfigurationParameters
  }

export type CalendarAgentParams = {
  mode?: 'create' | 'view' | 'full'
  calendarOptions: GoogleCalendarAgentParams
  executorOptions?: InitializeAgentExecutorOptions
  openApiOptions?: OpenAIOptions
}

class GoogleCalendarAgent {
  protected tools: any[]
  protected agent: any
  protected openApiOptions: Partial<ChatOpenAI>
  protected executorOptions: InitializeAgentExecutorOptions

  constructor({
    mode = 'full',
    calendarOptions,
    openApiOptions = { temperature: 0 },
    executorOptions = {
      agentType: 'chat-zero-shot-react-description',
      verbose: true
    }
  }: CalendarAgentParams) {
    this.openApiOptions = openApiOptions
    this.executorOptions = executorOptions
    this.tools =
      mode === 'create'
        ? [new GoogleCalendarCreateTool(calendarOptions)]
        : mode === 'view'
        ? [new GoogleCalendarViewTool(calendarOptions)]
        : [
            new GoogleCalendarCreateTool(calendarOptions),
            new GoogleCalendarViewTool(calendarOptions)
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

  async execute(input: string) {
    const response = await this.agent.call({ input })
    return response
  }
}

export { GoogleCalendarAgent, GoogleCalendarCreateTool, GoogleCalendarViewTool }
