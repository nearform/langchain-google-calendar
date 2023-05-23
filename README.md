# LangChain Google Calendar
This is a Google Calendar JS tool for LangChain. It allows creating and retrieving events from a linked Google Calendar.

## Setup

To run this project, you will need to have:
- OpenAI API Key
- Google Cloud API credentials
- Google Calendar ID

### OpenAI API Key

1. Login to your OpenAI account.
1. Go to [API keys](https://platform.openai.com/account/api-keys) page
1. Create a new API key ![openai.jpg](readmeFiles%2Fopenai.jpg)
1. Set the `OPENAI_API_KEY` in the `.env` file to the value of the API key.

### Google Cloud API Setup

1. [Create a new project](https://console.cloud.google.com/projectcreate) in the Google Developer Console. ![google-developer-console-1.jpg](readmeFiles%2Fgoogle-developer-console-1.jpg)
1. Create a new service account: ![google-developer-console-2.gif](readmeFiles%2Fgoogle-developer-console-2.gif)
   1. Click on "IAM and Admin" in the burger menu, then "Service accounts".
   1. Click on "Create Service Account".
   1. Set up "Service account name".
   1. In the next step, set Role to "Roles" > "Owner".
   1. The last step is optional, you can skip it.
   1. Service account is now created.
1. In the list of service accounts, let's download a JSON file with keys ![google-developer-console-3.gif](readmeFiles%2Fgoogle-developer-console-3.gif)
   1. Click on the three dots on the right side of the service account you just created and click on "Manage keys".
   1. On the next page, click on "Add key" > "Create new key".
   1. Select "JSON" and click on "Create".
   1. The JSON file will be downloaded to your computer.
1. Set up the env file:
   1. Set the `CLIENT_EMAIL` in the `.env` file to the value of the `client_email` from the JSON file.
   1. Set the `PRIVATE_KEY` in the `.env` file to the value of the `private_key` from the JSON file.

### Google Calendar Setup and Calendar ID

1. Create a new calendar in your Google Calendar ![google-calendar-1.gif](readmeFiles%2Fgoogle-calendar-1.gif)
1. Open the settings of your calendar and go to the "Share with specific people or groups" section ![google-calendar-2.gif](readmeFiles%2Fgoogle-calendar-2.gif)
1. Insert the `CLIENT_EMAIL` value from the `.env` file as the email address.  ![google-calendar-3.gif](readmeFiles%2Fgoogle-calendar-3.gif)
  - The new email should display besides your logged-in email address. 
1. Get the calendar ID from the "Integrate calendar" section ![google-calendar-4.jpg](readmeFiles%2Fgoogle-calendar-4.jpg) 
1. Set the `CALENDAR_ID` in the `.env` file to the value of the calendar ID.

## Run the project

1. Make sure to have `.env` file with all the required values.
1. Install the dependencies: `npm install`
1. Run the project: `npm start`
1. Enter your prompt to interact with your calendar. Examples:
   - *Create a new meeting tomorrow at 7pm with my friend.*
   - *What are my meetings tomorrow?*
   - *Do I have any meeting with my friend tomorrow?*
