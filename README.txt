ALL DONE.

Changes:
1. Removed all server dependencies (no modules, no fetch, relative paths only).
2. Added classic script loading and offline font fallbacks.
3. Wrapped all JS in error-safe try/catch blocks; added 2.5s preloader fallback.
4. Added launcher files (Windows/Mac) and README.txt.
5. Optimized for phones: disabled touch effects, reduced particle count, fixed top gap and responsiveness.
6. Added LinkedIn links and quick facts.
7. Projects section: removed charts, added Portfolio project card.
8. Replaced Raise Ticket with robust Email Composer (copy to clipboard, Gmail open, mailto fallback).
9. Added "Beyond Work" section with playable piano, code editor animation, and compass.
10. Added "Open Portfolio.bat" and "Open Portfolio.command" for easy launching.

How to open:
1. Double-click "Open Portfolio.bat" (Windows) or "Open Portfolio.command" (Mac).
2. Or simply double-click index.html to open in your browser.
3. For mobile: upload files to GitHub Pages as described in README.txt.

How to add a website:
1. Open creations-data.js.
2. Copy one entry object inside window.CREATIONS.
3. Change title, description, url, tech, image, and accent color.
4. Save file, commit, and push.

How to remove a website:
1. Open creations-data.js.
2. Delete the website entry object.
3. Save file, commit, and push.

Summary: Fully offline, serverless, mobile-responsive, no external dependencies (except Google Fonts), and safe for file:// access.
