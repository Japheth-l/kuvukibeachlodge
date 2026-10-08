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

- `whatsapp`: the booking WhatsApp number (currently `233200418854`). Booking requests open in WhatsApp with the message already filled in.
- `email`: optional; adds a "Send by email" option.
- `rates`: the nightly price range for each room, used for the live estimate.
- `packageFrom`: starting prices for packages (beach dinner / proposal: GHS 960).

The "October/November Getaway Deals" bar is the `#promo` block at the top of `index.html`. Edit or delete it when the offer ends.

## Deploy

Any static host works: GitHub Pages (Settings → Pages → deploy from branch), Netlify or Vercel.
