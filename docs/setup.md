# Setup

To run this project, you will need to have:

1. [OpenAI API Key](#step-1) (from a paid OpenAI account with active quota)
2. [Google Cloud API credentials](#step-2)
3. [Google Calendar ID](#step-3)

<a id="step-1">

## 1. OpenAI API Key

1. Login to your OpenAI account.
1. Go to [API keys](https://platform.openai.com/account/api-keys) page
1. Create a new API key ![openai.jpg](.%2Ffiles%2Fopenai.jpg)
1. Set the `OPENAI_API_KEY` in the `.env` file to the value of the API key.

Note that while free OpenAI accounts will allow API keys to be created, attempting to use them will fail with:

> Error 429. You exceeded your current quota, please check your plan and billing details

<a id="step-2">

## 2. Google Cloud API Setup

1. [Create a new project](https://console.cloud.google.com/projectcreate) in the Google Developer Console. ![google-developer-console-1.jpg](.%2Ffiles%2Fgoogle-developer-console-1.jpg)
   - If it treats `Location` as a required field ("You must select a parent organisation or folder"), and no suitable location is available, you're probably on a Google account linked to an organisation with permissions restrictions. You can either:
      - Switch to a personal Google Account, which usually allow no location, or
      - Request your GCP administrator grants you `resourcemanager.projects.create` permission (or does these steps for you) 
1. In "APIs and Services", enable the Google Calendar API ![google-developer-console-4.gif](.%2Ffiles%2Fgoogle-developer-console-4.gif)
   1. Click on "APIs and Services" in the burger menu, then "Enable APIs and Services".
   1. Find and select "Google Calendar API"
   1. If it is not already enabled, press "Enable"
1. Create a new service account: ![google-developer-console-2.gif](.%2Ffiles%2Fgoogle-developer-console-2.gif)
   1. Click on "IAM and Admin" in the burger menu, then "Service accounts".
   1. Click on "Create Service Account".
   1. Set up "Service account name".
   1. In the next step, set Role to "Roles" > "Owner".
   1. The last step is optional, you can skip it.
   1. Service account is now created.
1. In the list of service accounts, let's download a JSON file with keys ![google-developer-console-3.gif](.%2Ffiles%2Fgoogle-developer-console-3.gif)
   1. Click on the three dots on the right side of the service account you just created and click on "Manage keys".
   1. On the next page, click on "Add key" > "Create new key".
   1. Select "JSON" and click on "Create".
   1. The JSON file will be downloaded to your computer.
1. Set up the env file:
   1. Set the `CLIENT_EMAIL` in the `.env` file to the value of the `client_email` from the JSON file.
   1. Set the `PRIVATE_KEY` in the `.env` file to the value of the `private_key` from the JSON file.

<a id="step-3">

## 3. Google Calendar Setup and Calendar ID

1. Create a new calendar in your Google Calendar ![google-calendar-1.gif](.%2Ffiles%2Fgoogle-calendar-1.gif)
1. Open the settings of your calendar and go to the "Share with specific people or groups" section ![google-calendar-2.gif](.%2Ffiles%2Fgoogle-calendar-2.gif)
1. Insert the `CLIENT_EMAIL` value from the `.env` file as the email address.  ![google-calendar-3.gif](.%2Ffiles%2Fgoogle-calendar-3.gif)
  - The new email should display besides your logged-in email address. 
1. Get the calendar ID from the "Integrate calendar" section ![google-calendar-4.jpg](.%2Ffiles%2Fgoogle-calendar-4.jpg) 
1. Set the `CALENDAR_ID` in the `.env` file to the value of the calendar ID.

Once these three parts are set up and your `.env` file is complete, you may run `npm install` and `npm run start`, which should start the terminal app and offer an open prompt. See the [main project readme](../#README) for usage instructions.
