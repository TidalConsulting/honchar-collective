# Static files

Anything in this folder is served from the site root. `public/logo.svg` becomes
`https://yourdomain.com/logo.svg`.

## The logo

Until real artwork exists the header and footer show a typeset wordmark. To use
a logo file, put it here and set `NEXT_PUBLIC_LOGO_FILE` to its path, for
example `/logo.svg`. The site is black throughout, so use gold or white artwork
on a transparent background.

## The hero photo

Put a campaign or flat-lay photo here named `hero.jpg`, `hero.png`, or
`hero.webp` and it appears behind the homepage headline. Without one, the hero
is a plain black panel with a gold glow.

## Uploaded item photos

Photos added through the dashboard go to Vercel Blob in production. Running
locally they land in `public/uploads/`, which is gitignored — those are working
files, not part of the repository.
