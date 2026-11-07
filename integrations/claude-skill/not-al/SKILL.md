---
name: not-al
description: Pins the important points of the current conversation to the user's NoteNest board as sticky notes. Use when the user says "take notes", "pin this", "add to NoteNest", "not al" or "/not-al". Each topic becomes one short-titled note; the details live inside the note.
---

# Take notes → NoteNest

NoteNest (https://github.com/agileguru89/NoteNest) is a desktop sticky-note board.
It reads notes dropped into its local inbox folder, so you never edit the board file directly.

## Steps

1. Pick what the user must not lose: decisions, numbers/prices, file paths, shortcuts,
   to-dos, reminders, risks. Useful facts, not a transcript.
2. One note per topic (usually 2–6). Write in the user's language.
   - `title`: about 40 characters max, it is shown large.
   - `todo`: first line = one-sentence summary (visible on the paper), blank line, then details as short
     bullet lines (`•`). Keep it under ~1,500 characters. No tables.
   - `category`: project or area name.
   - `paper`: `rose` important/decision/reminder · `butter` task · `mint` info/how-to · `lined` long archive note.
   - `due`: only a real deadline, `YYYY-MM-DD`.
3. Write the list as UTF-8 JSON to `%LOCALAPPDATA%\NoteNest\inbox\notes-<timestamp>.tmp`,
   then rename it to `.json` (rename last, so NoteNest never reads a half-written file):

   ```json
   [{"title":"…","todo":"Summary.\n\n• detail","category":"…","paper":"mint","due":""}]
   ```

   Alternatively: `NoteNest.exe --add-note <file.json>` (installed at
   `%LOCALAPPDATA%\Programs\NoteNest\NoteNest.exe`).
4. If NoteNest is open the notes appear within a second; otherwise on next start.
   Check `inbox\failed\*.error.txt` if a file was rejected.
5. Tell the user which notes were added (title + colour).

## Rules

- Never invent facts; only what was said or verified in the conversation.
- Never put passwords, API keys or tokens into notes.
- Only add notes; do not edit or delete existing ones.
