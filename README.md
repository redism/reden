# Reden

Simple command-line utilities tool-belt. (For mac) Assumes `git`, `adb`, `gcc` is accessible. (though it might partially without them)

## git utilities for github-based workflow.

**Every git command gets confirm from you before executing harmful command until you told it not to (with -y option.)**

This script will ask you for more information about which remote to use, which branch to use, etc. All configurations are per repo basis.
Configurations are stored at `~/.reden.json`. You can reset options per repo /w `-reset` option.

* `git pa` : Prune from all remotes.
* `git sync` : Sync(pull) with a specific remote. Especially useful when working with pull requests with one master repo.
* `git pr` : Push current local branch to origin, and open pull request page.
* `git master` : Fast-forward develop and master branch, and merge develop into master.
* `git pp` : Pull and prune rebased branch. (Check if rebased into main branch using commit log)

## image post-process utilities for faster screen capture.

Easier screen capture and post processing for attaching images to github issue, google drive, blog, etc.

* `andcapture` : Capture screen from currently connected android device, and downsize it to 640. (assume, `adb` is in `PATH`)
* `ppimg` : Post-process image. Find recently added screen capture (png file) from `Desktop`, downsize and convert to jpg.
  * `ppimg` : Pick 1 recent capture, downsize to 640, convert to jpg.
  * `ppimg -i` : Interactive mode
  * `ppimg -c` : Pick 1 recent capture, retain original size, convert to jpg and copy to clipboard.
  * `ppimg -o` : Pick 1 recent capture, retain original size, convert to jpg file.
  
## push bullet simple script.

Send a message to the specific device using [Push-Bullet](https://www.pushbullet.com/). You can go grab a cup of coffee until long-running client command finishes. Run once after installation to setup API token and default message.

Example)

```
$ npm install ; push
```

* `push --reset` : Reset push related configuration.

## Thanks to

`impbcopy` executable source code was from [Alec's article](http://www.alecjacobson.com/weblog/?p=3816).
