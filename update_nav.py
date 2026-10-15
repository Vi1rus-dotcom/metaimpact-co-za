import os, re
site_dir = r"."
def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Insert Request a Capability Discussion tab before Contact tab
    # Find pattern: <a href=\"./contact.html\">Contact</a>
    # We'll insert before it.
    def repl(m):
        return '      <a href=\"./contact.html\">Request a Capability Discussion</a>\n      ' + m.group(0)
    content = re.sub(r'(      <a href=\"./contact.html\">Contact</a>)', repl, content)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
for root, dirs, files in os.walk(site_dir):
    for f in files:
        if f.endswith('.html'):
            process_file(os.path.join(root, f))
print("Nav updated")
