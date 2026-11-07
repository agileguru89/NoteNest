# Changelog

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
