import tap from 'tap'
import esmock from 'esmock'
import sinon from 'sinon'

const credentials = {
  clientEmail: 'test-client-email',
  privateKey: 'test-private-key',
  calendarId: 'test-calendar-id'
}

tap.test('GoogleCalendarAgent', async t => {
  let createMock = null
  let viewMock = null
  let CalendarAgent = null

  t.beforeEach(async () => {
    createMock = sinon.stub().returns({
      description: 'test-view-description',
      execute: sinon.stub().returns('test-create-result')
    })

    viewMock = sinon.stub().returns({
      description: 'test-view-description',
      execute: sinon.stub().returns('test-view-result')
    })

    const { GoogleCalendarAgent } = await esmock('../src/index.js', {
      '../src/tools/index.js': {
        GoogleCalendarCreateTool: createMock,
        GoogleCalendarViewTool: viewMock
      }
    })
    CalendarAgent = GoogleCalendarAgent
  })

  t.test('when in create mode the create tool should be setup', async () => {
    await new CalendarAgent({
      mode: 'create',
      credentials,
      openApiOptions: { temperature: 0, openAIApiKey: 'test-key' }
    }).init()
    sinon.assert.calledOnceWithExactly(createMock, credentials)
    sinon.assert.notCalled(viewMock)
  })

  t.test('when in create mode the view tool should not be setup', async () => {
    await new CalendarAgent({
      mode: 'create',
      credentials,
      openApiOptions: { temperature: 0, openAIApiKey: 'test-key' }
    }).init()
    sinon.assert.notCalled(viewMock)
  })

  t.test('when in view mode the view tool should be setup', async () => {
    await new CalendarAgent({
      mode: 'view',
      credentials,
      openApiOptions: { temperature: 0, openAIApiKey: 'test-key' }
    }).init()
    sinon.assert.calledOnceWithExactly(viewMock, credentials)
    sinon.assert.notCalled(createMock)
  })

  t.test('when in view mode the create tool should not be setup', async () => {
    await new CalendarAgent({
      mode: 'view',
      credentials,
      openApiOptions: { temperature: 0, openAIApiKey: 'test-key' }
    }).init()
    sinon.assert.notCalled(createMock)
  })

  t.test(
    'when mode is full the view and create tools should be setup',
    async () => {
      await new CalendarAgent({
        mode: 'full',
        credentials,
        openApiOptions: { temperature: 0, openAIApiKey: 'test-key' }
      }).init()
      sinon.assert.calledOnceWithExactly(viewMock, credentials)
      sinon.assert.calledOnceWithExactly(createMock, credentials)
    }
  )

  t.test(
    'when mode is undefined the view and create tools should be setup',
    async () => {
      await new CalendarAgent({
        credentials,
        openApiOptions: { temperature: 0, openAIApiKey: 'test-key' }
      }).init()
      sinon.assert.calledOnceWithExactly(viewMock, credentials)
      sinon.assert.calledOnceWithExactly(createMock, credentials)
    }
  )

  t.test('calling init should setup the agent', async tt => {
    const calendarAgent = await new CalendarAgent({
      credentials,
      openApiOptions: { temperature: 0, openAIApiKey: 'test-key' }
    }).init()
    tt.ok(calendarAgent.agent)
    tt.has(calendarAgent.agent.execute)
  })
})
