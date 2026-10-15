import os, re
site_dir = r"."
def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    content = re.sub(r'width=\"293\" height=\"62\"', 'width=\"350\" height=\"75\"', content)
    def replace_nav_cta(m):
        return '<div class=\"nav-cta\">\n      <button class=\"nav-toggle\" aria-label=\"Toggle menu\" aria-expanded=\"false\" aria-controls=\"primary-nav\">Menu</button>\n    </div>'
    content = re.sub(r'<div class=\"nav-cta\">.*?</div>', replace_nav_cta, content, flags=re.DOTALL)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
for root, dirs, files in os.walk(site_dir):
    for f in files:
        if f.endswith('.html'):
            process_file(os.path.join(root, f))
print("Done")
