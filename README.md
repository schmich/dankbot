# <img src="http://static-cdn.jtvnw.net/emoticons/v1/28/1.0"/> dankbot

# Setup

- Install [MongoDB](https://www.mongodb.org/downloads)
- Install [NodeJS 0.11.x](http://nodejs.org/dist/v0.11.16/) (or any version with Harmony support)
- `git clone https://github.com/schmich/dankbot`
- `npm install`
- `cp config.js.tmpl config.js`
- Update `config.js`
 - Set Twitch user for bot
 - Set Twitch OAuth token for bot (see [OAuth generator](http://twitchapps.com/tmi/))
 - For song requests, set YouTube API token (see [YouTube Data API](https://developers.google.com/youtube/v3/))
- Edit `dankbot.js`, configure plugins
- Run `npm start <channel name>`

## License

Copyright &copy; 2015 Chris Schmich<br>
CC BY-NC-SA 4.0 License. See [LICENSE](LICENSE) for details.
