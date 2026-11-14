# Post-review correction, not a new paired trial

Independent review found that the skill-assisted JSON serializer coerced unsafe integer text through Number, changing 9007199254740993 to 9007199254740992. The original skill/control outputs and paired evidence are frozen. A separate demonstrator will be repaired; its later result must not replace the original comparison or be scored as an original-trial win.

The broader lesson is to validate what crosses the handoff boundary, including data meaning and precision, not just successful rendering or valid syntax.
