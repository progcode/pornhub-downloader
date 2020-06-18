# Pornhub Downloader
Downloads videos from pornhub using nodejs or browser

### Cannot download:
* Pay to *view* (Pay to download is supported)
* Private videos 
* Premium videos (unless they're free)
* Quality past 1080p
* Geo-blocked  videos

### How to use
###### Browser: 
1. Copy the code from `main.js`
2. Find a video you want to download
3. Open the developer tools (`ctrl + shift + i` or `F12`)
4. Select the `console` tab
5. Paste the code and press enter

###### Node.Js:
1. Make sure you have [Node.Js](https://nodejs.org) installed
2. Download `main.js`
3. (Optional Step)  
    3.1 Find `NodeJS("")` in code  
    3.2 Paste url inside the `""`
3. Open a command prompt in the directory `main.js`is in (or `cd` into it)
4. Download Options `add url in code (step 3) or pass it using url=URL_HERE`  
    5.1 `node main.js download=all` download all qualities  
    5.2 `node main.js download=highest` download highest quality  
    5.3 `node main.js download=lowest` download lowest quality  
    5.4 `node main.js download=[quality]` download provided quality (1080p, 720p, 480p, 240p)  
    5.5 `node main.js` download highest by default

##### Download Examples
```
node main.js download=hightest url=https://www.pornhub.com/view_video.php?viewkey=ph5ed77e4eb5c46
node main.js download=1080p url=https://www.pornhub.com/view_video.php?viewkey=ph5ed77e4eb5c46
node main.js url=https://www.pornhub.com/view_video.php?viewkey=ph5ed77e4eb5c46
providing url like this ^ will take priority over pasted url in source code (if any)
```

##### Script Expected Results:
###### Browser: All download links will be displayed in console, click the one you want to download
###### NodeJS: Video will automatically be downloaded with pornhub's file name

## Browsers Tested:
------------------------------------------------------
|      Name     |    Version    |    Date   | Passed |
|---------------|---------------|-----------|--------|
| Google Chrome | 83.0.4103.106 | 6/18/2020 | true   |
| Brave         | 1.10.93       | 6/18/2020 | true   |
| Opera GX      | 68.0.3618.142 | 6/18/2020 | true   |
| Firefox       | 77.0.1        | 6/18/2020 | true   |
------------------------------------------------------
```
Everything was written and tested by me (Ena/Vickieboo)
Discord: Ena 𓆈#1328 (if you wanna be friends)
```
