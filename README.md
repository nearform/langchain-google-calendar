# Google Calendar LangChain

Google Calendar LangChain is a tool for integrating with Google Calendar. Using this tool, users can view and create events directly using natural language prompts. Built on [Langchain](https://js.langchain.com/docs/), this exposes two tools that can be used together or individually along with a cli tool as well as pre-baked functonality to import and use directly in a project.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have a Google account with Google Calendar enabled.
- You have obtained necessary credentials (API key, Client ID, Client Secret) from Google. See [./docs/setup.md](./docs/setup.md) for full setup instructions.
- Install all project dependencies
- Make sure to have `.env` file with all the required values

### CLI

The CLI tool exposes a prompt interface on your command line you can use to interact with a Google Calendar.

To use this you can run the following command, once you have suitably configured your `.env` file:

```
npm run start
```

Once it is running, it will display some example questions to give you a guide on how to interact with the specified calendar.

Prompts are processed in multiple steps and usually take at least several seconds to complete. Verbose output is shown in the console while each step of the process is running, then the final response will have the key `"result"` with a key `"output"`.

Note that the output may sometimes pause for several seconds. This is normal and does not usually indicate a problem.

## Langchain Tools

### GoogleCalendarCreateTool

The `GoogleCalendarCreateTool` provides write functionality to interact with a Google Calendar.

This can be imported to be used as a tool in your project. You can view an [example of this in the examples directory](src/example/create-tool.ts)

### GoogleCalendarViewTool

The `GoogleCalendarViewTool` provides read functionality to interact with a Google Calendar.

This can be imported to be used as a tool in your project. You can view an [example of this in the examples directory](src/example/view-tool.ts)

### Combined Tool Usage

The `GoogleCalendarCreateTool` and `GoogleCalendarViewTool` can also both be imported as added as tools to be used together in your project. You can view an [example of this in the examples directory](src/example/combined-tools.ts)

### Packaged Function

This repository also provides a pre-packaged function allowing you to import an [agent](https://js.langchain.com/docs/modules/agents/) for direct usage in your application.

You can view an [example of this in the examples directory](src/example/agent.ts)
