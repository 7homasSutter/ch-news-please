# Location Parser

Parses an article from `polizeinews.ch` (or other news portals) to a single location.
This service runs on port `3000`.

The parser uses the the official directories of Swisstopo to analyze if a given word is a town/commune/street.
The directories can be found here:
- Commune Register: https://www.bfs.admin.ch/bfs/en/home/basics/swiss-official-commune-register.html
- Directory of towns and cities: https://www.swisstopo.admin.ch/en/official-directory-of-towns-and-cities
- Street directory: https://www.swisstopo.admin.ch/en/official-street-directory

To load this data into the application, you can
- copy the csv data into the directory /news-location-parser/data and rename the files to `municipalities.csv`, `villages.csv`
and `streets.csv` and call `GET /location/reload` afterward, or
- use the endpoints POST `/location/municipality`, `/location/villages` and `/location/streets` respectively to upload the files.  

The endpoint `POST /location` allows an article to be uploaded as a JSON document: `{text: <your-article>}`.
the answer has the following structure
```js
{
  "name": string,
  "locationType": "municipalities" | "villages" | "streets",
  "type": "coordinates" | string,
  "value": {east: string, north: string} | string
}
```


