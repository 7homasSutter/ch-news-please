# Location Parser

Parses an article from `polizeinews.ch` (or other news portals) to a single (Geo-) location.
This service runs on port `3000`.

The parser uses the the official directories of Swisstopo to analyze if a given word is a town/commune/street.
The directories can be found here:
- Commune Register: https://www.bfs.admin.ch/bfs/en/home/basics/swiss-official-commune-register.html
- Directory of towns and cities: https://www.swisstopo.admin.ch/en/official-directory-of-towns-and-cities
- Street directory: https://www.swisstopo.admin.ch/en/official-street-directory

To load this data into the application, you can
- copy the csv data into the directory /news-location-parser/data and rename the files to `municipalities.csv`, `villages.csv`
and `streets.csv` and call `GET /location/reload` afterward, or
- use the endpoints POST `/location/municipalities`, `/location/villages` and `/location/streets` respectively to upload the files.  

The endpoint `POST /location` analyzes an uploaded article
and returns the most likely location of the event described in the article.
The request requires a JSON body of the form: `{text: <your-article>}`.
The response has the following structure:
```js
{
  "name": string,
  "locationType": "municipalities" | "villages" | "streets",
  "type": "coordinates" | string,
  "value": {east: string, north: string} | string
}
```


