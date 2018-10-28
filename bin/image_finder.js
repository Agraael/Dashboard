const request = require('sync-request');

// const apiKey = '10442978-d03382cc64d4c53bf947a8002';
const apiGoogleKey = 'AIzaSyCYjzDHQx8iFYgsqKULhH1EVgydwACEioQ';
const custom_search = '015621217644013161965:lfuho0ku8ve';

const apiYoutubeKey = 'AIzaSyCYjzDHQx8iFYgsqKULhH1EVgydwACEioQ';

let googleImages = [];
let youtubeAvatarImages = [];

google = (search, options) => {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiGoogleKey}&cx=${custom_search}&searchType=image&num=1&${options}&q=` + encodeURIComponent(search);
    let image;

    let find = googleImages.find( elem => elem.search === search);
    if (!find) {
        try {
            let result = request('GET', url, {});
            let json = JSON.parse(result.getBody('utf8'));
            image = json.items[0].link;
            googleImages.push({search : search, url : image});
        } catch (e) {
            image = '/images/image-not-found.png';
        }
    }
    else
        image = find.url;
    return image;
};

youtubeAvatar = (search) => {
    let url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&fields=items%2Fsnippet%2Fthumbnails%2Fdefault&forUsername=${search}&key=${apiYoutubeKey}`;
    let image;

    let find = youtubeAvatarImages.find( elem => elem.search === search);
    if (!find) {
        try {
            let result = request('GET', url, {});
            let json = JSON.parse(result.getBody('utf8'));
            console.log(json);
            console.log('done');
            image = json.items[0].snippet.thumbnails.default.url;
            youtubeAvatarImages.push({search : search, url : image});
        } catch (e) {
            // if (json.code ==  403)
            image = '/images/image-not-found.png';
        }
    }
    else
        image = find.url;
    return image;
};


module.exports = { google , youtubeAvatar};