# Intelligent UI

LLM Tycoon targets GPT-6 with Python and an adaptive Intelligent UI surface.

View IDs S0–S17 are semantic contracts, not exact Markdown skeletons. Keep navigation and the meaning of each view stable. Choose compact cards, tables, forms, progress bars, and charts where they help a player decide.

- Infer layout from the current surface. Do not ask for device or desktop/mobile profile.
- Build working controls only through features actually available in the host. A button-like Markdown label is a text choice, not a working button.
- Widget interactions are requests: send an action identifier, selected fields, and expected revision to the same Python resolution flow used for text commands.
- UI state is a projection of the canonical save. Never calculate or persist game mechanics only inside a widget.
- Keep hidden formulas, optimal Focus, unseen matches, and future calendar data out of all client-visible source, tooltips, and download previews. Show only public projected fields.
- Keep a compact status strip available during decisions: company, current month, Cash, Research Points, Fame, active commitment.
- Large inventories can use scrolling, pagination, or expandable sections. Preserve access to every eligible item and required field; never replace data with “unchanged”.
- Accept numbers and natural language as well as controls. Maintain a numbered Markdown version when the surface cannot submit interactive actions.
- Translate labels naturally into the active language. Preserve proper AI names, canonical IDs, file names, and JSON keys.
- `ui` or a natural request can change display preferences such as compact/detail or list/cards without modifying gameplay. Save these preferences; never force a device selection.
- Ordinary UI is not a code block. Use raw data blocks only when the player explicitly wants inline JSON or a literal export.

Read the relevant section of `02_view_contracts.md` for required information. On a language or display change, redraw the same current view.
