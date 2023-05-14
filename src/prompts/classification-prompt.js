export const CLASSIFICATION_PROMPT = `
Reschedule our meeting for 5 pm today.
The following is an action to be taken in a calendar.
Classify it as one of the following:
1. create_event
2. view_event
3. view_events
4. delete_event
5. reschedule_event
Classification: Reschedule an event

{query}
The following is an action to be taken in a calendar.
Classify it as one of the following:
1. create_event
2. view_event
3. view_events
4. delete_event
5. reschedule_event
Classification:
`
