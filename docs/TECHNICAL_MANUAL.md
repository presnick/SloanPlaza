# Sloan Plaza Website: Technical Manual

## Architecture Overview
*   **Engine:** Astro (Static Site Generator).
*   **Security:** StatiCrypt (Client-side AES-256 encryption).
*   **Hosting:** GitHub Pages.
*   **CMS:** None (Direct Git usage).

## 🔐 Key Secrets
*   **`SITE_PASSWORD`**: This GitHub Repository Secret controls the password for the resident area.
    *   To change it: Go to **Settings > Secrets and variables > Actions > Repository secrets**.

## 🚀 How to Transfer Ownership (Easy Handover)
If you need to hand this website off to a new board member or management company:

1.  **Go to GitHub Repo Settings.**
2.  Scroll down to the **Danger Zone**.
3.  Click **Transfer**.
4.  Enter the GitHub username of the new owner.
5.  **That's it.**
    *   GitHub automatically redirects traffic.
    *   The site continues to work.
    *   You are no longer responsible for it.

## 🚨 "Glass Break" Upgrades
If the "Pure GitHub" approach becomes too limiting, here are your upgrade paths.

### Option A: Add a Friendly CMS (Pages CMS)
If the manager hates GitHub:
1.  Visit [pagescms.org](https://pagescms.org).
2.  Log in with GitHub.
3.  Select this repository.
4.  Add a `.pages.yml` configuration file to the root of the repo (see Pages CMS docs).
5.  Give the manager the link to `pagescms.org`.

### Option B: Upgrade Security (Vercel)
If you need absolute file protection (not just hidden links):
1.  Sign up for **Vercel** (Free Tier).
2.  Import this repository.
3.  Add **Vercel Authentication** (Middleware) to protect the entire site.
4.  Update your DNS to point to Vercel.
