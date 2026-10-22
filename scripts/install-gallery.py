from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
required = ["work-van", "back-garden-pergola", "fence-panel-replacement", "garden-gate", "garden-clearance-overview", "garden-clearance-details", "fox-and-hounds-hedges", "ditch-clearance", "garden-path", "covered-seating", "patio-installation", "fish-pond-pending", "garden-clearance-underway", "garden-renovation-underway", "driveway-pending"]
missing = [name for name in required if not (root / "images" / "projects" / (name + ".webp")).is_file()]
if missing:
    print("Gallery not activated. Upload extracted image package first. Missing: " + ", ".join(missing))
    raise SystemExit(0)
page = root / "index.html"
html = page.read_text(encoding="utf-8")
if 'id="about-work"' not in html:
    html, count = re.subn(r'(<section\b[^>]*class="[^"]*\bshowcase\b[^"]*"[^>]*id=")work(")', r'\1about-work\2', html, count=1)
    if count != 1:
        raise SystemExit("Expected showcase section not found; homepage left unchanged.")
if 'href="gallery-upgrade.css"' not in html:
    if '</head>' not in html:
        raise SystemExit("Missing head close; homepage left unchanged.")
    html = html.replace('</head>', '<link rel="stylesheet" href="gallery-upgrade.css">\n</head>', 1)
if 'src="gallery-upgrade.js"' not in html:
    if '</body>' not in html:
        raise SystemExit("Missing body close; homepage left unchanged.")
    html = html.replace('</body>', '<script src="gallery-upgrade.js" defer></script>\n</body>', 1)
page.write_text(html, encoding="utf-8")
print("Gallery activated; service markup preserved.")
