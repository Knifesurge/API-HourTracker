# Project Description

This project allows users to track hours for user-defined activities, such as work, gaming, reading, exercise, studying, etc.

# Project Notes / Mind mapping

If you want to see how my brain thinks and breaks down this project, take a look at my notes in my [project notion page](https://www.notion.so/API-Hour-Tracker-3563eb82730980acb7eee617d8b73c05)

# Project Structure

`backend/` provides the express server used to serve the api, and is the backbone of the application. It handles requests and updates data as it is modified.

`frontend/` provides a graphical interface to be used with the app. It is written in Typescript using React.

The backend does not depend on the frontend, and is not coupled from back to front. The frontend, of course, relies and is built to serve the data of the backend.

# Routes

`/` - Shows information on how to use the application.

`/<id>` - Shows tracking related to the specified User ID. The ID is required to be able to access any actual data.

`/<id>/activities` - Lists all  activities for the specified User ID.

`/<id>/hours` - Lists cumulative tracked hours for all activities defined for the User ID.
`/<id>/<activity>`:
* GET - Lists tracked hours for the specified Activity for the User ID given.
* POST - 
* * If not created, create a new activity. Sent data should be in the format given in Data Shape section.
* * If created, posts hours to the activity. Sent data should be in the format given in Data Shape section.

# Data shape

User ID is a generated UUID. Since this application doesn't really store multi-user data, there will likely only be one stored.

Activity defines an activity that has tracked hours. It has the following definition:
```typescript
Activity = {
    "name":string
    "trackedHours":TrackedHours,
    "userId":UUID
}
```

Hour tracking is defined as:
```typescript
TrackedHours = {
    "activity":Activity["name"],
    "startTime":number,
    "endTime":number,
    "userId":UUID
}
```