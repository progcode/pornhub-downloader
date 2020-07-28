// hello!
// I have left helpful (hopefully?) comments to help navigate/understand the code
// everything you see was completely written by me from scratch
// pls dont cringe too hard at code
// uh everything should work - 6/18/2020 at 6:10 AM

function NodeJS(url) {
    // checks if url was passed as an argument when starting the script via node
    let gr = process.argv.find(arg => arg.startsWith("url="));
    if (gr) url = gr.replace("url=", "");

    // first "if" checks if url is present, second "if" checks if url is a valid(ish) pornhub link
    if (!url) return console.log("No url provided");
    if (!/^https:\/\/(\w{1,3}\.)?pornhub\.com\/view_video\.php\?viewkey=\w+$/i.test(url)) return console.log("Invalid url");

    // user_agent is for https request (pornhub refuses connection if user agent is missing)
    const {get:https} = require("https"), download_arg = process.argv.find(arg => arg.startsWith("download="));
    const user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36";
    const download_options = ["highest", "lowest", "1080p", "720p", "480p", "240p"];

    // sets the download option
    let download_option = "highest";
    if (!download_arg) console.log("No download option provided, using default:", download_option);
    else download_option = download_arg.replace("download=", "").toLowerCase();
    if (!download_option) download_option = "highest";

    // checks if download option was valid
    if (!download_options.includes(download_option)) {
        console.log("Invalid download option:", download_option);
        console.log("Valid options:", download_options.join(" - "));
        return;
    }
    // oh boy the gross part
    https(url, {headers: {"user-agent": user_agent}}, response => {
        if (response.statusCode !== 200) return console.log(`Unexpected ${response.statusCode} (${response.statusMessage})`);
        let html = ""; // gets page source
        response.on("data", chunk => html += chunk).on("end", function() {
            const matches = html.match(/(?<=\*\/)\w+/g), urls = []; // pornhub stores urls in a gross way so I *need* regular expression
                    // this ^ pattern matches each variable that contain a part of a download url
                    // The variable will be clean in the same regex
            for (let index = 0; index < matches.length; index++) { // loops through each match
                const regex = new RegExp('(?<=' + matches[index] + '=")[^;]+(?=")', "g"); // <- new regex pattern using the variable name
                const value = html.match(regex)[0].replace(/[" + "]/g, ""); // cleans variable value
                // Return only the value inside the variable
                if (value.startsWith("https")) { // if the result starts with "https" it means the previous variable has ended
                    if (urls.length === 4) break; // this caps at 4 because there's only 4 possible download links
                    urls.push(value); // pushes the current value to start a new link
                } else urls[urls.length -1] += value; // adds current value(part) to previous url
            }
            for (let index = urls.length; index > 0; index--) // removes duplicates and invalid links
                if (urls.indexOf(urls[index]) !== index || urls[index].includes("master")) urls.splice(index, 1);
            if (urls.length < 1) return console.log("No urls found :("); // stops the script if no urls were found
            else console.log(`Found ${urls.length} url${urls.length === 1 ? "" : "s"}`);

            urls.sort((a, b) => Number(b.replace(/(?!\d+P_)./g, "")) - Number(a.replace(/(?!\d+P_)./g, ""))); // sorts urls from highest to lowest quality
            const highest = `${urls[0].replace(/(?!\d+P_)./g, "")}p`, lowest = `${urls[urls.length -1].replace(/(?!\d+P_)./g, "")}p`;
            console.log(`Options available: ${urls.map(url => `${url.replace(/(?!\d+P_)./g, "")}p`).join(" - ")}`);

            let url;
            switch (download_option) { // checks which option to download
                case "highest":
                    console.log(`Downloading highest available quality (${highest})`);
                    url = urls[0];
                    break;
                case "lowest":
                    console.log(`Downloading lowest available quality (${lowest})`);
                    url = urls[urls.length -1];
                    break;
                case "1080p":
                case "720p":
                case "480p":
                case "240p":
                    url = urls.find(url => url.includes(download_option.toUpperCase()));
                    if (!url) return console.log(`Video wasn't available in provided quality (${download_option})`);
                break;
            }
            https(url, response => {
                if (response.statusCode !== 200) return console.log(`Unexpected ${response.statusCode} (${response.statusMessage})`);
                const fs = require("fs"), file = `./videos/${url.match(/\d+P_\d+K_\d+\.mp4/g)}`, size = response.headers["content-length"];
                console.log(`Saving video to ${file}`);
                if (!fs.existsSync("./videos/") || !fs.lstatSync("./videos/").isDirectory()) fs.mkdirSync("./videos/");
                if (fs.existsSync(file)) return console.log(`${file} already exists`);
                let stream = fs.createWriteStream(file), progress = 0;
                stream.on("error", console.log);
                stream.on("finish", function() {
                    console.log(`${file} finished!`);
                });
                response.on("data", chunk => {
                    progress += chunk.length;
                    process.stdout.write(`Progress: ${(progress / 1e+6).toFixed(2)}mb/${(size / 1e+6).toFixed(2)}mb - ${(progress/ size * 100)}0\r`);
                });
                response.pipe(stream);
            }).on("error", console.log);
        });
    }).on("error", console.log);
}
if (typeof window === "undefined") NodeJS(""); // "window" is always undefined (unless developer defines it) in nodejs but present in most browsers
else {              // psst paste url here^
    // this checks which quality is available then logs the url (pornhub stores download links in these variables)
    if (typeof quality_1080p !== "undefined") console.log(quality_1080p);
    if (typeof quality_720p !== "undefined") console.log(quality_720p);
    if (typeof quality_480p !== "undefined") console.log(quality_480p);
    if (typeof quality_240p !== "undefined") console.log(quality_240p);
}
