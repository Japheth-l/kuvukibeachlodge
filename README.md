# Kuvuki Beach Lodge website

A static, mobile-friendly website for Kuvuki Beach Lodge in Kokrobite, Ghana. It uses plain HTML, CSS and JavaScript and has no build step.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Features

- Hero slideshow, sticky header and a full-screen mobile menu
- Suite tabs with swipeable photo carousels
- Package cards (Better Together, Proposal, Weekend reset) that pre-fill the booking form
- Gallery with category filters and a lightbox (keyboard and swipe)
- Booking form with date validation, a guest stepper and a live price estimate. On submit it builds a booking message the guest can send.
- Map, FAQ accordion and a floating "Message us" button

## Configuration

Edit `CONFIG` at the top of `assets/js/main.js`:

- `whatsapp`: the WhatsApp number in international format, digits only (e.g. `233201234567`). This adds a "Send on WhatsApp" button with the message already filled in.
- `email`: adds a "Send by email" option.
- `nightlyFrom`: the starting nightly rate used for estimates (default 2000 GHS).

## Deploy

Any static host works: GitHub Pages (Settings → Pages → deploy from branch), Netlify or Vercel.
