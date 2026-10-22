from pathlib import Path
from html.parser import HTMLParser
import re

class ClosingTags(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=False)
        self.ends = {}
        self.starts = [0] + [match.end() for match in re.finditer('\n', text)]
    def handle_endtag(self, tag):
        line, column = self.getpos()
        self.ends[tag] = self.starts[line - 1] + column

class ScriptCheck(HTMLParser):
    def __init__(self):
        super().__init__()
        self.gallery_scripts = 0
    def handle_starttag(self, tag, attrs):
        if tag == 'script' and dict(attrs).get('src') == 'gallery-upgrade.js':
            self.gallery_scripts += 1

root = Path(__file__).resolve().parents[1]
required = ['work-van', 'back-garden-pergola', 'fence-panel-replacement', 'garden-gate', 'garden-clearance-overview', 'garden-clearance-details', 'fox-and-hounds-hedges', 'ditch-clearance', 'garden-path', 'covered-seating', 'patio-installation', 'fish-pond-pending', 'garden-clearance-underway', 'garden-renovation-underway', 'driveway-pending']
missing = [name for name in required if not (root / 'images' / 'projects' / (name + '.webp')).is_file()]
if missing:
    print('Gallery not activated. Missing images: ' + ', '.join(missing))
    raise SystemExit(0)
page = root / 'index.html'
html = page.read_text(encoding='utf-8')
if 'id="about-work"' not in html:
    html, count = re.subn(r'(<section\b[^>]*class="[^"]*\bshowcase\b[^"]*"[^>]*id=")work(")', r'\1about-work\2', html, count=1)
    if count != 1:
        raise SystemExit('Expected showcase section not found; homepage left unchanged.')
html = re.sub(r'\n?<script\s+src="gallery-upgrade\.js"\s+defer></script>', '', html)
parser = ClosingTags(html)
parser.feed(html)
if 'body' not in parser.ends or 'head' not in parser.ends:
    raise SystemExit('Real head/body closing tags not found; homepage left unchanged.')
if 'href="gallery-upgrade.css"' not in html:
    position = parser.ends['head']
    html = html[:position] + '<link rel="stylesheet" href="gallery-upgrade.css">\n' + html[position:]
    parser = ClosingTags(html)
    parser.feed(html)
position = parser.ends['body']
html = html[:position] + '\n<script src="gallery-upgrade.js" defer></script>' + html[position:]
check = ScriptCheck()
check.feed(html)
if check.gallery_scripts != 1:
    raise SystemExit('Expected exactly one executable gallery script; homepage left unchanged.')
page.write_text(html, encoding='utf-8')
print('Gallery script verified outside comments; service markup preserved.')
