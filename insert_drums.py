import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('drums.svg.txt', 'r', encoding='utf-8') as f:
    svg = f.read().strip()

# Replace the existing drum <svg>...</svg> block (lines 701-740) with the new artwork.
pattern = re.compile(r'<svg id="drumSvg".*?</svg>', re.DOTALL)
new_html, n = pattern.subn(lambda m: svg, html)
assert n == 1, f'Expected 1 replacement, got {n}'

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print('Replacements:', n)