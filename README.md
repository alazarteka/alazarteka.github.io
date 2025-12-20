# alazarteka.github.io

Personal website and blog built with Jekyll and custom HTML/CSS/JS.

## Features

- **Minimal Jekyll setup** - Lightweight static site generation
- **Custom design** - Bold typography and unique aesthetic
- **Cellular automaton background** - Interactive HighLife algorithm visualization
- **Performance-first** - Vanilla JavaScript, no frameworks
- **Markdown blog** - Write posts in markdown, push to publish

## Development

```bash
# Install dependencies
bundle install

# Run local server
bundle exec jekyll serve

# Site will be available at http://localhost:4000
```

## Writing Posts

Create a new markdown file in `_posts/` following the naming convention:

```
_posts/YYYY-MM-DD-title.md
```

With front matter:

```yaml
---
layout: post
title: Your Post Title
date: YYYY-MM-DD HH:MM:SS
description: Brief description
---

Your content here...
```

## Tech Stack

- Jekyll for static site generation
- HTML5 Canvas for cellular automaton
- Vanilla JavaScript (no frameworks)
- Custom CSS with CSS variables
- Hosted on GitHub Pages

## License

MIT License - see [LICENSE](LICENSE) for details
