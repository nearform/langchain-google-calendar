export const CREATE_EVENT_PROMPT = `
Date format: YYYY-MM-DDThh:mm:ss+00:00
Based on this event description:"Joey birthday tomorrow at 7 pm",
output a json of the following parameters: 
Today's datetime on UTC time 2021-05-02T10:00:00+00:00 and timezone
of the user is -5, take into account the timezone of the user and today's date.
1. event_summary 
2. event_start_time 
3. event_end_time 
4. event_location 
5. event_description 
6. user_timezone
event_summary:
{{
    "event_summary": "Joey birthday",
    "event_start_time": "2021-05-03T19:00:00-05:00",
    "event_end_time": "2021-05-03T20:00:00-05:00",
    "event_location": "",
    "event_description": "",
    "user_timezone": "America/New_York"
}}

Date format: YYYY-MM-DDThh:mm:ss+00:00
Based on this event description: '{query}', output a json of the
following parameters: 
Today's datetime on UTC time {date} and timezone of the user {u_timezone},
take into account the timezone of the user and today's date.
1. event_summary 
2. event_start_time 
3. event_end_time 
4. event_location 
5. event_description 
6. user_timezone 
event_summary:
`
