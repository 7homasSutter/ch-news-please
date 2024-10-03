# Location Parser

Parses an article from `polizeinews.ch` (or other news portals) to a single location.

## API
more detailed documentation will follow later...

- POST `/location/municipalities`: Add list of municipalities
- POST `/location/villages`: Add list of villages
- POST `/location/streets`: Add list of streets
- POST `/location`: {text: string} Parses given text to a single location
- DELETE `/location`: deletes all saved data; Push lists of municipalities/villages/streets again

## Installation

With docker compose as soon it's dockerized...

Needed directories and env-variables are added in `install.sh` file
