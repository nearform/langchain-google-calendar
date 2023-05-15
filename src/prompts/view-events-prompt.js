export const VIEW_EVENTS_PROMPT = `
Date format: YYYY-MM-DDThh:mm:ss+00:00
Based on this event description: 'View my events today with "Alan" in the title',
output a json of the following parameters: 
Today's datetime on UTC time 2021-05-02T10:00:00+00:00 and timezone
of the user is -5, take into account the timezone of the user and today's date.
If the user is searching for events with a specific title, person or location, put it into the search_query parameter.
1. time_min 
2. time_max
3. user_timezone
4. max_results 
5. search_query 
event_summary:
{{
    "time_min": "2021-05-02T00:00:00-05:00",
    "time_max": "2021-05-02T23:59:59-05:00",
    "user_timezone": "America/New_York",
    "max_results": 10,
    "search_query": "Alan"
}}

Date format: YYYY-MM-DDThh:mm:ss+00:00
Based on this event description: '{query}', output a json of the
following parameters: 
Today's datetime on UTC time {date} and timezone of the user {u_timezone},
take into account the timezone of the user and today's date.
If the user is searching for events with a specific title, person or location, put it into the search_query parameter.
1. time_min 
2. time_max
3. user_timezone
4. max_results 
5. search_query 
event_summary:
`
