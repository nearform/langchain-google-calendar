# LangChain Google Calendar
This is a Google Calendar JS tool for LangChain. It allows creating and retrieving events from a linked Google Calendar.

## Setup

See [./docs/setup.md](./docs/setup.md) for full setup instructions.

## Run the project

1. Make sure to have `.env` file with all the required values (see [setup guide](./docs/setup.md)).
1. Install the dependencies: `npm install`
1. Run the project: `npm start`
1. Enter your prompt to interact with your calendar. Examples:
   - *Create a new meeting tomorrow at 7pm with my friend.*
   - *What are my meetings tomorrow?*
   - *Do I have any meeting with my friend tomorrow?*

Prompts are processed in multiple steps and usually take at least several seconds to complete. Verbose output is shown in the console while each step of the process is running, then the final response will have the key `"result"` with a key `"output"`.

Note that the output may sometimes pause for several seconds. This is normal and does not usually indicate a problem.
