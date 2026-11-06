# Optional Google setup for v1

Offline use needs no setup. No private publisher credentials are distributed.

1. Create your own Google Cloud project.
2. Enable Google Drive API and Google Sheets API.
3. Configure the consent screen and add your account as a test user if testing.
4. Create an OAuth client of type **Desktop app** and download its JSON.
5. In NoteNest's cloud panel choose the Google application JSON.
6. Connect in your normal browser and review/grant the Drive-file permission.
7. NoteNest creates its archive and offers Open my spreadsheet.

Only proceed past Google's test-app warning if you recognize your project.
Never send the JSON to an issue or pull request. Testing-mode tokens can
expire and require reconnecting. A shared public integration requires the
appropriate Google production preparation.

https://developers.google.com/identity/protocols/oauth2/native-app
https://developers.google.com/workspace/sheets/api/scopes
