# 📦 Storage Box Organizer

A clean, cloud-synced web app for cataloguing your physical storage boxes and their contents — with photos, tags, and fuzzy search. Never lose track of where you put something again.

---

## ✨ Features

- **Box & Item Catalog** - Create boxes with a name, location, description, tags and photos, and add items to them
- **Photos** - Attach several photos to any box or item, taken with the in-app camera or picked from the gallery; open them fullscreen with pinch and double-tap zoom
- **Box Locations** - Record where each box physically is ("attic, shelf 2"); earlier locations are offered as you type
- **Fuzzy Search** - Find items by name, description or tag, powered by [Fuse.js](https://www.fusejs.io/). Searching the box list also looks at locations and inside the boxes, and says which item matched
- **Tagging System** - Boxes and items share one tag vocabulary; rename, merge or delete a tag everywhere from a central manager
- **Sort & Filter** - Sort by newest, oldest or name; the box list adds recently changed, by location and fullest first. Filter any view by tag
- **"Items" View** - Browse every item across all boxes in one list, with the box each one is in
- **Unassigned Items** - Items can exist without a box; assign or reassign them at any time
- **Bulk Actions** - Select several items to move them to a box, add tags or delete them in one go
- **Printable Box Labels** - Print a QR label for each box; scanning it with the phone camera opens that box in the app
- **Inventory Check** - Lists what needs attention: items in no box, boxes with no location, untagged items, empty boxes and anything without a photo
- **Undo** - Deleting an item or a box, or removing an item from its box, can be undone from the notification for a few seconds
- **English & Bulgarian** - The first launch follows the browser language; switch any time in Settings
- **Dark & Light Theme** - Toggle between themes; preference is saved per browser
- **Works Offline** - Firestore's local cache keeps the inventory available without a connection, and changes sync when it returns
- **Import / Export** - Back up your data, photos included, as a JSON file and restore it with a progress modal
- **Browser History** - Deep-linkable views via URL hashes (`#box/<id>`, `#all-items`)
- **Invite-only** - Anyone can create an account, but nothing is readable until the owner approves it; data is then scoped per user, enforced by Firestore rules

---

## 🖥️ Live App

The app is deployed on Firebase Hosting at
<https://storageboxorganizer-42466.web.app>. Create an account with an email
address and a password; it can see nothing until the owner approves it (see
[Access control](#access-control)).

**New here?** The [landing page](https://sciscend.github.io/StorageBoxOrganizer/)
(Bulgarian, with English) explains what the app does, how to install it and how
to get access, in plain words for non-technical people. Its source is the static
`site/` folder, published to GitHub Pages by `.github/workflows/pages.yml` on any
change under `site/`; it has no build step and nothing to do with the Firebase
deploy.

### Installing it on a phone

Two ways, same app — both load the same hosted build, so both stay up to date on
their own without a reinstall.

**From the browser (PWA).** Open the live app in Chrome (Android) or Safari
(iOS) and add it to the home screen — Chrome offers *Install app* in its ⋮ menu,
Safari uses *Share → Add to Home Screen*. It launches standalone, without the
address bar, and a service worker keeps it opening offline after the first
visit. Nothing to download, works on both platforms.

**From the APK (Android only).** Grab `storage-box-organizer-<version>.apk` from
the [Releases page](https://github.com/SciScend/StorageBoxOrganizer/releases) and
open it on the phone; Android will ask you to allow installing from that source
once. The APK adds what the browser cannot give a web page: the hardware back
button wired into navigation, a native splash screen and a status bar styled to
match the app. Photos are taken with the same in-app camera in both. It is
signed with the project's release key, so a later release installs straight
over it.

---

## 👤 End-User Guide

### Getting started

1. Open the app and create an account (email and password). Until the owner
   approves it you will see an "Access not approved yet" screen; tap
   **Check again** once they confirm.
2. On the **Boxes** tab, tap the round **+** button at the bottom to create your
   first box.
3. Give it a name and, optionally, a location, a description, tags and photos.
4. Open the box and tap **+** again to start cataloguing its contents.

### Navigating

| View | How to reach it |
|---|---|
| All boxes | Tap the logo or the **Boxes** tab |
| Inside a box | Tap any box card, or scan the QR code on its printed label |
| All items | Tap the **Items** tab |

The browser's Back button, and the hardware Back button on Android, step back
through these views.

### Working with boxes

The box menu (the three dots in the box's header) has:

- **Edit Box** - name, location, description, photos and tags.
- **Remove (keep items)** - deletes the box; its items stay, unassigned.
- **Delete Box & Items** - deletes the box and everything in it. The confirmation
  says how many items go with it, and the notification offers Undo for a few
  seconds.

### Working with items

- **Assign / move** - In the item's edit form, type in the **Box** field to find
  a box by name or location, or choose **Unassigned (no box)**.
- **Remove from box** - The item's menu (the three dots on its card) has
  **Remove from Box**, which unassigns the item but keeps it in **Items**.
- **Delete** - **Delete Item** in the same menu removes the item and its photos.
  The notification offers Undo for a few seconds.
- **Add an existing item to a box** - Inside a box, tap **+** and switch to
  **Select Existing**. Items in no box are listed first.
- **Several at once** - In an item list, tap the select button in the search bar,
  tap the items you want, then choose **Move to box**, **Add tags** or
  **Delete selected**. **Select all shown** takes what the current search and
  filter show.

### Tags

- Add tags to any box or item when creating or editing it. The suggested tags
  start with the ones you used most recently.
- Tags are **case-insensitive** and stored in lowercase: `Books` and `books` are
  the same tag.
- Use **Settings > Manage Tags** to rename a tag across all boxes and items at
  once, or delete it entirely. Renaming a tag to one that already exists merges
  the two.
- Filter any view by tag with the tag button in the search bar. In the box list,
  a box matches if it carries the tag or holds an item that does.

### Settings

- **Language** (English / Bulgarian) and **light / dark theme**.
- **Sync data** reloads your data, for example after a change made on another
  device.
- **Manage Tags** - see above.
- **Optimize Images** converts photos stored by older versions to the current,
  lighter format. Safe to run again.
- **Inventory check** lists what needs attention, and each row opens the thing to
  fix.
- **Print labels** makes a printable sheet of QR labels, one per box.
- **Check for Updates** offers to reload when a newer version has been deployed.
- **About** shows the version, the author, a contact address and a link to the
  user guide.

### Backup & restore

- **Export** - **Settings > Export Data** downloads a `.json` file with all boxes,
  items and their photos.
- **Import** - **Settings > Import Data**. Select your `.json` backup; a progress
  modal tracks the restore. Boxes and items already in your account are replaced
  by their version in the backup and the rest are added, so importing the same
  backup twice never creates copies.

---

## 🛠️ Developer Guide

### Tech stack

| Layer | Technology |
|---|---|
| UI framework | React 19 |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v4, with theme-aware colour tokens (`bg-surface`, `text-muted`, ...) defined in `src/index.css` |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fuzzy search | Fuse.js |
| QR codes (box labels) | qrcode |
| Translations | Own small i18n layer in `src/translations/` (English, Bulgarian) |
| Backend / Auth | Firebase (Firestore with an offline cache + email/password Authentication) |
| Image processing | Browser Canvas API: a ~256 px thumbnail and a ~1024 px full image per photo, WebP (JPEG fallback) |
| ID generation | uuid v4 |
| Hosting | Firebase Hosting, installable as a PWA (service worker from `src/sw.js`) |
| Android app | Capacitor 7 |
| Admin scripts | Node.js + Firebase Admin SDK |

### Prerequisites

- **Node.js 24**, the version in `.nvmrc` and the one CI uses (Vite 7 needs at
  least 20.19), with the npm that comes with it
- A **JDK** (21) for `npm run test:rules` (the Firestore emulator) and for APK
  builds, which also need the **Android SDK**
- The **Firebase CLI** is a dev dependency, so `npm install` brings it; run it as
  `npx firebase`
- Your own **Firebase project** with Firestore, Authentication and Hosting
  enabled - only if you deploy a copy of the app elsewhere

### Local setup

```bash
git clone https://github.com/SciScend/StorageBoxOrganizer.git
cd StorageBoxOrganizer
npm install
npm run dev
```

The app will be available at `http://localhost:5173`, talking to the live
Firebase project, so you need an approved account to see data.

To look at the UI without one, open `http://localhost:5173/?mock-auth=true`: the
dev server then skips sign-in and loads sample boxes and items. It is read-only -
any save fails with "User not authenticated" - and the flag does nothing in a
production build.

### Firebase configuration

The Firebase config is in `src/firebase.js`. For your own deployment, replace the
values with those from your Firebase project's settings, and change the project
ID in `.firebaserc` and the hosted URL in `capacitor.config.json` (`server.url`):

```js
// src/firebase.js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

> **Security note:** These are client-side config values, and they ship inside the JavaScript bundle of every deployment — they are not secrets and are safe to commit. What protects the data is the Firestore Security Rules, not the config being hidden.

#### Firestore Security Rules

The live ruleset lives in [`firestore.rules`](firestore.rules) and is deployed with `npx firebase deploy --only firestore:rules` (or as part of `npm run deploy`). It covers the `boxes`, `items` and `images` collections and enforces two independent gates:

1. **Approval** — the account must carry the `approved` custom claim (see [Access control](#access-control) below).
2. **Ownership** — every document carries a `userId`, and an approved account may only touch its own.

Both are covered by tests you can run without touching a real project:

```bash
npm run test:rules     # spins up the Firestore emulator, needs Java
```

#### Firebase Authentication

Only **email/password** is enabled — `AuthModal` has no other provider wired up. Turn it on in Firebase Console → Authentication → Sign-in method. Password reset uses Firebase's own reset email ("Forgot your password?" on the sign-in form).

### Access control

Firebase Auth accepts a sign-up from anyone holding the web API key, and that key is public by necessity — it is in the bundle every visitor downloads. So *signed in* cannot mean *allowed*, and on the free Spark plan a stranger creating accounts is a stranger spending your daily read/write quota.

The rules therefore refuse **everything** until an account is granted the `approved` custom claim:

```bash
npm run access                          # list every account and its status
npm run access grant you@example.com    # let someone in
npm run access revoke them@example.com  # lock someone out
```

An unapproved account gets an "Access not approved yet" screen showing its email and account ID, plus a **Check again** button that forces a token refresh. Granting takes effect on the next refresh — that button, or signing out and back in.

> **Before you deploy these rules for the first time**, approve yourself. A ruleset that nobody is approved for locks everyone out, including you:
>
> ```bash
> npm run access grant you@example.com         # first
> npx firebase deploy --only firestore:rules   # then
> ```

#### Further hardening (optional, both free)

- **Restrict the API key** — Google Cloud Console → APIs & Services → Credentials → your browser key → *Website restrictions*, limited to your Hosting domain. The Android build loads the app from that same origin (`capacitor.config.json` → `server.url`), so it keeps working.
- **Enable App Check** — reCAPTCHA v3 for web, Play Integrity for Android. Blocks requests that do not come from your app at all.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run deploy` | Build and deploy to Firebase Hosting, together with `firestore.rules` |
| `npm run lint` | Run ESLint |
| `npm run translations:check` | Verify `en`/`bg` string files agree with each other and with the code |
| `npm run test:rules` | Run the Firestore security-rules tests against the emulator (needs Java) |
| `npm run access` | List / grant / revoke account approval (requires service account) |
| `npm run backup` | Dump the `boxes`, `items` and `images` collections to `.backups/` (requires service account) |
| `npm run import -- <file> [uid]` | Import a backup JSON into Firestore, optionally under another user (requires service account) |
| `npm run cap:sync` | Build the web app and copy it into the Android project |
| `npm run android:open` | Open the Android project in Android Studio |
| `npm run android:run` | Run the app on a connected device or emulator |
| `npm run android:apk` | Build a **debug** APK (`android/app/build/outputs/apk/debug/`) |
| `npm run android:release` | Build a **signed release** APK (`android/app/build/outputs/apk/release/`) |

### Data model

All documents in Firestore are scoped by `userId` so that queries never leak between accounts.

#### Box (`boxes`)

```ts
{
  id: string          // UUID v4
  userId: string      // Firebase Auth UID
  name: string
  description: string
  location: string    // where the box physically is; '' or absent if not set
  tags: string[]      // lowercase, de-duplicated; shared vocabulary with items
  images: { id: string, thumb: string }[]  // id -> doc in `images`, thumb inline
  image: string | null  // thumb of the first image, kept for backward compatibility
  createdAt: number   // Unix timestamp (ms)
  updatedAt?: number  // set when the box's contents change (item added, moved, removed)
}
```

#### Item (`items`)

```ts
{
  id: string          // UUID v4
  userId: string      // Firebase Auth UID
  boxId: string       // UUID of parent box, or '' if unassigned
  name: string
  description: string
  tags: string[]      // lowercase, de-duplicated
  images: { id: string, thumb: string }[]
  image: string | null  // thumb of the first image, kept for backward compatibility
  createdAt: number   // Unix timestamp (ms)
  modifiedAt: number  // Unix timestamp (ms), set on updates
}
```

#### Full-size image (`images`)

```ts
{
  id: string          // UUID v4, referenced from an entity's images[].id
  userId: string      // Firebase Auth UID
  ownerType: 'box' | 'item'
  ownerId: string     // deleting the box or item deletes its images too
  full: string        // base64 data URL, ~1024 px
  createdAt: number   // Unix timestamp (ms)
}
```

An in-app import keeps a document's original ID where it is safe to, and
otherwise uses `<uid>_<originalId>`, so an import never duplicates what is
already there.

### Image storage

The project stays on Firebase's free Spark plan, so there is no Cloud Storage
bucket: photos live in Firestore, split into two sizes. Each photo is processed
in the browser (`src/utils/imageUtils.js`) into a **thumbnail** (~256 px, WebP
quality 0.6, a few KB), stored inline on the box or item so lists render with no
extra reads, and a **full image** (~1024 px, WebP quality 0.78), stored as its
own document in `images` and fetched only when opened fullscreen. Full images are
then cached in IndexedDB (`src/utils/imageCache.js`), so each one is downloaded
at most once per device. Browsers that cannot encode WebP get JPEG.

Older data stored full-size base64 strings directly in `images`; the app still
reads that shape, and **Settings > Optimize Images** converts it in place.

### Admin scripts setup

The scripts in `scripts/` use the **Firebase Admin SDK** and require a service account key:

1. Firebase Console → Project Settings → Service Accounts → **Generate new private key**.
2. Save the JSON file to `.secrets/`. That is all — `scripts/lib/admin.js` picks up the first `*.json` it finds there, or the file `$GOOGLE_APPLICATION_CREDENTIALS` points at.

```bash
# Back up the boxes, items and photos of every account
npm run backup

# Import from a specific backup file (optionally re-owned by another UID)
npm run import -- .backups/firestore-backup-<timestamp>.json [uid]
```

> `.secrets/` and `.backups/` are git-ignored. Never commit service account keys — unlike the web config above, these *are* real credentials, and they grant full admin access to the project.

### Deploying

```bash
# Authenticate once
npx firebase login

# Build, then deploy Hosting and the Firestore rules
npm run deploy
```

Or deploy only the site:

```bash
npm run build
npx firebase deploy --only hosting
```

### Building the Android APK

The APK is a Capacitor shell around the hosted site (`capacitor.config.json` →
`server.url`), not a copy of it. That means a web deploy reaches every installed
phone immediately, and a new APK is only needed when the native shell itself
changes — a plugin, a permission, the splash screen.

```bash
npm run android:release   # → android/app/build/outputs/apk/release/app-release.apk
```

Needs the Android SDK (`android/local.properties` → `sdk.dir`) and a JDK 21.
CI builds the signed APK on every release by itself (see *Releases and
versioning*); build one locally to try a native change on a phone first.

**Versioning is automatic.** `android/app/build.gradle` reads `package.json` at
build time, so `versionName` is the released semver and `versionCode` is it
packed into one ascending integer — `major * 1000000 + minor * 1000 + patch`, so
1.17.2 is `1017002`. Nothing to bump by hand, and nothing that can drift from the
web version. Three digits per part, because the old two-digit packing collided
once a part reached 100 (1.17.100 and 1.18.0 were both `11800`), and Android
refuses an update whose `versionCode` has not grown.

**Signing.** Release builds are signed from `.secrets/keystore.properties`,
which points at `.secrets/release-keystore.jks`. Both are gitignored and never
committed; CI rebuilds them from repository secrets (see *Releases and
versioning*).

> ⚠️ **Back up `.secrets/`.** Android identifies an app by its signing key. Lose
> the keystore and no future APK can install as an update over an already
> installed one — every user would have to uninstall first. (No data would be
> lost; it all lives in Firestore.)

Without that properties file the build still works: `assembleDebug` is
unaffected, and `assembleRelease` simply produces an unsigned APK, which Android
will refuse to install.

### Releases and versioning

Releases are cut by [release-please](https://github.com/googleapis/release-please)
(`.github/workflows/release.yml`, configured in `release-please-config.json` and
`.release-please-manifest.json`). It works in two steps:

1. **Every push to `main`** updates one open release PR, titled
   `chore(main): release X.Y.Z`. The version comes from the Conventional Commit
   subjects since the last release (`fix` → patch, `feat` → minor, `!` → major),
   and the PR carries the `CHANGELOG.md` entry and the `package.json` bump.
   Nothing is released yet — merge more work and the PR grows.
2. **Merging that release PR** tags `vX.Y.Z`, creates the GitHub Release with the
   changelog as its notes, and a second job builds the signed APK and attaches it
   as `storage-box-organizer-X.Y.Z.apk`. "Latest" on the Releases page is
   therefore always the newest version.

It does **not** deploy — run `npm run deploy` after merging the release PR, or
the live app stays on the previous build.

**Only user-facing commits release.** `feat`, `fix`, `perf`, `refactor`, `revert`
and `deps` go into the changelog; `docs`, `chore`, `ci`, `test`, `build` and
`style` are hidden, and a set of commits with nothing visible opens no release PR.

**The PR title is the release note.** PRs are squash-merged, and GitHub builds
the squash commit's subject from the PR title. That subject is the only thing
release-please reads, so a branch full of well-formed `feat:` commits still
ships as a patch with an empty changelog if the title says `chore:`. Title the
PR after the most significant change in it.

`.github/workflows/pr-title.yml` enforces that: the title must be a Conventional
Commit, and it must not claim a smaller bump than its own commits do. You can run
the same check locally:

```bash
.github/scripts/check-pr-title.sh "feat(ui): add an About dialog"
.github/scripts/check-pr-title.sh "chore: tidy up" main HEAD   # also compares commits
```

**APK signing in CI.** The `apk` job restores the keystore from four repository
secrets — `KEYSTORE_BASE64` (the `.jks`, base64-encoded), `STORE_PASSWORD`,
`KEY_ALIAS`, `KEY_PASSWORD` — into `.secrets/` before running
`npm run android:release`. GitHub secrets cannot be read back, so they are not a
backup: the local `.secrets/` still needs one.

**Rebuilding an APK for an existing tag** (backfilling a Release, replacing a
broken asset): Actions → Release → *Run workflow* with the tag, or

```bash
gh workflow run release.yml -f tag=v1.17.2
```

The Release must already exist; the job only uploads to it.

---

## ✅ What is not automated

Everything else in this README the tooling does on its own. These are the steps
that need a human, collected in one place so none of them is discovered late.

### Once — and it matters most

- [ ] **Back up `.secrets/` off this machine.** It holds
      `release-keystore.jks` and the passwords that unlock it, and it is
      gitignored, so the working copy is the only copy. Android identifies an
      installed app by its signing key: lose the keystore and no future APK can
      install as an update over one already on a phone — every user has to
      uninstall first. Nothing is lost from the app itself (all data lives in
      Firestore), but the upgrade path is gone permanently and cannot be
      recreated. Copy the directory somewhere encrypted and off-machine —
      a password manager's file attachment, an encrypted archive in cloud
      storage, a USB key in a drawer. Any two of those.
- [ ] **Install the APK on the phone once and open it**, so the signed build is
      known to work before a release depends on it. The
      [Releases page](https://github.com/SciScend/StorageBoxOrganizer/releases)
      has the file; Android asks once for permission to install from that source.
- [ ] **GitHub settings, again after moving the repository.** "Allow GitHub
      Actions to create and approve pull requests" must be on in both the
      organisation's and the repository's Actions settings, or release-please
      cannot open its release PR; and the four signing secrets (*APK signing in
      CI* above) must exist, or the APK job fails. Both are in place for
      `SciScend/StorageBoxOrganizer`.

### After every merge to `main`

- [ ] **`npm run deploy`.** The release workflow bumps the version and tags it —
      it does **not** deploy. Until this runs, the live site is unchanged, and so
      is every phone, because the APK loads that site rather than a copy of it.
      Confirm with
      `curl -s "https://storageboxorganizer-42466.web.app/version.json?ts=$(date +%s)"`:
      the `buildId` must differ from the previous deploy's.

### Only when the native shell changes

A plugin, a permission, the splash screen, `capacitor.config.json` — anything
under `android/`. A change confined to the web app needs none of this; it reaches
installed phones through the deploy above.

- [ ] **Make sure the change is released.** CI builds and attaches the APK only
      when a release PR is merged, and only a user-facing PR title (`feat`,
      `fix`, ...) opens one - see *Releases and versioning*. To try the change on
      a phone before that, see
      [Building the Android APK](#building-the-android-apk).
- [ ] **Tell Android users to install the new APK** from the
      [Releases page](https://github.com/SciScend/StorageBoxOrganizer/releases).
      An installed APK picks up web changes by itself, but not a new native
      shell, and the app does not announce one.

---

## 🗺️ Architecture notes

- **Optimistic UI** - State updates happen immediately on the client; if the Firebase write fails, the state reverts and a toast error is shown. Deletes are held back for a few seconds so the notification can offer Undo, and any still pending are written when the page is hidden.
- **Browser history** - `window.history.pushState` is used to make views deep-linkable. The back button navigates between the box list, a box's contents and all items without a full page reload; on Android the hardware Back button is routed through the same history (`src/native/backHandler.js`).
- **Storage layer** - `src/services/firebaseStorage.js` is the only backend. `src/storage.js` (LocalStorage + IndexedDB) and `src/services/storage.js` (LocalStorage) are older local implementations kept for reference; nothing imports them.
- **Offline** - Firestore runs with a persistent IndexedDB cache (`src/firebase.js`). Writes are not awaited on the server, so an offline save still closes its form, and the SDK sends the queued writes when the connection returns.
- **Tag operations** - Renaming or deleting a tag queries every box and item carrying any spelling of that tag and batch-updates them.
- **Native code** - The app's Android-specific JavaScript is in `src/native/`, guarded by `Capacitor.isNativePlatform()`, so it does nothing in a browser.
- **Translations** - UI strings are in `src/translations/en.json` and `bg.json`; the domain nouns (box, item, tag, photo) are defined once in `terms.*.json`. `src/translations/README.md` (in Bulgarian) explains how to change a word everywhere.

---

## 📄 License

MIT — see `LICENSE` for details.