# Faith Marker Offline

Make totally offline bible reading tracker android mobile app inspired by "my bible tracker" app as i give you screenshot.The app will change to .APK file and install on my phone. If you can give me the offline apk after build which is work when the internet is off. Otherwise i will use corenna builder so the project must have index.html file. The app must look like this screenshot and have protestant 66 book and 1149 chapters with groups and 28 achievement lists by default.

The user must add, edit and delete the tracking list, book name, chapter number, groups, achievement reward manually.

The app must fit in the android mobile screen. make the user mark by chapter not by book after he reads the bible.

Use 66 book groups like History, law... etc by default.

The book split in the new and old testament.

The setting button must have local backup and restore to file the progress. Make sure to backup and restore work correctly. And have theme in color.

The Achievement page must look like the screenshot I gave to you. Use all 28 and the user can add and edit each.

When the user unlocks each achievement must have congrats message with animation. And give an image card surprisingly. That image must relate to bible book content.

When a user achieves the book it must unlock the achievement. When the user cancels the book achievement must lock again.

When users add books manually they can select old and new testaments with the group.

Make sure all buttons are working like mark all edit add cancel all.

Make the book lists have states bar each in simple.

Make this app fully offline-first. Store all user data locally on the device using IndexedDB/local database. The app must continue working when there is no internet connection. Remove all branding, watermarks and external dependencies. Do not load fonts, images, CSS or JavaScript from external URLs. Keep the current UI design exactly as it is.

Make a fully offline-capable Progressive Web App (PWA).

Add a viewport meta tag and CSS to block two-finger zoom so the tracker opens full-screen on my phone.

IMPORTANT:

Do NOT redesign or change the existing UI.

Do NOT remove or change any existing features.

Keep the current colors, layout, buttons, icons, pages, and user experience exactly as they are.

Offline requirements:

The app must open and work without an internet connection after the first installation/load.

Add a proper PWA service worker and cache all required app assets.

Store all Bible tracker data locally on the device using IndexedDB or another reliable local database.

User-created Bible trackers must remain available offline.

Reading/progress information must be saved locally and must not disappear when the app is closed.

Settings must also persist offline.

The app must not depend on Lovable's server for normal tracker usage.

When there is no internet connection, the app must still open and allow the user to: 

create a tracker

edit a tracker

delete a tracker

record Bible reading progress

view existing trackers

change settings

Add book, group and achievement must store in a local device. Not using the internet.

Add an offline fallback so the app does not show a blank page or network error when disconnected. And no white screen show.

Make sure the app can be installed as a PWA on Android.

Add a proper manifest.json with app name "Faith Mark", suitable icons, standalone display mode, and theme colors.

Make sure all required JavaScript, CSS, fonts, icons, and application assets are cached for offline use.

Do not add advertisements, watermarks, or third-party branding.

Do not require login or an internet connection for the basic Bible tracking functionality.

After making these changes, test the application logic carefully and fix any errors caused by the offline implementation. Then I need a .apk file.

Publish the app, then build the offline Faith Marker .apk so I can install it on my phone as a real Android app. This app must work when the internet is off.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sacred-journal.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fc6f349b-9767-4360-921b-45cf663f31a5).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
