export const EVENT_CLASSIFICATION_PROMPT = `
Prompt: "Create a new meeting for 5 pm today."
The following is an action to be taken in a calendar.
Classify it as one of the following:
1. create_event
2. view_event
3. view_events
4. delete_event
5. reschedule_event
Classification: create_event

Prompt: "Show all my events today."
The following is an action to be taken in a calendar.
Classify it as one of the following:
1. create_event
2. view_event
3. view_events
4. delete_event
5. reschedule_event
Classification: view_events

Prompt: "What are my meetings tomorrow?"
The following is an action to be taken in a calendar.
Classify it as one of the following:
1. create_event
2. view_event
3. view_events
4. delete_event
5. reschedule_event
Classification: view_events

Prompt: "{query}"
The following is an action to be taken in a calendar.
Classify it as one of the following:
1. create_event
2. view_event
3. view_events
4. delete_event
5. reschedule_event
Classification:
`
