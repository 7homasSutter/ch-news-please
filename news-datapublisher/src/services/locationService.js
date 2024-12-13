import {getByKey} from "./redisService.js";

export async function improveLocation(article) {
    const locations = article.location.split(",").map(location => location.trim())
    const possibleGeolocations = []
    const countries = []

    for (const location of locations) {
        if (countriesGerman.includes(location)) {
            const capital = countryCapitalMap[location]
            if (!capital) {
                continue
            }
            const capitalCoordinates = await getByKey(capital)
            if (capitalCoordinates !== null) {
                countries.push({location: location, geo: capitalCoordinates.position})
            }
        } else {
            const result = await getByKey(location)
            if (result !== null) {
                possibleGeolocations.push({location: location, geo: result.position})
            }
        }
    }

    if (possibleGeolocations.length === 0 && (article.geo === null || article.geo === 'Unknown') && countries.length > 0) {
        article.geo = countries[0].geo
    }
    if (possibleGeolocations.length > 0) {
        article.geo = possibleGeolocations[0].geo
    }
    return article
}

const countriesGerman = [
    "Afghanistan", "Ägypten", "Albanien", "Algerien", "Andorra", "Angola", "Anguilla",
    "Antarktis", "Antigua und Barbuda", "Äquatorial Guinea", "Argentinien", "Armenien",
    "Aruba", "Aserbaidschan", "Äthiopien", "Australien", "Bahamas", "Bahrain", "Bangladesh",
    "Barbados", "Belgien", "Belize", "Benin", "Bermudas", "Bhutan", "Birma", "Bolivien", "Bosnien-Herzegowina",
    "Botswana", "Bouvet Inseln", "Brasilien", "Britisch-Indischer Ozean", "Brunei", "Bulgarien",
    "Burkina Faso", "Burundi", "Chile", "China", "Christmas Island", "Cook Inseln", "Costa Rica",
    "Dänemark", "Deutschland", "Djibuti", "Dominika", "Dominikanische Republik", "Ecuador", "El Salvador",
    "Elfenbeinküste", "Eritrea", "Estland", "Falkland Inseln", "Färöer Inseln", "Fidschi", "Finnland",
    "Frankreich", "französisch Guyana", "Französisch Polynesien", "Französisches Süd-Territorium", "Gabun",
    "Gambia", "Georgien", "Ghana", "Gibraltar", "Grenada", "Griechenland", "Grönland", "Großbritannien",
    "Großbritannien (UK)", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea Bissau", "Guyana", "Haiti",
    "Heard und McDonald Islands", "Honduras", "Hong Kong", "Indien", "Indonesien", "Irak", "Iran", "Irland",
    "Island", "Israel", "Italien", "Jamaika", "Japan", "Jemen", "Jordanien", "Jugoslawien", "Kaiman Inseln",
    "Kambodscha", "Kamerun", "Kanada", "Kap Verde", "Kasachstan", "Kenia", "Kirgisistan", "Kiribati", "Kokosinseln",
    "Kolumbien", "Komoren", "Kongo", "Kongo, Demokratische Republik", "Kroatien", "Kuba", "Kuwait", "Laos", "Lesotho",
    "Lettland", "Libanon", "Liberia", "Libyen", "Liechtenstein", "Litauen", "Luxemburg", "Macao", "Madagaskar",
    "Malawi", "Malaysia", "Malediven", "Mali", "Malta", "Marianen", "Marokko", "Marshall Inseln", "Martinique",
    "Mauretanien", "Mauritius", "Mayotte", "Mazedonien", "Mexiko", "Mikronesien", "Mocambique", "Moldavien",
    "Monaco", "Mongolei", "Montserrat", "Namibia", "Nauru", "Nepal", "Neukaledonien", "Neuseeland", "Nicaragua",
    "Niederlande", "Niederländische Antillen", "Niger", "Nigeria", "Niue", "Nord Korea", "Norfolk Inseln",
    "Norwegen", "Oman", "Österreich", "Pakistan", "Palästina", "Palau", "Panama", "Papua Neuguinea", "Paraguay",
    "Peru", "Philippinen", "Pitcairn", "Polen", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Ruanda", "Rumänien",
    "Russland", "Saint Lucia", "Sambia", "Samoa", "Samoa", "San Marino", "Sao Tome", "Saudi Arabien", "Schweden",
    "Schweiz", "Senegal", "Seychellen", "Sierra Leone", "Singapur", "Slowakei -slowakische Republik-", "Slowenien",
    "Solomon Inseln", "Somalia", "South Georgia, South Sandwich Isl.", "Spanien", "Sri Lanka", "St. Helena",
    "St. Kitts Nevis Anguilla", "St. Pierre und Miquelon", "St. Vincent", "Süd Korea", "Südafrika", "Sudan",
    "Surinam", "Svalbard und Jan Mayen Islands", "Swasiland", "Syrien", "Tadschikistan", "Taiwan", "Tansania",
    "Thailand", "Timor", "Togo", "Tokelau", "Tonga", "Trinidad Tobago", "Tschad", "Tschechische Republik",
    "Tunesien", "Türkei", "Turkmenistan", "Turks und Kaikos Inseln", "Tuvalu", "Uganda", "Ukraine", "Ungarn",
    "Uruguay", "Usbekistan", "Vanuatu", "Vatikan", "Venezuela", "Vereinigte Arabische Emirate",
    "Vereinigte Staaten von Amerika", "Vietnam", "Virgin Island (Brit.)", "Virgin Island (USA)",
    "Wallis et Futuna", "Weissrussland", "Westsahara", "Zentralafrikanische Republik", "Zimbabwe", "Zypern"

]

