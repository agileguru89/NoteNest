# Adding notes from other tools (inbox)

NoteNest can receive notes from scripts, automations and AI assistants without
touching your board file. Everything stays on your computer.

## How it works

Drop a JSON file into

```
%LOCALAPPDATA%\NoteNest\inbox\
```

- If NoteNest is open, the note appears on your board within a second.
- If NoteNest is closed, it appears the next time you open it.
- Processed files move to `inbox\processed\` (the newest 100 are kept).
  Invalid files move to `inbox\failed\` with an `.error.txt` explaining why.
- Write the file as `*.tmp` first and rename it to `*.json` when complete,
  so NoteNest never reads a half-written file.

Or let NoteNest do that for you:

```
NoteNest.exe --add-note C:\path\to\note.json
```

This validates the file and queues it in the inbox; it does not open a second window.

## Format

One note or a list of up to 50 notes (UTF-8):

```json
[
  {
    "title": "Client call – follow-up",
    "todo": "Send the revised offer by Friday.\n\n• new prices\n• timeline\n• contact person",
    "category": "Sales",
    "paper": "rose",
    "due": "2026-11-14",
    "reminderAt": "2026-11-14T09:00"
  }
]
```

| Field | Required | Notes |
|---|---|---|
| `title` | one of title/todo | max 180 characters, shown large on the paper |
| `todo` | one of title/todo | max 12,000 characters; line breaks are kept. Open the full text with **⤢** on the note |
| `category` | no | max 80 characters; matched to an existing category regardless of case/spaces |
| `paper` | no | `butter` (yellow, default), `rose` (pink), `mint` (green), `lined` (tall white) |
| `due` | no | `YYYY-MM-DD`; anything else is ignored |
| `reminderAt` | no | reminder time: local `YYYY-MM-DDTHH:mm`, or ISO 8601 with `Z`/offset; anything else is ignored |

Position, fastener and rotation are chosen automatically so new notes do not cover existing ones.

## Privacy

The inbox is a local folder. NoteNest does not open network ports for it and
never sends inbox files anywhere; synced notes follow your normal Google Sheets
setting. Do not put passwords or tokens into notes.

## AI assistants

`integrations/claude-skill/not-al/` contains an optional skill for Claude Code
that turns the important parts of a conversation into notes through this inbox.
Any other assistant can use the same JSON format.
