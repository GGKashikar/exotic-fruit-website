# -*- coding: utf-8 -*-
from pathlib import Path

root = Path(r"E:\Drive E Data\MIPL Docs\exotic-fruit-com-full-site-offline\www.exotic-fruit.com")

# Mojibake from UTF-8 read as Windows-1252 then saved as UTF-8
REPLACEMENTS = [
    ("\u00c2\u00b7", "&middot;"),  # Â·
    ("Â·", "&middot;"),
    ("â€”", "&mdash;"),
    ("â€“", "&ndash;"),
    ("Ã—", "&times;"),
    ("â†’", "&rarr;"),
    ("â€™", "'"),
    ("â€œ", "&ldquo;"),
    ("â€", "&rdquo;"),
    ("â€¦", "..."),
]

paths = list(root.glob("*.html")) + list((root / "products").glob("*.html"))
fixed = 0
for p in paths:
    text = p.read_text(encoding="utf-8", errors="replace")
    orig = text
    for a, b in REPLACEMENTS:
        text = text.replace(a, b)
    if text != orig:
        p.write_text(text, encoding="utf-8", newline="\n")
        fixed += 1
        print("fixed", p.relative_to(root))
print("files_fixed", fixed)
