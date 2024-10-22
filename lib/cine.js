const api = Buffer.from('aHR0cHM6Ly9hcGljaW5lLWFwaS52ZXJjZWwuYXBwLw==', 'base64').toString('utf-8');
module.exports = {
api:'https://apicine-api.vercel.app/',
site:'https://cinesubz.co/',
movie:'movies/',
tvshow:'tvshows/',
episode:'episodes/',
cinesearch:'api/cinesubz/search?q=',
cinetvshow:'api/cinesubz/tvshow?url=',
cinemovie:'api/cinesubz/movie?url=',
cineepisode:'api/cinesubz/episode?url=',
cinedllink:'api/cinesubz/download?url=',
apikey : 'api-key='
}
