# Deployment Guide — Portfolio v3

This document covers everything from uploading the folder to GitHub through to having your site live on a free GitHub Pages URL. Follow it top to bottom. Should take ~15 minutes.

---

## What you're about to do

1. Delete or rename your old portfolio repo on GitHub
2. Create a fresh, empty repo
3. Upload the contents of this folder to it (drag and drop, no terminal commands)
4. Turn on GitHub Pages (free hosting from GitHub)
5. Your site goes live at `https://<your-github-username>.github.io/<repo-name>/`

You don't need Git, Node.js, or a code editor for any of this. Everything is done through GitHub's web interface.

---

## Step 1 — Decide on the old repo

You currently have a repo called `Mohamed_Imam-personal_portfolio` (the one you sent me earlier). Two options:

- **Option A (recommended):** rename it to `personal-portfolio-old` for archive, then create a brand new repo
- **Option B:** delete it entirely — only do this if you don't care about its history

To **rename**:
1. Go to your repo on GitHub.com
2. Click the **Settings** tab (top right of the repo)
3. Under "General" → "Repository name", change it to `personal-portfolio-old`
4. Click **Rename**

To **delete**:
1. Repo → **Settings** → scroll all the way to the bottom
2. Click **Delete this repository**
3. Type the repo name to confirm

---

## Step 2 — Create a new empty repo

1. Click the **+** icon top-right of GitHub → **New repository**
2. Repository name: **`portfolio`** (or any name you like — I'll use `portfolio` in the rest of this guide)
3. Description (optional): "Mohamed Imam — personal portfolio site"
4. Set it to **Public** (required for free GitHub Pages)
5. Tick **"Add a README file"**
6. Leave the rest as default
7. Click **Create repository**

You should now be looking at a fresh, mostly-empty repo with just a README in it.

---

## Step 3 — Upload the portfolio files

1. Unzip `portfolio_v3.zip` on your computer. You'll get a folder called `portfolio_v3` (or similar). **Open it** so you can see the contents inside: `index.html`, `assets/`, etc.
2. In your new GitHub repo, click **"Add file"** → **"Upload files"**
3. Drag the **contents of the unzipped folder** (not the folder itself — the files *inside* it: `index.html`, the `assets` folder, the redirect HTML files, etc.) into GitHub's upload zone
4. Wait for everything to finish uploading. The `assets/images/tabicon.png` may take a moment because it's the largest file.
5. Scroll down. Under "Commit changes":
   - Leave the commit message as default, or write "Initial portfolio upload"
   - Make sure "Commit directly to the `main` branch" is selected
6. Click **"Commit changes"**

Your repo now contains all the portfolio files. You should see `index.html`, `assets/`, `README.md` etc. in the repo file list.

> **Tip:** If GitHub can't upload folders directly, use the **"choose your files"** link and select all files at once (Ctrl+A inside the folder), then drag the `assets` folder separately afterward.

---

## Step 4 — Turn on GitHub Pages

This is what publishes your repo to the web for free.

1. In your repo, click the **Settings** tab (top right)
2. In the left sidebar, click **Pages** (under "Code and automation")
3. Under **"Build and deployment"**:
   - **Source:** select **"Deploy from a branch"**
   - **Branch:** select **`main`** from the dropdown, leave the folder as **`/ (root)`**
4. Click **Save**

GitHub will now start building your site. You'll see a banner that says something like *"Your site is live at https://<your-username>.github.io/portfolio/"* — but it may take 1–3 minutes to actually go live the first time.

---

## Step 5 — Wait and verify

1. Wait ~2 minutes
2. Go to the URL shown on the Pages settings screen — e.g. `https://imamnazar.github.io/portfolio/`
3. You should see your portfolio live

If it doesn't work right away:
- Hard refresh (`Ctrl+Shift+R` on Windows / `Cmd+Shift+R` on Mac)
- Wait another minute and try again
- Go to the **Actions** tab in your repo — it'll show the deployment status

---

## Step 6 — (Optional) About the existing Netlify URL

You currently have `mohamed-imam.netlify.app` connected to your old repo. After this migration, you have three choices:

### A. Keep both (recommended for now)
Leave the old Netlify site running on the old repo (or upload the new files there too). GitHub Pages becomes a second URL. Use whichever you prefer.

### B. Point Netlify at your new repo
1. Log into [app.netlify.com](https://app.netlify.com)
2. Find your **mohamed-imam** site
3. Go to **Site configuration** → **Build & deploy** → **Continuous deployment**
4. Click **Manage repository** → **Link to a different repository**
5. Pick your new `portfolio` repo
6. Save. Netlify will rebuild and deploy. Same URL, new repo.

### C. Drop Netlify entirely
- Delete the Netlify site (Site configuration → Danger zone → Delete this site)
- Only use the GitHub Pages URL
- Update your resume / LinkedIn portfolio link accordingly

If you keep Netlify, you'll have **two URLs serving the same site**:
- `mohamed-imam.netlify.app` (via Netlify)
- `imamnazar.github.io/portfolio` (via GitHub Pages)

Both work, both are free.

---

## Step 7 — (Optional) Add a custom domain

If you ever want `mohamedimam.dev` or similar, GitHub Pages supports custom domains for free. You'd buy the domain from Namecheap / Porkbun / etc. (~AUD $15/year for `.dev`), then in repo **Settings → Pages → Custom domain**, enter your domain and follow the DNS instructions. Not required — skip this for now.

---

## Editing your portfolio later

You don't need any tools installed. Edit any file directly on GitHub:

1. Go to the file in your repo (e.g. `index.html`)
2. Click the pencil icon (top-right of the file viewer)
3. Make your changes
4. Scroll down → "Commit changes"
5. GitHub Pages auto-rebuilds within 1–2 minutes

For larger edits (e.g. updating multiple project entries), it's easier to edit locally:

1. Download the repo as a zip from GitHub
2. Edit files in any text editor (VS Code is free and great — code.visualstudio.com)
3. Re-upload changed files via the same "Add file → Upload files" flow

---

## Troubleshooting

**The site shows a 404 page**
- Make sure GitHub Pages is enabled in Settings → Pages
- Confirm the branch is set to `main`, root folder
- Wait 2-3 minutes after enabling — first build takes time

**The styling looks broken (no fonts, plain text)**
- Check that the `assets/` folder uploaded correctly
- Hard refresh (Ctrl+Shift+R)
- View your repo's file list — confirm `assets/css/main.css` is there

**Images don't load**
- GitHub paths are case-sensitive. The file is `tabicon.png` (lowercase). If your local file is `Tabicon.PNG` it won't work.

**Custom cursor not showing on my computer**
- It only appears on devices with a mouse. On touch devices (phones, tablets) the regular system cursor shows.

---

## What to do next

Once your portfolio is live:

1. **Test every section** on desktop and mobile
2. **Update the URL on your resume** — open the .docx, replace the portfolio URL line with the new GitHub Pages URL (if you went with option C above)
3. **Update the URL on LinkedIn** — Profile → Edit intro → Website
4. **Share it** — put it in your email signature, mention it in cover letters
5. **Add the GitHub repo URL** somewhere on your CV too — recruiters will look

---

## Recap of file checklist

After uploading, your repo file list should show all of these:

```
├── README.md
├── contact.html
├── index.html
├── portfolio.html
├── service.html
└── assets/
    ├── css/
    │   └── main.css
    ├── images/
    │   └── tabicon.png
    └── js/
        └── script.js
```

If anything is missing, just re-upload it the same way.

Good luck — and tell me how it goes.
