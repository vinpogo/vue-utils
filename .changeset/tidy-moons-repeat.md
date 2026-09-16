---
'@vingy/vueltip': patch
---

Fix modal dialog reparenting: the tooltip is now restored to its original parent
after leaving a `<dialog>`, works when the reference changes without the tooltip
hiding in between, and reparents correctly when the tooltip is rendered with
`v-if`.
