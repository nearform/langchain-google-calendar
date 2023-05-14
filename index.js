import { ChatOpenAI } from 'langchain/chat_models/openai'
import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { RequestsGetTool, RequestsPostTool, DynamicTool } from 'langchain/tools'
import readline from 'readline'
import { GoogleCalendarAPIWrapper } from './src/google_calendar_tool.js'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

export const run = async () => {
  const tools = [
    new RequestsGetTool(),
    new RequestsPostTool(),
    new GoogleCalendarAPIWrapper(),
    new DynamicTool({
      name: 'FOO',
      description: 'call this to get the value of foo. Input is the question.',
      func: () => {
        return `baz}"`
      }
    })
  ]
  const agent = await initializeAgentExecutorWithOptions(
    tools,
    new ChatOpenAI({
      temperature: 0,
      openAIApiKey: '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'
    }),
    { agentType: 'chat-zero-shot-react-description', verbose: true }
  )

  const askQuestion = async () => {
    rl.question('Enter your question: ', async question => {
      if (question.toLowerCase() === 'exit') {
        rl.close()
        return
      }
      console.log('question', question)
      const result = await agent.call({
        input: question
      })
      console.log({ result })
      askQuestion()
    })
  }

  askQuestion()
}

run()
