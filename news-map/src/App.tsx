import './index.css'
import Map from "./components/Map.tsx";
import {ArticleSelection} from "./components/ArticleSelection.tsx";
import {MantineProvider} from '@mantine/core';
import {Article} from "./types";
import {useState} from "react";
import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css'
import {ArticeOverlay} from "./components/ArticeOverlay.tsx";


function App() {

    const [articles] = useState<Article[]>([
        {id: "1", text: "An important text", title: "Ja zu Projektänderungen – autoarmer Bahnhofplatz angestrebt", newspaper: "Berner Zeitung", position: [46.94, 7.44]},
        {id: "2", text: "Alle drehen durch und keiner weiss wieso.", title: "Weil es regelrecht Bussen hagelte: Stadt Zürich ändert Regime", newspaper: "srf", position: [47.368, 8.539]},
        {id: "3",text: "Ein, zwei oder dreimal tragen viele ihre Hosen, danach wandern sie gemeinsam mit Shirts, Pullis und Co. in die Wäsche. Charles Bergh, CEO des weltweit erfolgreichsten Jeans-Brand Levi’s, ist entsetzt. Er verriet bereits in diversen Interviews, dass er selbst seine Denim-Hosen so gut wie nie wäscht. 2014 erwähnte er bei einer Konferenz, dass er gerade ein paar Jeans trägt, das er seit einem Jahr besitzt und noch nie gewaschen habe. «Und ich habe noch keine Hautkrankheit bekommen.»\n" +
                "Gegenüber dem Nachrichtensender CNBC ging er 2023 sogar noch weiter und erklärte: «Ich gebe meine Jeans nie in die Waschmaschine.» Einerseits leide das Material darunter. Andererseits benötige die Denim-Industrie ohnehin bereits Unmengen an Wasser, um Baumwolle zu produzieren und zu verarbeiten.\n" +
                "Bergh wäscht die Jeans unter der Dusche\n" +
                "«Damit meine ich aber nicht, dass man seine Jeans nie waschen soll», so Bergh. Er setzt stattdessen auf andere Methoden. «Wenn ich zum Beispiel etwas Curry auf meine Hosen bekomme, reinige ich den Fleck an dieser Stelle einzeln.» Für einen vollen Waschgang wird es besonders interessant: «Wenn meine Jeans richtig eklig werden, etwa weil ich viel geschwitzt habe, wasche ich sie in der Dusche.» Damit meint der Jeans-Boss nicht die Hosen allein. «Ich ziehe sie an und seife meine Beine dann ein.» Die Methode habe er gelernt, als er in jungen Jahren in Hostels unterwegs war und seine Kleidung ohne Waschmaschine säubern musste.\n" +
                "Wie oft wäschst du deine Jeans?\n" +
                "Nach jedem Tragen.Etwa, nachdem ich sie zwei- bis viermal an hatte.Nachdem ich sie zehnmal getragen habe.Nur, wenn sie dreckig sind.Fast gar nicht. Flecken reinige ich einzeln.Ich habe meine Jeans noch nie gewaschen.\n" +
                "Auch der Hersteller rät zu seltenem Waschen\n" +
                "Auf seiner Website rät auch Jeans-Hersteller Levi’s dazu, die Jeans frühestens nach zehnmaligem Tragen zu waschen. Raw Denim Modelle – also bisher ungewaschene, unbehandelte Jeans – sollte man gar nur dreimal im Jahr in die Waschmaschine geben. Wichtig dabei: Die Jeans auf links drehen, kaltes Wasser verwenden und sie anschliessend an der Luft trocknen lassen.\n" +
                "Hast du einen Trick, um deine Jeans lange schön zu halten? Teile ihn in den Kommentaren mit uns!",
            title: "Jeans waschen - so oft sollte sie in die Waschmaschine",
            newspaper: "20min",
            position: [47.05, 8.30]},
        {id: "4", text: "Schon wieder: Wie Anfang September gegen Spanien wird der Schweizer Nationalmannschaft auch gegen Dänemark ein Tor nach einem Eckball aberkannt. Zudem ist beim 1:0 der Spanier bis heute nicht klar, ob der Ball wirklich im Tor war. Frust pur im Schweizer Lager, weil eine gegenteilige Interpretation der drei Szenen ziemlich sicher zu anderen Resultaten geführt hätte. Zu mehr Punkten für die Schweiz. Trotzdem: so weit, so normal.\n" +
                "Doch beim Blick auf die aberkannten Tore wird’s kurios: Beide Male heisst der vermeintliche Torschütze Zeki Amdouni. Beide Male lautet die Begründung des Unparteiischen, die Eckball-Flanke sei zwischenzeitlich hinter der Grundlinie gewesen. Beide Male gibt’s schon beim Anblick der TV-Bilder starke Zweifel an dieser Version. Beide Male tauchen am Tag nach dem Spiel Videos auf, gefilmt ungefähr auf Höhe der Grundlinie, die diese Zweifel nähren.\n" +
                "Im Fall des aberkannten 3:2-Siegtreffers gegen Dänemark führen zudem die Tracking-Daten des Spielballs zum Fazit «Fehlentscheid». Diese Daten erhält der Verband zwei Stunden nach Spielschluss und leitet Teile davon weiter an die ETH zur Visualisierung.\n" +
                "Chaos rund um den VAR muss zu denken geben\n" +
                "An dieser Stelle sei gesagt: Auch die Videos klären die Situation nicht hundertprozentig auf – weil sie dem Vergleich mit der Torlinientechnologie nicht standhalten. Wie oft haben TV-Bilder suggeriert, dass der Ball klar hinter (oder eben nicht) der Linie war – und die Torlinientechnologie belehrte uns eines Besseren? Doch in diesem Fall, beim aberkannten 3:2 von Amdouni, decken die Tracking-Daten den Fehlentscheid auf.\n" +
                "Zu den Linienrichtern, die der Nati vermeintlich geschadet haben, sei gesagt: Sie haben einen Fehler gemacht, nicht mehr und nicht nicht weniger. Viel mehr zu denken geben muss das Chaos rund um den VAR.\n" +
                "Vor Anpfiff am Dienstagabend in St.Gallen läuft ein Uefa-Werbefilm über den Video-Schiedsrichter auf den Stadionscreens. Aussage: Eingegriffen wird in spielentscheidenden Situationen. Diese Voraussetzung erfüllen die zwei aberkannten Tore der Schweizer Nati. Also warum dann kein Eingriff, obwohl der VAR ja da ist?\n" +
                "Erklärung: Bei Nations-League-Spielen in Schweizer Stadien gib’s nur einen «VAR light». Keine kalibrierte Abseitslinie und eben: keine Torlinientechnologie, dank der mittels unzähliger Kameras im Stadion und eines Chips im Ball eine Schwarz-Weiss-Entscheidung, ob der Ball hinter oder noch auf der Linie war, möglich ist.\n" +
                "Tornlinientechnologie ist den Clubs zu teuer\n" +
                "Man kann es absurd finden, dass ausgerechnet bei der essenziellsten Frage des Fussballs, Tor oder kein Tor, auf technische Hilfe verzichtet wird. Der Grund ist simpel: die Kosten. Die Installation der Technik in den Super-League-Stadien würde Millionen kosten.\n" +
                "Genaue Zahlen für die Schweiz gib’s nicht, aber sie dürften ähnlich sein wie in der deutschen Bundesliga, wo in einer Saison für die Torlinientechnologie pro Stadion 135’000 Euro draufgehen. Das ist den Klubs zu teuer.\n" +
                "Aber eben: Das zweifelhafte 1:0 der Spanien. Das nicht gegebene 2:2 gegen Spanien. Und nun das annullierte 3:2 gegen Dänemark. Ohne Fehlentscheide würde die Nati wahrscheinlich nicht gegen den Abstieg, sondern um den Viertelfinaleinzug spielen. Da stellt sich die Frage: Kostet die Knausrigkeit der Super-League-Vereine der Nati den Ligaerhalt?\n" +
                "Hier gib’s den VAR, dort nicht – ein Skandal\n" +
                "Während in anderen Ländern in der Nations League das volle VAR-Paket zum Einsatz kommt, ist es hierzulande also nur die abgespeckte Version. In der Praxis heisst das: Es gab zwar nach beiden aberkannten Toren der Nati eine VAR-Überprüfung. Beide Male war die Überprüfung aber eine reine Alibiübung, weil wegen der fehlenden Torlinientechnologie ein hundertprozentig sicheres Verdikt gar nicht möglich war. Es gab zur Überprüfung nur die TV-Bilder.\n" +
                "Warum der VAR während des Spiels nicht auf die Daten des Chips im Spielball zurückgreifen kann, ist nicht bekannt,. Grundsätzlich gilt: Der VAR kann den Schiedsrichter nur dann korrigieren, wenn er das Gegenteil des ursprünglichen Entscheids beweisen kann.\n" +
                "Vielleicht wird die Nati wegen der zwei aberkannten Tore absteigen. Der Skandal dahinter ist: Innerhalb des gleichen Uefa- Wettbewerbs gelten unterschiedliche Regeln – in Nations-League-Spielen mit Torlinientechnologie im Stadion wird sie angewendet, in anderen nicht.\n" +
                "Murat Yakin reagiert bissig auf die Häufung der Benachteiligungen: «In Zukunft werden die Ecken gegen das Tor geschlagen oder am besten gleich direkt ins Tor. Schliesslich haben die Linienrichter ein ganz besonderes Talent: Das Spiel aus ihrer eigenen Perspektive zu sehen.»",
        title: "Tor von Schweizer Nati aberkannt: Der wahre Skandal ist ein anderer",
        newspaper: "tagblatt.ch",
        position: [46.74, 7.14]}
    ])
    const [activeArticle, setActiveArticle] = useState<Article|undefined>()

    const [visibleArticles, setVisibleArticles] = useState<Article[]>([])

    const onArticleSelected = (article: Article) => {
        setActiveArticle(article)
    }

    const onMarkerSelected = (article: Article) => {
        setActiveArticle(article)
    }


    return (
        <MantineProvider
            //@ts-ignore
            withCSSVariables
            withGlobalStyles
        >
            <div >
                <Map articles={articles} onMapSectionChanged={setVisibleArticles} notifyParentOnMarkerSelection={onMarkerSelected} selectedMarker={activeArticle} />
                <ArticleSelection data={visibleArticles} selectedArticle={activeArticle}  notifyParentOnArticleSelection={onArticleSelected}/>
                <ArticeOverlay defaultArticle={activeArticle} />
            </div>
        </MantineProvider>

    )
}

export default App
