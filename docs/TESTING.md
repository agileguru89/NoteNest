# Testing

node test-model.cjs: state and acknowledgement tests.
release/NoteNest.exe --selftest: native serialization, scope gate,
coordinate validation, literal text and archive formatting tests.

On a Windows desktop, --smoke uses isolated TEMP/NoteNest-20261106/smoke-data
and captures the app's own WebView2 under smoke-output. It checks rooms,
2x zoom, completion/restore, six tosses (five hits/one miss), matching colours
and twenty open notes at 60% size. Fixtures never use the user's board.

Before releasing, check mouse/keyboard, restart persistence, actual audio,
installer/update and optional Google sync. Model tests do not prove OAuth
or a Mac port works. Never publish real notes or tokens.