const countryCapitalMap = {
    "Afghanistan": "Kabul",
    "Albanien": "Tirana",
    "Algerien": "Algiers",
    "Andorra": "Andorra la Vella",
    "Angola": "Luanda",
    "Antigua und Barbuda": "Saint John's",
    "Argentinien": "Buenos Aires",
    "Armenien": "Yerevan",
    "Australien": "Canberra",
    "Österreich": "Vienna",
    "Aserbaidschan": "Baku",
    "Bahamas": "Nassau",
    "Bahrain": "Manama",
    "Bangladesch": "Dhaka",
    "Barbados": "Bridgetown",
    "Belarus": "Minsk",
    "Belgien": "Brussels",
    "Belize": "Belmopan",
    "Benin": "Porto-Novo",
    "Bhutan": "Thimphu",
    "Bolivien": "La Paz",
    "Bosnien und Herzegowina": "Sarajevo",
    "Botswana": "Gaborone",
    "Brasilien": "Brasilia",
    "Brunei": "Bandar Seri Begawan",
    "Bulgarien": "Sofia",
    "Burkina Faso": "Ouagadougou",
    "Burundi": "Gitega",
    "Chile": "Santiago",
    "China": "Beijing",
    "Costa Rica": "San Jose",
    "Dänemark": "Copenhagen",
    "Deutschland": "Berlin",
    "Dominica": "Roseau",
    "Dominikanische Republik": "Santo Domingo",
    "Dschibuti": "Djibouti",
    "Ecuador": "Quito",
    "El Salvador": "San Salvador",
    "Elfenbeinküste": "Yamoussoukro",
    "Eritrea": "Asmara",
    "Estland": "Tallinn",
    "Eswatini": "Mbabane",
    "Fidschi": "Suva",
    "Finnland": "Helsinki",
    "Frankreich": "Paris",
    "Gabun": "Libreville",
    "Gambia": "Banjul",
    "Georgien": "Tbilisi",
    "Ghana": "Accra",
    "Grenada": "Saint George's",
    "Griechenland": "Athens",
    "Guatemala": "Guatemala City",
    "Guinea": "Conakry",
    "Guinea-Bissau": "Bissau",
    "Guyana": "Georgetown",
    "Haiti": "Port-au-Prince",
    "Honduras": "Tegucigalpa",
    "Indien": "New Delhi",
    "Indonesien": "Jakarta",
    "Irak": "Baghdad",
    "Iran": "Tehran",
    "Irland": "Dublin",
    "Island": "Reykjavik",
    "Israel": "Jerusalem",
    "Italien": "Rome",
    "Jamaika": "Kingston",
    "Japan": "Tokyo",
    "Jemen": "Sana'a",
    "Jordanien": "Amman",
    "Kambodscha": "Phnom Penh",
    "Kamerun": "Yaounde",
    "Kanada": "Ottawa",
    "Kap Verde": "Praia",
    "Kasachstan": "Astana",
    "Katar": "Doha",
    "Kenia": "Nairobi",
    "Kirgisistan": "Bishkek",
    "Kiribati": "Tarawa",
    "Kolumbien": "Bogota",
    "Komoren": "Moroni",
    "Kongo, Demokratische Republik": "Kinshasa",
    "Kongo, Republik": "Brazzaville",
    "Nordkorea": "Pyongyang",
    "Südkorea": "Seoul",
    "Kroatien": "Zagreb",
    "Kuba": "Havana",
    "Kuwait": "Kuwait City",
    "Laos": "Vientiane",
    "Lesotho": "Maseru",
    "Lettland": "Riga",
    "Libanon": "Beirut",
    "Liberia": "Monrovia",
    "Libyen": "Tripoli",
    "Liechtenstein": "Vaduz",
    "Litauen": "Vilnius",
    "Luxemburg": "Luxembourg",
    "Madagaskar": "Antananarivo",
    "Malawi": "Lilongwe",
    "Malaysia": "Kuala Lumpur",
    "Malediven": "Male",
    "Mali": "Bamako",
    "Malta": "Valletta",
    "Marokko": "Rabat",
    "Marshallinseln": "Majuro",
    "Mauretanien": "Nouakchott",
    "Mauritius": "Port Louis",
    "Mexiko": "Mexico City",
    "Mikronesien": "Palikir",
    "Moldau": "Chisinau",
    "Monaco": "Monaco",
    "Mongolei": "Ulaanbaatar",
    "Montenegro": "Podgorica",
    "Mosambik": "Maputo",
    "Myanmar": "Naypyidaw",
    "Namibia": "Windhoek",
    "Nauru": "Yaren",
    "Nepal": "Kathmandu",
    "Neuseeland": "Wellington",
    "Nicaragua": "Managua",
    "Niederlande": "Amsterdam",
    "Niger": "Niamey",
    "Nigeria": "Abuja",
    "Nordmazedonien": "Skopje",
    "Norwegen": "Oslo",
    "Oman": "Muscat",
    "Pakistan": "Islamabad",
    "Palästina": "Ramallah",
    "Panama": "Panama City",
    "Papua-Neuguinea": "Port Moresby",
    "Paraguay": "Asuncion",
    "Peru": "Lima",
    "Philippinen": "Manila",
    "Polen": "Warsaw",
    "Portugal": "Lisbon",
    "Ruanda": "Kigali",
    "Rumänien": "Bucharest",
    "Russland": "Moscow",
    "Sambia": "Lusaka",
    "Samoa": "Apia",
    "San Marino": "San Marino",
    "SÃ£o TomÃ© und PrÃ­ncipe": "Sao Tome",
    "Saudi-Arabien": "Riyadh",
    "Schweden": "Stockholm",
    "Schweiz": "Bern",
    "Senegal": "Dakar",
    "Serbien": "Belgrade",
    "Seychellen": "Victoria",
    "Sierra Leone": "Freetown",
    "Simbabwe": "Harare",
    "Singapur": "Singapore",
    "Slowakei": "Bratislava",
    "Slowenien": "Ljubljana",
    "Somalia": "Mogadishu",
    "Spanien": "Madrid",
    "Sri Lanka": "Sri Jayawardenepura Kotte",
    "Südafrika": "Pretoria",
    "Sudan": "Khartoum",
    "Südsudan": "Juba",
    "Suriname": "Paramaribo",
    "Syrien": "Damascus",
    "Tadschikistan": "Dushanbe",
    "Tansania": "Dodoma",
    "Thailand": "Bangkok",
    "Togo": "Lome",
    "Tonga": "Nuku'alofa",
    "Trinidad und Tobago": "Port of Spain",
    "Tschad": "N'Djamena",
    "Tschechien": "Prague",
    "Tunesien": "Tunis",
    "Türkei": "Ankara",
    "Turkmenistan": "Ashgabat",
    "Tuvalu": "Funafuti",
    "Uganda": "Kampala",
    "Ukraine": "Kyiv",
    "Ungarn": "Budapest",
    "Uruguay": "Montevideo",
    "Usbekistan": "Tashkent",
    "Vanuatu": "Port Vila",
    "Vatikanstadt": "Vatican City",
    "Venezuela": "Caracas",
    "Vereinigte Arabische Emirate": "Abu Dhabi",
    "Vereinigte Staaten": "Washington, D.C.",
    "Vietnam": "Hanoi",
    "Zentralafrikanische Republik": "Bangui",
    "Zypern": "Nicosia"
}