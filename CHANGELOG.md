# Changelog

## 1.4.0 — 2026-11-08

- Google Sheets: every category gets its own tab. Each tab is a copy of that category's rows from the `Notes` tab, rewritten by NoteNest after every sync, so old rows land in the right tab automatically and the `Notes` archive itself is never moved or changed. Changing a note's category moves it to the other tab by itself.
- Tabs follow the archive rows; a tab NoteNest made is removed again when its category no longer has rows. Notes without a category appear in an `Uncategorized` tab. Category tabs show a warning if edited by hand; edit notes in NoteNest.
- Each category has its own colour, like agenda dividers: the tab, its header and a light tint of its rows. A category keeps its colour; new ones take an unused colour.
- Easier reading in Sheets: every row is one tidy line; hover over a To do cell on the `Notes` tab to see the full text; the new **Note view** tab shows the note you pick from a dropdown in one large card, like ⤢ on the board.
- Before the first category tabs are created, NoteNest makes a backup copy of the spreadsheet in your Drive.
- Categories are matched without regard to upper/lower case or extra spaces (`foxaiworld.com` = `Foxaiworld.com`). While typing, existing categories are suggested, and a different spelling snaps to the existing one.
- Delete notes for good: from the ⤢ view, from the archive, or a whole category at once (**Manage categories…** in the filter). Deleted notes are also removed from Google Sheets, empty category tabs disappear, you can undo for ten seconds, and a copy is always kept locally in `deleted-notes.json`. **Remove category** keeps the notes and only clears their category.
- New category filter in the toolbar: show all notes, one category or notes without a category. New papers take the selected category.
- Inbox notes may include `reminderAt`.

## 1.3.0 — 2026-11-08

- Inbox: notes dropped as JSON into `%LOCALAPPDATA%\NoteNest\inbox` appear on the open board (or at next start).
- `NoteNest.exe --add-note <file.json>` queues notes without opening a second window.
- New ⤢ button opens a note in a large, readable and editable detail view.
- Optional Claude Code skill in `integrations/claude-skill/not-al/`; format documented in `docs/INBOX.md`.
- Existing boards, reminders and Google Sheets sync are unchanged.

## 1.2.0 — 2026-11-07

- Soft ding-dong is now the default reminder, including upgrades from v1.1.
- Seven previewable sounds: chime and female/male Hey!, Mm-hm!, Huhu.
- Original Huhu recordings remain optional; existing notes and reminders are kept.
- All recordings are bundled locally; no new generation or runtime API charges.

## 1.1.0 — 2026-11-07

- Per-note reminder date/time through a small clock control.
- Soft female/male “huhu”, volume, preview and silent mode.
- One grouped nudge, ten-minute snooze and dismissal.
- Persistent delivery markers; completed/blank notes do not alert.
- Native reminder ticks while minimized; no background service when closed.
- Existing local notes and the date-only Google Sheets archive remain compatible.

## 1.0.0 — 2026-11-06

First public Windows x64 release.

- Four room themes and four paper styles.
- Dragging, fasteners, zoom/pan and adjustable paper scale.
- Local-first saving, archive and undo.
- Matching-colour crumple/toss and muteable local effects.
- Optional Google Sheets archive with a user-supplied OAuth client.
- Drive scope validation and clearer reconnect status.
- MIT code license and community contribution guide.

Limits: Windows-only; unsigned installer; no shared verified Google client;
one-way Sheet archive; approximately 5,000 archive rows.
