/* ===========================================================================
   Data Act Pioneer – Matrix-Heatmap
   DATENDATEI                                        Arbeitsstand: 05.08.2026

   Hier werden alle Inhalte gepflegt. index.html muss dafür nicht angefasst
   werden.

   AUFBAU
     KRITERIEN   – Spalten der Matrix, jeweils mit Definition und Methodik
     KATEGORIEN  – Gruppierung der Zeilen
     FRAGEN      – die Rechtsfragen, jeweils mit Bewertungen

   BEWERTUNGEN
     score       – 1 bis 5, oder null wenn noch nicht bewertet
     konfidenz   – "belegt"     Erhebung dokumentiert
                   "vorlaeufig" erste Einschätzung
                   "offen"      noch nicht bewertet
   =========================================================================== */

const KRITERIEN = [
  {
    id: "haeufigkeit",
    kurz: "Häufigkeit",
    name: "Häufigkeit des Auftretens in der Literatur",
    definition: "Zeigt, wie intensiv sich die bisherige Fachliteratur mit einer Rechtsfrage bereits auseinandergesetzt hat.",
    methodik: "Strukturierte Literaturauszählung mit festgelegtem Suchstring pro Rechtsfrage in den Datenbanken Beck-Online und De Gruyter Brill zu einem einheitlichen Stichtag. Zusätzlich wird erfasst, ob eine Fundstelle die Frage nur beiläufig erwähnt oder eigenständig vertieft behandelt.",
    normierung: "Die Einordnung auf die Skala erfolgt nicht anhand absoluter Trefferzahlen, sondern relativ zur gesamten Fragen-Longlist des Projekts (Perzentilrang). Damit bleibt der Wert unabhängig vom allgemeinen Literaturvolumen zum Data Act vergleichbar.",
    anker: []
  },
  {
    id: "aufwand",
    kurz: "Aufwand",
    name: "Implementierungsaufwand",
    definition: "Bezeichnet den Aufwand, den ein Dateninhaber aufbringen muss, um die jeweilige Rechtsfrage rechtssicher im eigenen Compliance-System umzusetzen – bewertet aus Sicht des regulierten Unternehmens, nicht aus Sicht der Forschung.",
    methodik: "Strukturierte Experteneinschätzung im Delphi-Verfahren anhand einer verankerten Skala.",
    normierung: "",
    anker: [
      { wert:1, text:"reine Dokumentations- oder Nachweispflicht ohne Systemeingriff" },
      { wert:3, text:"Anpassung bestehender Prozesse oder Verträge" },
      { wert:5, text:"grundlegender technischer oder organisatorischer Umbau erforderlich" }
    ]
  },
  {
    id: "streit",
    kurz: "Streitigkeit",
    name: "Grad der rechtlichen Streitigkeit",
    definition: "Erfasst, ob zu einer Rechtsfrage bereits mehrere etablierte, sich widersprechende Positionen in Literatur oder Rechtsprechung existieren.",
    methodik: "Literatur-Coding: Fundstellen werden nach vertretener Position kategorisiert (z. B. Position A, Position B, differenzierende Ansicht).",
    normierung: "Der Wert leitet sich aus der Anzahl ernstzunehmender Gegenpositionen und deren Ausgewogenheit ab – eine annähernd gleich starke Verteilung zweier Lager gilt als streitiger als eine deutlich einseitige Verteilung.",
    anker: []
  },
  {
    id: "unsicherheit",
    kurz: "Unsicherheit",
    name: "Unsicherheit / Forschungslücken",
    definition: "Zeigt Rechtsfragen, zu denen bislang kaum belastbare Aussagen existieren – nicht, weil die Positionen widersprüchlich sind, sondern weil sich noch niemand hinreichend festgelegt hat. Solche Fragen markieren potenzielle Forschungslücken.",
    methodik: "Zweikomponenten-Messung: (1) die allgemeine Literaturdichte zur Frage in Bezug zu Kriterium 1 sowie (2) der Konsolidierungsgrad der vorhandenen Literatur – eingeschätzt danach, ob sich eine herrschende Meinung oder Tendenz erkennen lässt oder die Diskussion vollständig offen ist.",
    normierung: "Beide Komponenten werden zu einem Gesamtwert zusammengeführt.",
    anker: []
  },
  {
    id: "bussgeld",
    kurz: "Bußgeldrisiko",
    name: "Risikopotential (a) – Bußgeldrisiko",
    definition: "Bewertet das Risiko einer behördlichen Sanktion bei unzutreffender Beantwortung der Rechtsfrage. Bei Anwendungsbereichs- bzw. Schwellenfragen bemisst sich das Risiko nicht an der Frage selbst, sondern am Ausmaß der Folgepflichten, die bei einer Fehleinordnung unerwartet greifen würden.",
    methodik: "Verankerte Ratingskala unter Berücksichtigung des einschlägigen Sanktionsrahmens (Art. 40 DA, bei DSGVO-Bezug ergänzend Art. 83 DSGVO) sowie der geschätzten Eingriffsintensität und Kontrollwahrscheinlichkeit.",
    normierung: "",
    anker: [
      { wert:1, text:"kein unmittelbar sanktionsbewehrter Verstoß" },
      { wert:5, text:"hoher Sanktionsrahmen kombiniert mit hoher erwarteter Kontrolldichte" }
    ]
  },
  {
    id: "haftung",
    kurz: "Haftungsrisiko",
    name: "Risikopotential (b) – Haftungsrisiko",
    definition: "Bewertet das Risiko zivilrechtlicher Ansprüche Dritter bei unzutreffender Beantwortung der Rechtsfrage. Bei Schwellenfragen gilt dieselbe Logik wie beim Bußgeldrisiko: bewertet wird das Ausmaß der bei Fehleinordnung ausgelösten zivilrechtlichen Folgepflichten.",
    methodik: "Verankerte Ratingskala unter Berücksichtigung der Dichte und Stärke einschlägiger ziviler Anspruchsgrundlagen (z. B. Art. 82 DSGVO, allgemeines Schadensersatzrecht) sowie des typischen Schadenspotenzials – materiell gegenüber immateriell, übliche Schadenshöhen aus bisheriger Rechtsprechung, soweit vorhanden.",
    normierung: "",
    anker: [
      { wert:1, text:"keine erkennbare eigenständige Anspruchsgrundlage" },
      { wert:5, text:"mehrere parallele Anspruchsgrundlagen mit potenziell hohem Schaden" }
    ]
  }
];

const KATEGORIEN = [
  { id:"allgemein",  name:"Allgemein / Grundsätzliches" },
  { id:"zugang",     name:"Datenzugangsregelungen" },
  { id:"datenarten", name:"Datenarten" },
  { id:"dsgvo",      name:"Data Act vs. DSGVO" },
  { id:"geheimnis",  name:"Geschäftsgeheimnisschutz & TOMs" }
];

const FRAGEN = [

  /* ---------- 1. Allgemein / Grundsätzliches ---------- */
  {
    id: "anwendungsbereich",
    kategorie: "allgemein",
    kurztitel: "Anwendungsbereich (Vernetztes Produkt / Marktort)",
    frage: "Wann fällt ein Unternehmen in den sachlichen und räumlichen Anwendungsbereich des Data Act – insbesondere bei der Einordnung als „vernetztes Produkt“ oder „verbundener Dienst“ und im Hinblick auf die Marktortregelung?",
    normen: "Art. 1 DA · Art. 2 Nr. 5, 6 DA",

    einleitung: [
      "Seit dem 12. September 2025 – dem Geltungsbeginn des Data Act – sehen sich Hersteller vernetzter Produkte vor die Aufgabe gestellt, zu bestimmen, ob und in welchem Umfang sie den Vorgaben der Verordnung unterliegen. Nutzer wiederum stellt sich die spiegelbildliche Frage, ob und inwieweit ihnen die neu eingeräumten Zugangs- und Weitergabeansprüche tatsächlich zugutekommen. Beide Perspektiven treffen sich in einer gemeinsamen Vorfrage: dem Vorliegen eines „vernetzten Produkts“ oder „verbundenen Dienstes“ im Sinne der Legaldefinitionen des Art. 2 Nr. 5, 6 DA. Diese Einordnung bildet die zentrale tatbestandliche Weichenstellung für die Pflichten des Kapitels II und damit für die Anwendbarkeit der Verordnung insgesamt.",
      "Auf den ersten Blick erscheint diese Klassifizierung unproblematisch. Bei näherer Betrachtung erweist sich die Abgrenzung jedoch als deutlich voraussetzungsvoller, als es der Wortlaut zunächst vermuten lässt."
    ],

    abschnitte: [
      {
        titel: "Fällt mein Unternehmen in den sachlichen Anwendungsbereich?",
        absaetze: [
          "Art. 2 Nr. 5 DA definiert ein „vernetztes Produkt“ als einen"
        ],
        zitat: "Gegenstand, der Daten über seine Nutzung oder Umgebung erlangt, generiert oder erhebt und der Produktdaten über einen elektronischen Kommunikationsdienst, eine physische Verbindung oder einen geräteinternen Zugang übermitteln kann und dessen Hauptfunktion nicht die Speicherung, Verarbeitung oder Übertragung von Daten im Namen einer anderen Partei – außer dem Nutzer – ist.",
        nachAbsaetze: [
          "Als vernetzte Produkte kommen ausweislich der Erwägungsgründe grundsätzlich Gegenstände aus sämtlichen Bereichen von Wirtschaft und Gesellschaft in Betracht – von privaten, zivilen und gewerblichen Infrastrukturen über Fahrzeuge, medizinische Ausrüstung und Lifestyle-Produkte bis hin zu Schiffen, Luftfahrzeugen, Haushaltsgeräten und Konsumgütern, Medizin- und Gesundheitsprodukten sowie land- und forstwirtschaftlichen Maschinen und Anlagen (beispielhafte Aufzählung, welche nicht abschließend zu verstehen ist).",
          "Vom sachlichen Anwendungsbereich ausgenommen sind solche Gegenstände, die sich noch im Prototypenstadium befinden.",
          "Ein anschauliches Beispiel ist ein vernetzter Rasenmähroboter, der über eine App gesteuert wird. Geprüft an den einzelnen Tatbestandsmerkmalen des Art. 2 Nr. 5 DA:"
        ],
        punkte: [
          {
            marke: "a)",
            merkmal: "„Gegenstand“",
            text: "Darauf, ob ein „Gegenstand“ beweglich oder unbeweglich ist, kommt es nicht an. Auch private, zivile und gewerbliche „Infrastrukturen“ sowie „Anlagen“ und grundsätzlich auch „Cloud-Infrastrukturen“ kommen als „Gegenstand“ eines vernetzten Produkts nach dem Unionsgesetzgeber zumindest in Betracht. Der Rasenmähroboter ist ein körperlicher, beweglicher Gegenstand; die Grundvoraussetzung ist damit erfüllt."
          },
          {
            marke: "b)",
            merkmal: "„der Daten über seine Nutzung oder Umgebung erlangt, generiert oder erhebt“",
            text: "Der Mähroboter verfügt über Sensoren, die physikalische Größen erfassen: GPS- bzw. Positionssensoren zur Standortbestimmung im Garten, Hinderniserkennungssensoren (z. B. zur Erfassung von Steinen oder Gartenmöbeln), einen Neigungssensor sowie einen Sensor zur Batteriestand- und Motorauslastungsmessung. Diese Daten werden entweder absichtlich aufgezeichnet (z. B. beim Anlegen einer Mähkarte) oder indirekt durch den laufenden Mähbetrieb generiert (z. B. Bewegungsdaten während der Nutzung)."
          },
          {
            marke: "c)",
            merkmal: "„und der Produktdaten über einen elektronischen Kommunikationsdienst, eine physische Verbindung oder einen geräteinternen Zugang übermitteln kann“",
            text: "Der Mähroboter überträgt die erfassten Daten via WLAN oder Bluetooth an eine zugehörige Smartphone-App, über die der Nutzer Mähzeiten einsehen, die Mähfläche anpassen oder den Batteriestatus abrufen kann. Dies erfüllt die Übermittlung über einen elektronischen Kommunikationsdienst."
          },
          {
            marke: "d)",
            merkmal: "„und dessen Hauptfunktion nicht die Speicherung, Verarbeitung oder Übertragung von Daten im Namen einer anderen Partei – außer dem Nutzer – ist“",
            text: "Die Hauptfunktion des Geräts besteht im Mähen des Rasens, nicht in einer Datendienstleistung für Dritte. Die Datenerfassung und -übermittlung ist lediglich funktional der eigentlichen Mähtätigkeit untergeordnet und dient ausschließlich der Steuerung durch den Nutzer selbst, nicht der Verarbeitung von Daten im Auftrag eines externen Dritten."
          }
        ],
        schlussAbsaetze: [
          "Unter dem Begriff des „verbundenen Dienstes“ ist ein digitaler Dienst zu verstehen, der nicht als elektronischer Kommunikationsdienst klassifiziert wird, jedoch so mit einem vernetzten Produkt verbunden ist, dass dessen Funktionen ohne diesen Dienst entweder nicht vollständig nutzbar wären oder der im Nachhinein hinzugefügt wird, um die Funktionen des vernetzten Produkts zu ergänzen, zu aktualisieren oder anzupassen.",
          "Ein Beispiel hierfür ist eine mobile App, die für die vollständige Nutzung eines Wearables, etwa eines Fitness-Trackers, erforderlich ist. Erst durch die App wird der volle Funktionsumfang des Wearables freigeschaltet. Dienste, die keinen Einfluss auf die Funktion des vernetzten Produkts haben und keine Daten oder Befehle des Dienstanbieters an dieses übermitteln, fallen nicht unter den Begriff des verbundenen Dienstes. Auch ergibt sich aus der Legaldefinition (Art. 2 Nr. 6 DA), dass der verbundene Dienst nicht vom Hersteller stammen muss, woraus folgt, dass auch Dritte einen solchen Dienst mit dem Produkt verbinden können."
        ]
      },
      {
        titel: "Räumlicher Anwendungsbereich – Marktortprinzip",
        absaetze: [
          "Das Marktortprinzip in Art. 1 Data Act stellt sicher, dass sich die Anwendbarkeit der Verordnung nicht nach dem Sitz der beteiligten Akteure, sondern nach dem Ort der Nutzung oder Bereitstellung richtet. Entscheidend ist danach, ob vernetzte Produkte, verbundene Dienste oder damit zusammenhängende Daten in der Europäischen Union angeboten oder genutzt werden. Damit unterwirft der Data Act auch außereuropäische Anbieter den europäischen Regeln, sofern ihre Leistungen auf den EU-Markt ausgerichtet sind.",
          "Durch dieses Prinzip wird festgelegt, dass auch Dateninhaber und Anbieter entsprechender Dienste mit Sitz außerhalb der Union, wie etwa in der Schweiz, vom Anwendungsbereich des Data Act erfasst werden, sofern ihre Angebote auf den europäischen Markt abzielen. Offen bleibt jedoch, wessen Handlung für das Inverkehrbringen des Produkts in der EU maßgeblich ist und ob die Pflichten bereits dann Anwendung finden, wenn ein Dritter das Produkt ohne Kenntnis des Herstellers in Verkehr gebracht hat."
        ],
        beispiel: {
          fall: "Ein japanischer Hersteller vernetzter Kaffeemaschinen betreibt einen Online-Shop, der explizit auch Kunden in Deutschland beliefert, Preise in Euro anzeigt und eine deutsche Sprachversion der Website bereithält.",
          loesung: "Weil das Angebot damit gezielt auf den EU-Markt ausgerichtet ist, fällt der Hersteller in den räumlichen Anwendungsbereich des Data Act, unabhängig davon, dass sein Unternehmenssitz in Japan liegt. Maßgeblich ist allein, dass seine vernetzten Produkte in der EU angeboten und genutzt werden."
        }
      }
    ],

    literatur: [
      "Weinhold, Robert / Schröder, Christian: Data Act – (R)Evolution oder vergebene Chance? Mehr Wettbewerb in Bezug auf und besserer Zugang zu Daten, ZD 2024, 306–311.",
      "Pillin, Marie-Sophie: Internationales Privatrecht und Data Act. Grenzüberschreitende Reichweite des Data Act am Beispiel der Datenweitergabevereinbarung, MMR 2026, 188–192.",
      "Rudolph, Matthias / Schlingmann, Sebastian: Was ist ein „vernetztes Produkt“ im Sinne des Data Act? Hilfestellungen zur Auflösung eines Zuordnungs- und Definitionswirrwarrs, MMR 2025, 945–950."
    ],

    bewertungen: {
      haeufigkeit: {
        score: 5, konfidenz: "belegt",
        text: "Die Frage nach dem Vorliegen eines vernetzten Produkts gehört zu den am intensivsten diskutierten Grundsatzfragen des Data Act. Insbesondere die Einordnung nach Art. 2 Nr. 5 DA wird in nahezu jeder Einführung, jedem Praxisleitfaden und jeder vertiefenden Kommentierung zum Data Act zumindest thematisiert, in einem erheblichen Teil der Literatur auch vertieft behandelt. Die Aspekte „verbundener Dienst“ und „Marktortprinzip“ werden demgegenüber seltener eigenständig vertieft, meist im Anschluss an die Produktdefinition mitbehandelt."
      },
      aufwand: {
        score: 2, spanne: "2 oder 3", konfidenz: "vorlaeufig",
        text: "Für Dateninhaber bedeutet die Anwendungsbereichsprüfung in der Regel keine grundlegende technische oder organisatorische Neuausrichtung, wohl aber die Integration eines zusätzlichen Prüfschritts in bestehende Compliance- und Produktfreigabeprozesse. Die Konzeption eines Produkts – und damit letztlich auch die Frage, ob es überhaupt als vernetztes Produkt gilt – liegt dabei zunächst in der unternehmerischen Entscheidungshoheit des Herstellers selbst. Jede neue Produktlinie sowie jede funktionale Erweiterung eines bestehenden Produkts erfordert jedoch eine erneute Einordnung anhand der Tatbestandsmerkmale des Art. 2 Nr. 5, 6 DA.",
        anmerkung: "Das Quelldokument nennt hier keine feste Zahl, sondern eine Spanne. Die Festlegung steht im Team noch aus."
      },
      streit: {
        score: 3, konfidenz: "belegt",
        text: "Ein etablierter Meinungsstreit besteht zur Rechtsnatur der Marktortregelung: Ist Art. 1 Abs. 3 DA als verordnungsautonome einseitige Kollisionsnorm zu verstehen, die den Data Act unabhängig vom gewählten Vertragsstatut zwingend zur Anwendung bringt? Oder ist die Norm mangels expliziter gesetzgeberischer Festlegung lediglich Bestandteil des mitgliedstaatlichen Sachrechts, mit der Folge, dass eine Rechtswahl zugunsten außereuropäischen Rechts die Geltung des Data Act im Einzelfall verdrängen könnte? Für die Einordnung als vernetztes Produkt oder verbundenen Dienst im Übrigen ist demgegenüber kein vergleichbar verfestigter Positionenstreit erkennbar; hier stehen eher offene, noch unbeantwortete Auslegungsfragen im Vordergrund."
      },
      unsicherheit: {
        score: 3, konfidenz: "belegt",
        text: "Mehrere, voneinander unabhängige Aspekte der Anwendungsbereichsbestimmung sind in der Literatur bislang nicht konsolidiert geklärt. Die Definition des vernetzten Produkts verweist über den Begriff der Produktdaten wiederum auf das vernetzte Produkt selbst zurück, was eine in sich verschränkte Begriffsbildung zur Folge hat. Auch die Abgrenzung zwischen verbundenen Diensten und virtuellen Assistenten ist nicht trennscharf möglich, sodass der genaue Anwendungsbereich für Anbieter virtueller Assistenten im Einzelnen unklar bleibt. Für bestimmte Adressaten der Marktortregelung – etwa Anbieter von Anwendungen für intelligente Verträge – verlangt der Wortlaut zudem keinen ausdrücklichen Bezug zur Europäischen Union, ohne dass hierfür eine Begründung ersichtlich ist; ob es sich um ein Redaktionsversehen handelt, ist offen. Schließlich bleibt bei der Marktortregelung unbeantwortet, wessen Handlung für das Inverkehrbringen eines Produkts in der EU maßgeblich ist und ob die Pflichten bereits dann eingreifen, wenn ein Dritter das Produkt ohne Kenntnis des Herstellers in Verkehr gebracht hat."
      },
      bussgeld: {
        score: 4, konfidenz: "belegt",
        text: "Eine fehlerhafte Einordnung als außerhalb des Anwendungsbereichs liegend führt nicht zu einem isolierten Einzelverstoß, sondern zur gleichzeitigen Nichterfüllung sämtlicher Pflichten aus Kapitel II des Data Act. Die Mitgliedstaaten können bei Verstößen gegen die Verpflichtungen aus der Verordnung Sanktionen oder Geldbußen verhängen. Angesichts der Bandbreite der betroffenen Folgepflichten wird das Bußgeldrisiko einer Fehleinordnung trotz aktuell noch im Aufbau befindlicher Kontrollpraxis als hoch eingeschätzt."
      },
      haftung: {
        score: 3, konfidenz: "belegt",
        text: "Der Data Act selbst äußert sich nicht zu den zivilrechtlichen Folgen von Pflichtverletzungen; er regelt in Art. 40 DA ausschließlich die öffentlich-rechtlichen Sanktionsfolgen eines Verstoßes. Zivilrechtliche Ansprüche im Zusammenhang mit einer Fehleinordnung stützen sich daher auf die allgemeinen Erfüllungsansprüche der Nutzer aus Art. 4, 5 DA sowie auf das jeweils anwendbare allgemeine Zivilrecht. Eine eigenständige, speziell auf Anwendungsbereichsfragen zugeschnittene Schadensersatzgrundlage besteht im Data Act nicht, sodass das Haftungsrisiko moderater ausfällt als das Bußgeldrisiko."
      }
    }
  },
  {
    id: "altdaten",
    kategorie: "allgemein",
    kurztitel: "Anwendbarkeit auf Altdaten – Stichtag 12.09.2025",
    frage: "Erfasst der Data Act auch Daten, die von vernetzten Produkten bereits vor dem Geltungsbeginn am 12. September 2025 generiert wurden, oder gilt die Zugangs- und Weitergabepflicht nur für nach diesem Stichtag erzeugte Daten?",
    normen: "Art. 3 Abs. 1 DA · Art. 4, 5 DA",

    einleitung: [
      "Vernetzte Produkte erzeugen ihre Daten häufig schon lange vor dem 12. September 2025, dem Tag, an dem die Zugangs- und Weitergabepflichten des Data Act erstmals zur Anwendung kamen. Ob dieser bereits vorhandene Datenbestand ebenfalls den Pflichten des Data Act unterliegt oder nur künftig erzeugte Daten erfasst sind, stellt sich in der Praxis für nahezu jeden Dateninhaber mit Bestandsprodukten – wird in der Literatur bislang jedoch selten behandelt.",
      "Der Verordnungstext enthält hierzu keine ausdrückliche Regelung. Lediglich für die Konzeptionspflicht nach Art. 3 Abs. 1 DA (Data Access by Design) besteht eine zeitliche Übergangsregelung für neu in Verkehr gebrachte Produkte. Für den davon zu unterscheidenden Bestand bereits vorhandener, „historischer“ Daten – in der Praxis auch als „Data Legacy“ bezeichnet – fehlt eine vergleichbare Klarstellung."
    ],

    abschnitte: [
      {
        titel: "Position der EU-Kommission",
        absaetze: [
          "Die FAQ der EU-Kommission nehmen in Frage 4 („Which data are in scope?“) zu dieser Frage Stellung. Danach unterfallen dem Anwendungsbereich von Kapitel II nur „ohne Weiteres verfügbare Daten“ („readily available data“). Die Kommission stellt zwar klar, dass die Definition dieses Begriffs keinen Bezug zum Zeitpunkt der Datengenerierung enthält, beschränkt den Anwendungsbereich aber dennoch auf Daten, die nach Geltungsbeginn des Data Act generiert oder erhoben wurden. Historische, vor dem 12. September 2025 entstandene Daten fallen nach dieser Lesart nicht in den Anwendungsbereich."
        ]
      },
      {
        titel: "Gegenposition in der Literatur",
        absaetze: [
          "Ein Teil der Literatur folgt dieser Einschätzung nicht. Argumentiert wird, dass der Data Act selbst keine ausdrückliche zeitliche Beschränkung enthält und die ausdrückliche Ausnahme allein für Art. 3 Abs. 1 DA im Umkehrschluss für eine grundsätzliche Anwendbarkeit der übrigen Vorschriften – insbesondere der Zugangs- und Weitergabepflichten der Art. 4, 5 DA – auch auf bereits zuvor erhobene Daten spricht. Zugleich werden die erheblichen praktischen Schwierigkeiten einer solchen weiten Auslegung benannt, etwa die nachträgliche Aufbereitung historischer Datenbestände für Zugangsansprüche. Eine abschließende Festlegung trifft diese Literaturansicht nicht; die Frage bleibt offen und auslegungsbedürftig.",
          "Die FAQ der Kommission sind zudem nicht vollständig konsistent: Während Frage 4 eine klare zeitliche Grenze zieht, enthält Frage 32 zum Datenzugang beim Wechsel des Geräteeigentümers keine entsprechende Einschränkung und spricht allgemein von „data generated by other users before them“, ohne Bezug auf den Stichtag. Dies lässt sich zwar auch so lesen, dass mit „historischen Daten“ in Frage 32 eher Daten früherer Nutzer gemeint sind als vor Geltungsbeginn erzeugte Daten; die sprachliche Uneinheitlichkeit zwischen beiden Antworten zeigt aber, dass auch die Kommission die zeitliche Dimension nicht durchgängig einheitlich behandelt."
        ]
      }
    ],

    fazit: "Eine eindeutige, übereinstimmend vertretene Antwort existiert derzeit nicht. Die FAQ der Kommission sprechen sich in Frage 4 klar gegen eine Anwendung auf Altdaten aus und dürften in der Praxis als erste Richtschnur dienen. Die Literatur zeigt jedoch, dass diese Position nicht zwingend aus dem Verordnungstext folgt und dass sowohl dogmatische Gegenargumente als auch eine gewisse interne Uneinheitlichkeit der FAQ selbst bestehen.",

    empfehlungen: [
      "FAQ als Richtschnur: Bis zur Klärung durch Rechtsprechung an Frage 4 der Kommission orientieren – nur Daten nach dem 12.9.2025 als erfasst behandeln.",
      "Datenbestände zeitlich trennen: Dokumentieren, welche Daten vor bzw. nach dem Stichtag entstanden sind.",
      "Bei Gerätewechsel vorsichtig sein: Frage 32 gibt keine eindeutige zeitliche Grenze vor – nicht automatisch dieselbe Beschränkung wie in Frage 4 annehmen.",
      "Vertraglich klarstellen: Umgang mit historischen Daten in Datenzugangsvereinbarungen ausdrücklich regeln.",
      "Entwicklung beobachten: Rechtsprechung und Literatur weiterverfolgen, bevor Compliance-Prozesse endgültig festgelegt werden."
    ],

    literatur: [
      "Baumgartner / Paal: Data Act und Datenzugang – Ausgestaltung, Grenzen und Durchsetzung, NJW 2026, 1.",
      "Raue, Benjamin, in: Wolff/Brink/v. Ungern-Sternberg (Hrsg.), BeckOK Datenschutzrecht, 54. Edition, Stand: 1.11.2025, DA Art. 4 Rn. 17–22.",
      "Europäische Kommission, Data Act – Questions and Answers, aktuelle Fassung (Version 1.4 v. 22.01.2026), Frage 4 und Frage 32."
    ],

    bewertungen: {
      haeufigkeit: {
        score: 1, konfidenz: "belegt",
        text: "Die Frage nach der zeitlichen Anwendbarkeit des Data Act auf vor dem 12. September 2025 generierte Daten wird in der bisherigen Literatur nur vereinzelt und meist beiläufig behandelt. Während sie in der Praxis für nahezu jeden Dateninhaber mit Bestandsprodukten relevant ist, findet sich bislang keine vertiefte, eigenständige Auseinandersetzung. Die wenigen Stellungnahmen sind vor allem in Kommentierungen und punktuellen Fachbeiträgen zu finden, nicht in eigenständigen Aufsätzen."
      },
      aufwand: {
        score: 2, spanne: "2 bis 3", konfidenz: "vorlaeufig",
        text: "Der Aufwand für Dateninhaber hängt maßgeblich davon ab, welcher der beiden Positionen gefolgt wird. Orientiert sich ein Dateninhaber an der Position der Kommission und beschränkt die Zugangs- und Weitergabepflichten auf nach dem Stichtag generierte Daten, genügt eine organisatorische Kennzeichnung des Entstehungszeitpunkts der jeweiligen Datenbestände; ein überschaubarer Prüf- und Dokumentationsaufwand. Würde hingegen die Gegenposition zutreffen, wonach auch historische Daten erfasst sind, müssten bestehende Datenbestände nachträglich für Zugangsansprüche aufbereitet werden, was einen deutlich höheren, teils grundlegenden technischen und organisatorischen Umbau bestehender Systeme erfordern würde.",
        anmerkung: "Das Quelldokument nennt hier keine feste Zahl, sondern eine Spanne. Die Festlegung steht im Team noch aus."
      },
      streit: {
        score: 2, konfidenz: "belegt",
        text: "Ein etablierter Meinungsstreit mit gefestigten Gegenpositionen besteht bislang nicht. Die FAQ der EU-Kommission vertreten in Frage 4 eine klare Position gegen die Anwendbarkeit auf Altdaten, ohne dass sich in der Literatur eine ebenso gefestigte Gegenmeinung herausgebildet hätte. Die vorhandenen kritischen Stimmen entwickeln zwar dogmatische Gegenargumente, treffen aber ausdrücklich keine abschließende eigene Festlegung, sodass kein echtes Streitverhältnis zwischen zwei etablierten Lagern vorliegt."
      },
      unsicherheit: {
        score: 4, konfidenz: "belegt",
        text: "Die Frage weist eine hohe Unsicherheit auf. Der Verordnungstext selbst enthält keine ausdrückliche zeitliche Regelung; die einzige Klarstellung betrifft die Konzeptionspflicht nach Art. 3 Abs. 1 DA. Die FAQ der Kommission, die als praktische Orientierung dienen, sind zudem in sich nicht konsistent: Während Frage 4 eine klare zeitliche Grenze zieht, verzichtet Frage 32 zum Datenzugang beim Gerätewechsel auf eine entsprechende Einschränkung. Diese interne Uneinheitlichkeit in Kombination mit dem Fehlen einer gefestigten Literaturmeinung macht die Frage zu einer Forschungslücke."
      },
      bussgeld: {
        score: 3, konfidenz: "belegt",
        text: "Orientiert sich ein Dateninhaber an der Position der Kommission und verweigert den Zugang zu vor dem Stichtag generierten Daten, besteht ein moderates Bußgeldrisiko, da eine spätere abweichende Auslegung durch Behörden oder Gerichte nicht ausgeschlossen werden kann. Die Anlehnung an die offizielle FAQ-Position dürfte das Risiko jedoch mindern, da sie als nachvollziehbare Rechtsauffassung gelten kann."
      },
      haftung: {
        score: 3, konfidenz: "belegt",
        text: "Nutzer, denen unter Berufung auf die FAQ-Position der Zugang zu historischen Daten verweigert wird, könnten bei einer künftig abweichenden Auslegung zivilrechtliche Erfüllungsansprüche aus Art. 4, 5 DA geltend machen. Das Risiko bleibt angesichts der offenen Literaturlage und der fehlenden ausdrücklichen Regelung im Verordnungstext bestehen, ist aber durch die Stützung auf die Kommissions-FAQ als anerkannte Praxisorientierung abgemildert."
      }
    }
  },
  {
    id: "kmu-ausnahme",
    kategorie: "allgemein",
    kurztitel: "KMU-Ausnahme (Kapitel II)",
    frage: "Welche Unternehmen sind von den Pflichten des Kapitels II im Data Act befreit?",
    normen: "Art. 7 DA",

    einleitung: [
      "Der Data Act richtet sich in weiten Teilen an Unternehmen jeder Größe. Für kleinere Unternehmen stellt sich daher die Frage, ob und in welchem Umfang sie von den Pflichten befreit sind. Art. 7 DA enthält hierzu eine Ausnahme.",
      "Sie ist allerdings enger gefasst, als der Begriff „KMU-Ausnahme“ vermuten lässt. Nach dem ausgewerteten Material lautet die zutreffende Ausgangsfrage nicht, ob eine Ausnahme greift, sondern welche Pflichten trotz einer möglichen Ausnahme bestehen bleiben."
    ],

    abschnitte: [
      {
        titel: "Reichweite der Ausnahme",
        absaetze: [
          "Der Data Act sieht nach Daum/Laude kaum Ausnahmen für KMU und Start-ups vor. Eine Ausnahme bildet die Einschränkung der Pflichten zur Datenweitergabe von Unternehmen an Verbraucher und zwischen Unternehmen, die nicht für Kleinstunternehmen oder Kleinunternehmen gelten.",
          "Diese Ausnahme ist in zweifacher Hinsicht eng. Zum einen gilt sie nur für Unternehmen mit weniger als 50 Beschäftigten und bis zu 10 Mio. EUR Jahresumsatz oder Bilanzsumme. Zum anderen erfasst sie ausschließlich die Pflichten nach Kapitel II DA. Alle übrigen Regelungen, einschließlich der Vorschriften zum Cloud-Switching in den Art. 23 ff. DA, finden auch für diese Unternehmen uneingeschränkt Anwendung."
        ]
      },
      {
        titel: "Praktische Auswirkung am Beispiel",
        absaetze: [
          "Daum/Laude veranschaulichen die Enge der Ausnahme an einem fiktiven Münchener Start-up. Das Unternehmen beschäftigt 51 Mitarbeiterinnen und Mitarbeiter und erzielt einen Jahresumsatz sowie eine Jahresbilanz von knapp über 10 Mio. EUR. Damit liegt es knapp oberhalb beider Schwellenwerte und fällt aus der Ausnahme heraus.",
          "Selbst unterhalb der Schwellen würde die Ausnahme nur Kapitel II erfassen. Die Cloud-Switching-Pflichten der Art. 23 ff. DA gälten unverändert."
        ]
      },
      {
        titel: "Kritik: Regulierung ohne Größendifferenzierung",
        absaetze: [
          "Nach Daum/Laude können die Bestimmungen des Data Act bestehende Marktstrukturen manifestieren, die gerade aufgebrochen werden sollen. Obwohl der Gesetzgeber in erster Linie Anbieter mit starker Machtposition adressieren wollte, unterliegt ein Start-up im Bereich des Cloud-Switching denselben Pflichten wie ein großer US-amerikanischer Hyperscaler.",
          "Letzterer kann Anpassungen seiner Compliance-Verfahren aufgrund seiner Größe und Verhandlungsmacht leichter umsetzen. Im Ergebnis erleichtert der Data Act damit auch den Wechsel von einem kleinen europäischen Datenverarbeitungsdienst zu einem US-amerikanischen Hyperscaler."
        ]
      },
      {
        titel: "Over-Compliance als Folge",
        absaetze: [
          "Da die Rechtsbegriffe der Digitalrechtsakte vielfach unbestimmt sind und bei Verstoß erhebliche Bußgelder drohen, besteht nach Daum/Laude das Risiko, dass KMU Aufsichtsmaßnahmen fürchten und im Zweifel die Pflichten einer höheren Risikokategorie erfüllen. Dies geschieht nicht zuletzt, um Bedenken von Investoren zu adressieren, und bindet Ressourcen, die andernfalls in die Produktentwicklung fließen würden."
        ]
      }
    ],

    fazit: "Die Ausnahme des Art. 7 DA entlastet nur einen kleinen Kreis von Unternehmen und auch diesen nur teilweise. Sie greift ausschließlich unterhalb enger Schwellenwerte und ausschließlich für Kapitel II. Für die praktisch bedeutsamen Cloud-Switching-Pflichten besteht keine Entlastung. Kleinere Unternehmen sollten daher nicht davon ausgehen, vom Data Act weitgehend befreit zu sein.",

    empfehlungen: [
      "Schwellenwerte prüfen und dokumentieren: Beschäftigtenzahl sowie Jahresumsatz bzw. Bilanzsumme regelmäßig erfassen. Die Werte liegen mit 50 Beschäftigten und 10 Mio. EUR niedrig; ein Wachstumsschritt kann die Ausnahme entfallen lassen.",
      "Nicht auf die Ausnahme verlassen: Auch bei Greifen der Ausnahme bleiben sämtliche Pflichten außerhalb des Kapitels II bestehen, insbesondere die Cloud-Switching-Vorgaben der Art. 23 ff. DA.",
      "Betroffenheit gesondert prüfen: Die Frage der Ausnahme ist von der Frage des Anwendungsbereichs zu trennen. Zunächst ist zu klären, ob überhaupt ein vernetztes Produkt oder verbundener Dienst vorliegt.",
      "Over-Compliance bewusst abwägen: Im Zweifel mehr zu tun als nötig bindet Ressourcen. Eine dokumentierte Einschätzung ist der pauschalen Erfüllung höherer Anforderungen vorzuziehen."
    ],

    literatur: [
      "Daum, Andreas / Laude, Lennart: Europäische Digitalregulierung von KMUs und Start-ups – Regulierte Underdogs, MMR 2026, 301–307, insb. S. 305 f."
    ],

    bewertungen: {
      haeufigkeit: {
        score: 2, konfidenz: "vorlaeufig",
        text: "Die Frage wird in der ausgewerteten Literatur behandelt, aber nicht als eigenständiges Thema vertieft. Daum/Laude behandeln sie im Rahmen einer breiteren Betrachtung der Digitalregulierung für KMU. Eine eigenständige Auseinandersetzung allein mit Art. 7 DA ist im vorliegenden Material nicht enthalten.",
        anmerkung: "Vorschlag ohne Literaturauszählung. Der Wert beruht allein auf der Dichte der ausgewerteten Quellen und ist vor einer Festlegung zu überprüfen."
      },
      aufwand: {
        score: 2, konfidenz: "vorlaeufig",
        text: "Die Prüfung der Schwellenwerte erfordert das Erfassen und Dokumentieren von Beschäftigtenzahl sowie Umsatz oder Bilanzsumme. Ein Eingriff in technische Systeme oder Vertragswerke ist damit nicht verbunden. Nach der verankerten Skala liegt dies im Bereich einer Dokumentations- und Nachweispflicht.",
        anmerkung: "Zu berücksichtigen wäre, dass die Prüfung bei jeder Veränderung der Unternehmensgröße zu wiederholen ist. Ob das eine Einordnung als 3 rechtfertigt, ist im Team abzustimmen."
      },
      streit: {
        score: 1, konfidenz: "vorlaeufig",
        text: "In der ausgewerteten Literatur ist kein Positionenstreit zur Auslegung von Art. 7 DA erkennbar. Die Kritik von Daum/Laude richtet sich gegen die rechtspolitische Ausgestaltung der Ausnahme, nicht gegen ihre Auslegung. Die Schwellenwerte selbst sind im Wortlaut festgelegt."
      },
      unsicherheit: {
        score: 3, konfidenz: "vorlaeufig",
        text: "Der Anwendungsbereich der Ausnahme ist dem Wortlaut nach klar. Offen bleiben nach dem ausgewerteten Material jedoch Anschlussfragen: die genaue Berechnung der Schwellenwerte, das Verhältnis zur KMU-Empfehlung 2003/361/EG sowie die Behandlung eines Überschreitens während eines laufenden Vertragsverhältnisses. Auch die Auswirkungen des Digital Omnibus auf Art. 7 DA selbst sind aus dem Material nicht ersichtlich."
      },
      bussgeld: {
        score: 4, konfidenz: "vorlaeufig",
        text: "Es handelt sich um eine Schwellenfrage. Nach der Projektmethodik bemisst sich das Risiko nicht an der Frage selbst, sondern am Ausmaß der Folgepflichten bei einer Fehleinordnung. Wer sich zu Unrecht auf die Ausnahme beruft, erfüllt sämtliche Pflichten des Kapitels II nicht. Die Bandbreite der betroffenen Folgepflichten spricht für einen hohen Wert."
      },
      haftung: {
        score: 3, konfidenz: "vorlaeufig",
        text: "Bei zu Unrecht angenommener Ausnahme könnten Nutzer Erfüllungsansprüche aus Art. 4, 5 DA geltend machen. Eine eigenständige, speziell auf die KMU-Ausnahme zugeschnittene Anspruchsgrundlage besteht nach dem ausgewerteten Material nicht. Das Haftungsrisiko fällt damit moderater aus als das Bußgeldrisiko.",
        anmerkung: "Ob Erfüllungsansprüche in dieser Konstellation tatsächlich bestehen, wurde nicht anhand einer Quelle geprüft."
      }
    }
  },

  /* ---------- 2. Datenzugangsregelungen ---------- */
  {
    id: "anonymisierung",
    kategorie: "zugang",
    kurztitel: "Flucht in die Anonymisierung",
    frage: "Dürfen Dateninhaber ihre IoT-Systeme bewusst so gestalten, dass eine Zuordnung der erzeugten Daten zu konkreten Nutzern unmöglich wird, um Zugangsansprüche zu vermeiden?",
    normen: "Art. 1 Abs. 5 DA · Art. 4, 5 DA · Art. 2 Nr. 12 DA",
    einleitung: [
      "Eine Datenbereitstellung nach Art. 4, 5 DA setzt voraus, dass die betreffenden Daten einem individuellen Nutzer (Art. 2 Nr. 12 DA) zugeordnet werden können. Gelingt diese Zuordnung nicht mehr, insbesondere infolge einer „absoluten“ Anonymisierung, wird die Erfüllung des Bereitstellungsanspruchs für den Dateninhaber faktisch unmöglich (§ 275 Abs. 1 BGB). Daraus entsteht die praktisch bedeutsame Anschlussfrage, ob Dateninhaber ihre IoT-Systeme gezielt so konzipieren dürfen, dass eine solche Zuordnung von vornherein unterbleibt, um sich den Zugangsansprüchen des Data Act zu entziehen.",
      "Ein Ansatzpunkt liegt dabei bereits vor der eigentlichen Datenerhebung: Da es sich bei IoT-Daten um Rohdaten handelt, wirkt sich die technische Gestaltung der Datengenerierung unmittelbar auf den Umfang der späteren Bereitstellungspflicht aus, denn was das vernetzte Produkt gar nicht erst erzeugt, muss auch nicht herausgegeben werden. Der Dateninhaber kann die Datenerhebung entsprechend so konfigurieren, dass von vornherein keine Personenklardaten anfallen. Bei Metadaten (Art. 2 Nr. 2 DA) ist ein Personenbezug demgegenüber, wie sich aus Erwägungsgrund 16 DA ergibt, eher unwahrscheinlich, wenngleich nicht vollständig ausgeschlossen.",
      "Unklar ist bereits, welche konkreten Anstrengungen ein Dateninhaber bei der Erhebung und Speicherung von Daten unternehmen muss, um eine spätere Zuordnung zu konkreten Nutzern und damit die Durchsetzbarkeit etwaiger Zugangsansprüche überhaupt zu ermöglichen. Eine Antwort lässt sich zumindest für die Grenze dieser Pflicht finden: Art. 1 Abs. 5 DA ordnet den Vorrang des Datenschutzrechts an. Daraus lässt sich ableiten, dass sich der Dateninhaber zwar um eine Zuordnung bemühen muss, diese Pflicht jedoch dort endet, wo eine datenschutzrechtlich vorgeschriebene Anonymisierung eine solche Zuordnung unmöglich macht. Dass der Gesetzgeber dies erkannt hat, zeigt sich an Art. 4 Abs. 5 DA: Die Vorschrift regelt lediglich, welche Informationen der Dateninhaber vom Nutzer nicht verlangen darf."
    ],
    abschnitte: [
      {
        titel: "Zulässigkeit datenschutzrechtlich gebotener Anonymisierung?",
        absaetze: [
          "Eine nach Art. 5 Abs. 1 lit. c DSGVO gebotene Anonymisierung dürfte im Ergebnis keine unzulässige Umgehung der Art. 4, 5 DA darstellen. Der Gesetzgeber selbst erkennt eine Anonymisierung durch den Dateninhaber vielmehr ausdrücklich als gebotenes Mittel zur Einhaltung zwingenden Datenschutzrechts an (vgl. Art. 17 Abs. 1 lit. g, Art. 18 Abs. 4, ErwG 7, 72 DA – dort im Kontext des Datenzugangsverlangens). Der Datenzugangsanspruch bezieht sich ohnehin nur auf Daten, die der Dateninhaber „ohne unverhältnismäßigen Aufwand“ erhält oder erhalten kann. Erst recht kann von ihm nicht verlangt werden, Daten bereitzustellen, die sich faktisch nicht mehr, geschweige denn mit verhältnismäßigem Aufwand, konkreten Nutzern zuordnen lassen.",
          "Darüber hinaus muss dem Dateninhaber eine Anonymisierung auch dann gestattet sein, wenn diese datenschutzrechtlich nicht zwingend, sondern lediglich sinnvoll ist, was angesichts der Grundsätze der Datenminimierung (Art. 5 Abs. 1 lit. c DSGVO) und des Privacy by Design (Art. 25 DSGVO) häufig der Fall sein wird. Dies gilt unabhängig davon, ob die Entscheidung primär im Interesse der betroffenen Personen oder zur Reduzierung eigener datenschutzrechtlicher Risiken getroffen wird, da anonyme Daten der DSGVO ohnehin nicht unterliegen. Auch der Data Act kann den Dateninhaber nicht dazu zwingen, von einer solchen datenschutzfreundlichen Anonymisierung Abstand zu nehmen."
        ]
      },
      {
        titel: "Grenzen: technische und operative Zweckmäßigkeit",
        absaetze: [
          "Der Versuch einer frühzeitigen Anonymisierung, um sich gezielt den Pflichten des Data Act zu entziehen, stößt in der Praxis trotzdem auf Grenzen – auch wenn damit keine rechtlichen Grenzen gemeint sind. Jede Anonymisierung ist mit einem Verlust an Information verbunden. Verzichtet der Dateninhaber frühzeitig und „absolut“ auf jeden Identifier, verliert er damit zugleich die Möglichkeit, die Daten für eigene Zwecke wie Produktverbesserung, Wartung oder Produktsicherheit sinnvoll zu nutzen. Eine rein taktisch motivierte Anonymisierung scheitert damit häufig schon an den eigenen geschäftlichen Interessen des Dateninhabers, bevor überhaupt eine rechtliche Grenze relevant wird."
        ]
      }
    ],
    fazit: "Eine datenschutzrechtlich gebotene oder zumindest sinnvolle Anonymisierung dürfte keine unzulässige Umgehung der Zugangsansprüche aus Art. 4, 5 DA darstellen, da der Gesetzgeber den Vorrang des Datenschutzrechts bewusst nicht durch eine Pflicht zur Herstellung der Nutzerzuordnung durchbrochen hat. Eine rein strategisch motivierte „Flucht in die Anonymisierung“ wird zudem durch die eigenen operativen Interessen des Dateninhabers begrenzt, da anonymisierte Daten für viele eigene Nutzungszwecke an Wert verlieren.",
    empfehlungen: [
      "Anonymisierungsgrund dokumentieren: Festhalten, ob eine Anonymisierung datenschutzrechtlich zwingend geboten, aus Datenminimierungsgründen sinnvoll oder primär strategisch motiviert erfolgt.",
      "Verhältnismäßigkeit prüfen: Anhand Art. 2 Nr. 17 DA einordnen, ob nach der Anonymisierung überhaupt noch „ohne unverhältnismäßigen Aufwand“ zuordenbare Daten vorliegen.",
      "Eigene Nutzungsinteressen abwägen: Vor einer weitgehenden Anonymisierung prüfen, ob dies eigene Zwecke wie Wartung oder Produktsicherheit beeinträchtigt.",
      "Grad der Anonymisierung differenzieren: Zwischen zwingend gebotener und lediglich sinnvoller Anonymisierung unterscheiden, da nur erstere unmittelbar auf Art. 1 Abs. 5 DA gestützt werden kann.",
      "Rechtsprechungsentwicklung beobachten: Da eine ausdrückliche Anti-Umgehungsregelung im Data Act fehlt, könnte künftige Rechtsprechung hierzu engere Grenzen ziehen."
    ],
    literatur: [
      "Bomhard / Zdanowiecki: Datenschutzgetriebene Flucht aus dem Data Act?, RDi 2025, 419 ff.",
      "Baumann / Brunnbauer: Datenschutzrechtliche Anforderungen bei der Bereitstellung von IoT-Daten nach dem Data Act, ZD 2025, 132 ff.",
      "Europäische Kommission: FAQ zum Data Act, 2026, abrufbar unter digital-strategy.ec.europa.eu."
    ],
    bewertungen: {
      haeufigkeit: {
        score: 2,
        konfidenz: "belegt",
        text: "Die Frage wird bislang nur in einem einzigen Fachaufsatz mit nennenswerter dogmatischer Tiefe behandelt; darüber hinaus finden sich allenfalls vereinzelte, kurze Erwähnungen in weiterer Literatur. Anders als bei zentralen Grundsatznormen des Data Act (etwa dem Verhältnis von Art. 3 und Art. 4 DA) handelt es sich damit um eine bislang wenig durchdrungene Randfrage, zu der es an einer breiteren, über mehrere unabhängige Quellen hinweg geführten Diskussion fehlt."
      },
      aufwand: {
        score: 3,
        konfidenz: "belegt",
        text: "Für Dateninhaber besteht der Aufwand zum einen in der technischen Umsetzung einer wirksamen Anonymisierung, die hohen Anforderungen genügen muss, um tatsächlich jede Zuordenbarkeit auszuschließen. Zum anderen erfordert die Differenzierung zwischen zwingend gebotener, lediglich sinnvoller und strategisch motivierter Anonymisierung einen wiederkehrenden Dokumentations- und Abwägungsprozess, insbesondere zur Wahrung der Verhältnismäßigkeit nach Art. 2 Nr. 17 DA. Ein vollständiger technischer Umbau der Produktarchitektur ist damit nicht zwingend verbunden, wohl aber ein nicht unerheblicher Aufwand zur Gestaltung und Dokumentation der jeweiligen Anonymisierungsstrategie."
      },
      streit: {
        score: 3,
        konfidenz: "belegt",
        text: "Zur grundsätzlichen Zulässigkeit einer datenschutzrechtlich gebotenen oder sinnvollen Anonymisierung im Verhältnis zu den Zugangsansprüchen aus Art. 4, 5 DA besteht keine etablierte Gegenposition; die Argumentation stützt sich auf mehrere übereinstimmende gesetzliche Anknüpfungspunkte. Allerdings wird in der Literatur ausdrücklich als umstritten bezeichnet, ob die Anonymisierung selbst eine rechtfertigungsbedürftige Verarbeitung iSd Art. 4 Nr. 2 DSGVO darstellt. Hierbei handelt es sich um einen eigenständigen, benannten Meinungsstreit zu einer vorgelagerten datenschutzrechtlichen Frage.",
        anmerkung: "Der Streit, auf den sich die Bewertung stützt, betrifft eine Vorfrage und wird in der inhaltlichen Darstellung nicht behandelt. Ob ein Streit zu einer Vorfrage den Wert der eigentlichen Rechtsfrage anheben soll, ist im Team zu klären."
      },
      unsicherheit: {
        score: 4,
        konfidenz: "belegt",
        text: "Unsicherheit besteht bei der Frage, welche konkreten Anstrengungen ein Dateninhaber bei der Datenerhebung unternehmen muss, um eine spätere Nutzerzuordnung zu ermöglichen. Ungeklärt ist zudem, wie mit dem Unterschied zwischen „absoluter“ und lediglich „relativer“ Anonymisierung (bei der der Dateninhaber selbst keinen Personenbezug herstellen kann, der Nutzer über zusätzliche Informationen aber durchaus) im Rahmen des Data Act umzugehen ist. Eine ausdrückliche Anti-Umgehungsregelung fehlt im Verordnungstext vollständig."
      },
      bussgeld: {
        score: 3,
        konfidenz: "belegt",
        text: "Wird eine Anonymisierung im Einzelfall als unzulässige Umgehung der Zugangsansprüche gewertet, führt dies zur Nichterfüllung der Art. 4, 5 DA und kann Sanktionen nach Art. 40 DA nach sich ziehen."
      },
      haftung: {
        score: 3,
        konfidenz: "belegt",
        text: "Nutzer, die trotz erfolgter Anonymisierung einen Datenzugang verlangen und die Anonymisierung als rechtsmissbräuchliche Vereitelung ihres Anspruchs ansehen, könnten Erfüllungsansprüche aus Art. 4, 5 DA geltend machen."
      }
    }
  },
  {
    id: "access-by-design",
    kategorie: "zugang",
    kurztitel: "Data Access by Design vs. Datenzugangsanspruch",
    frage: "Wie verhalten sich die Pflicht zu „Data Access by Design“ nach Art. 3 I DA und der eigenständige Datenzugangsanspruch des Nutzers nach Art. 4 I DA zueinander?",
    normen: "Art. 3 I DA · Art. 4 I DA",
    einleitung: [
      "Art. 3 und Art. 4 DA zählen zu den praxisrelevantesten Normen des Data Act, werden aber, obwohl sie eine ähnliche Stoßrichtung verfolgen und von Anwendern teilweise sogar verwechselt werden, konzeptionell grundverschieden ausgestaltet. Art. 3 Abs. 1 DA verpflichtet den Hersteller vernetzter Produkte bzw. den Anbieter verbundener Dienste, seine Angebote nach dem Prinzip „Access-by-Design“ zu konzipieren, also die Produkt- und verbundenen Dienstdaten für den Nutzer direkt zugänglich zu machen; ein individueller Anspruch des Nutzers wird hierdurch nicht begründet. Art. 4 Abs. 1 DA hingegen gewährt dem Nutzer einen eigenständigen, einklagbaren Anspruch auf Bereitstellung der ohne Weiteres verfügbaren Daten gegen den Dateninhaber. Das genaue Verhältnis beider Normen zueinander ist im Verordnungstext nicht geklärt und wird in der Literatur intensiv diskutiert.",
      "Art. 3 Abs. 1 DA gilt nur für vernetzte Produkte und verbundene Dienste, die nach dem 12. September 2026 in Verkehr gebracht werden. Als Beispiele für die direkte Zugänglichmachung nennen die Erwägungsgründe ein Nutzerkonto oder eine bereitgestellte mobile Anwendung (ErwG. 21 DA). Die genaue Reichweite der Pflicht bleibt jedoch unklar, insbesondere im Hinblick auf drei Fragen: Wie weit reicht die Einschränkung „soweit relevant und technisch durchführbar“? Können, müssen oder dürfen im Rahmen von Art. 3 Abs. 1 DA Datenschutzmaßnahmen ergriffen werden? Und inwiefern lässt sich der Schutz von Geschäftsgeheimnissen trotz der Pflicht zur direkten Zugänglichmachung gewährleisten?"
    ],
    abschnitte: [
      {
        titel: "Kernstreitfrage: Das Verhältnis der beiden Normen zueinander",
        absaetze: [
          "Art. 3 Abs. 1 DA verlangt eine direkte Zugänglichmachung „soweit relevant und technisch durchführbar“, während Art. 4 DA nur gelten soll, „soweit der Nutzer nicht direkt vom vernetzten Produkt oder verbundenen Dienst aus auf die Daten zugreifen kann“. Daraus ergibt sich die zentrale Auslegungsfrage, in welchem Verhältnis beide Normen stehen."
        ],
        punkte: [
          {
            marke: "1",
            merkmal: "Echte Subsidiarität von Art. 4 DA",
            text: "Nach dieser Ansicht ist der Datenzugangsanspruch nur der „Plan B“, der greift, wenn kein direkter Zugang über Art. 3 Abs. 1 DA möglich ist. Dafür spricht der Wortlaut des Art. 4 Abs. 1 DA. Dagegen spricht, dass der Datenzugangsanspruch (Art. 4 DA) bei dieser Lesart kaum noch eigenständigen Anwendungsbereich hätte, da Daten, die nicht direkt zugänglich sind, häufig auch nicht „ohne Weiteres verfügbar“ sind."
          },
          {
            marke: "2",
            merkmal: "Anspruchskonkurrenz mit Einrede",
            text: "Danach hat Art. 3 Abs. 1 DA eine vorbereitende, dienende Funktion für Art. 4 DA; der direkte Zugang genießt grundsätzlich Vorrang, und der Datenzugangsanspruch wäre nur noch als Einrede des Dateninhabers zu verstehen, sofern der Nutzer bereits über „Access-by-Design“ Zugang zu allen Daten hat. Gestützt wird dies auf ErwGr. 20 S. 4 DA, wonach Produkte so konzipiert werden müssen, dass Daten zugänglich gemacht werden können. Diese Auffassung bedenkt jedoch einen praktisch naheliegenden Ausnahmefall nicht hinreichend: Verlangt ein Nutzer trotz technisch eingerichtetem Access-by-Design-Zugang zusätzlich Datenbereitstellung nach Art. 4 DA – etwa weil er die Daten in einem anderen Format oder über einen anderen Kanal erhalten möchte oder den Art.-3-Zugang für unvollständig hält –, müsste der Dateninhaber die Einrede erst als Abwehrmittel geltend machen. Insgesamt lässt sich diese Auslegung am Wortlaut, den übrigen Erwägungsgründen und dem Telos des Data Act kaum belastbar festmachen."
          },
          {
            marke: "3",
            merkmal: "Alternativität",
            text: "Diese Ansicht geht davon aus, dass Hersteller von Anfang an frei zwischen beiden Wegen wählen können und beide gleichwertig nebeneinanderstehen. Gestützt wird dies auf die FAQ der EU-Kommission, die beide Optionen als gleichwertig darstellen, auf die Konzeptionshoheit des Herstellers nach ErwGr. 14 DA sowie darauf, dass ein Vorrang von Access-by-Design den Schutz von Geschäftsgeheimnissen und Datenschutzbelangen unterlaufen würde. Häufig wird in diesem Zusammenhang von einem „Wahlrecht“ des Herstellers gesprochen. Genauer betrachtet handelt es sich dabei jedoch nicht um ein Wahlrecht im formalen Sinne: Art. 3 Abs. 1 DA bleibt eine zwingende Pflicht. Der Hersteller entscheidet über die Ausnahme „soweit relevant und technisch durchführbar“ faktisch selbst, ob ein direkter Zugang geboten ist, und legt damit indirekt fest, welche Norm zur Anwendung kommt – ein faktischer Gestaltungsspielraum mit denselben praktischen Konsequenzen wie ein Wahlrecht, aber keine formale Wahlfreiheit zwischen zwei gleichrangigen Anspruchsgrundlagen."
          }
        ]
      }
    ],
    fazit: "Das Verhältnis von Art. 3 und Art. 4 DA ist gesetzlich nicht ausdrücklich geregelt und wird in der Literatur nicht einheitlich beurteilt. Zum aktuellen Zeitpunkt geht die überwiegende Literaturmeinung von einer Alternativität beider Normen aus, wobei der Hersteller über die Konzeption seines Produkts faktisch bestimmt, welcher Weg zur Anwendung kommt.",
    empfehlungen: [
      "Konzeptionsentscheidung dokumentieren: Hersteller sollten festhalten, ob und warum ein direkter Zugang „relevant und technisch durchführbar“ ist bzw. warum nicht – als Nachweis für die eigene Ermessensausübung.",
      "Rollenverteilung klären: Prüfen, ob das eigene Unternehmen als Hersteller, Dateninhaber oder beides auftritt, da sich die Pflichten je nach Fallgruppe unterscheiden.",
      "Vertragliche Absicherung in der Lieferkette: Dateninhaber, die nicht selbst Hersteller sind, sollten den vom Hersteller gewählten Zugangsweg vertraglich festlegen oder zumindest abfragen.",
      "Umsetzungsfristen im Blick behalten: Art. 4 DA gilt bereits seit dem 12.09.2025, Art. 3 Abs. 1 DA erst für ab dem 12.09.2026 in Verkehr gebrachte Produkte.",
      "Geschäftsgeheimnis- und Datenschutzfragen frühzeitig einbeziehen: Unabhängig vom gewählten Weg sollten Schutzmaßnahmen nach Art. 4 Abs. 6-9 DA von Anfang an mitgedacht werden.",
      "Rechtsprechungs- und Literaturentwicklung beobachten: Da auch die genaue Reichweite von „soweit relevant und technisch durchführbar“ ungeklärt ist, sollte die weitere Diskussion verfolgt werden."
    ],
    literatur: [
      "Baumgartner / Paal: Data Act und Datenzugang – Ausgestaltung, Grenzen und Durchsetzung, NJW 2026, 1 ff.",
      "Bomhard / Siglmüller: Das Verhältnis von Access by design und Datenzugangsanspruch nach dem Data Act, RDi 2025, 353 ff.",
      "Europäische Kommission: FAQ Data Act, Version 1.4 vom 22. Januar 2026, abrufbar unter digital-strategy.ec.europa.eu."
    ],
    bewertungen: {
      haeufigkeit: {
        score: 4,
        konfidenz: "belegt",
        text: "Das Verhältnis von Art. 3 und Art. 4 DA gehört zu den am meisten diskutierten Fragen des Data Act. Als praxisrelevanteste Normen der Verordnung werden beide Vorschriften in mehreren Beiträgen vertieft behandelt."
      },
      aufwand: {
        score: 4,
        konfidenz: "belegt",
        text: "Der Aufwand für Dateninhaber hängt maßgeblich davon ab, in welchem Umfang eine technische Umgestaltung des Produkts zur direkten Datenzugänglichmachung erforderlich ist und welche prozessualen Mechanismen zur Bereitstellung von Daten auf Anfrage vorgehalten werden müssen. Eine Umsetzung von Art. 3 Abs. 1 DA erfordert die Konzeption geeigneter Schnittstellen, Nutzerkonten oder Apps für den direkten Datenzugriff und kommt damit einem grundlegenden technischen Umbau nahe. Eine Umsetzung von Art. 4 DA erfordert demgegenüber vor allem einen prozessualen Bereitstellungsmechanismus, der Datenanfragen des Nutzers abwickelt, ohne die Produktarchitektur selbst zu verändern."
      },
      streit: {
        score: 3,
        konfidenz: "belegt",
        text: "Zum Verhältnis von Art. 3 und Art. 4 DA werden in der Literatur drei Auslegungspositionen vertreten (echte Subsidiarität, Anspruchskonkurrenz mit Einrede sowie die Alternativität), die jeweils eigenständig begründet werden. Die Alternativitätsthese wird davon am häufigsten vertreten, ohne dass sich bislang eine gefestigte herrschende Meinung herausgebildet hätte. Auch innerhalb der Alternativitätsthese bleibt jedoch eine dogmatische Nuance ungeklärt: ob es sich um ein echtes Wahlrecht des Herstellers oder lediglich um einen faktischen, über die Ausnahmeregelung vermittelten Gestaltungsspielraum handelt."
      },
      unsicherheit: {
        score: 5,
        konfidenz: "belegt",
        text: "Neben der Grundsatzfrage zum Normverhältnis bestehen mehrere eigenständige offene Punkte: die genaue Reichweite der Einschränkung „soweit relevant und technisch durchführbar“ in Art. 3 Abs. 1 DA, die Frage, ob und wie im Rahmen von Art. 3 Abs. 1 DA Datenschutzmaßnahmen zu berücksichtigen sind, sowie die ungeklärte Übertragbarkeit des Geschäftsgeheimnisschutzes aus Art. 4 Abs. 6-9 DA auf die Konstellation des Art. 3 Abs. 1 DA."
      },
      bussgeld: {
        score: 3,
        konfidenz: "belegt",
        text: "Da dieses Thema zu den zentralen, praktisch am häufigsten einschlägigen Vorschriften des Data Act zählt, wirkt sich eine unzutreffende Einordnung – etwa die irrige Annahme, ein technisch eingerichteter Access-by-Design-Zugang genüge bereits vollständig, oder umgekehrt – unmittelbar auf die Erfüllung zentraler Kapitel-II-Pflichten aus und kann Sanktionen nach Art. 40 DA auslösen."
      },
      haftung: {
        score: 3,
        konfidenz: "belegt",
        text: "Art. 4 DA gewährt dem Nutzer einen ausdrücklich einklagbaren Anspruch auf Datenbereitstellung. Geht ein Dateninhaber fälschlich davon aus, dieser Anspruch sei bereits durch einen Access-by-Design-Zugang nach Art. 3 Abs. 1 DA abgedeckt, oder verweigert er die Bereitstellung unter Verweis auf eine vermeintlich vorrangige Konzeptionsentscheidung des Herstellers, drohen unmittelbar durchsetzbare zivilrechtliche Erfüllungsansprüche des Nutzers."
      }
    }
  },

  /* ---------- 3. Datenarten ---------- */
  {
    id: "abgeleitete-daten",
    kategorie: "datenarten",
    kurztitel: "Produktdaten vs. abgeleitete Daten",
    frage: "Wo verläuft die Grenze zwischen herausgabepflichtigen Produktdaten und den vom Datenzugriff ausgeschlossenen „abgeleiteten oder gefolgerten“ Daten?",
    normen: "Erwägungsgrund 15 DA · Art. 43 DA",

    einleitung: [
      "Der Data Act weist dem Nutzer von IoT-Produkten und verbundenen Diensten in weitem Umfang Rechte an den bei der Nutzung generierten Daten zu. Eine Grenze dieser Rechte betrifft gefolgerte und abgeleitete Daten, die das Ergebnis zusätzlicher Investitionen des Dateninhabers in Wertzuweisungen und Erkenntnisse aus den Produktdaten sind.",
      "Hinsichtlich dieser Daten bleibt es bei einer faktischen Datensouveränität des Dateninhabers. Wöbbeking/Andjic bezeichnen die Grenze deshalb als Dateninvestitionsschutzgrenze. Dahinter steht der Balanceakt zwischen Innovationsförderung durch Nutzerrechte und Wahrung der Investitionsanreize für Dateninhaber."
    ],

    abschnitte: [
      {
        titel: "Der Wortlaut des Ausschlusses",
        absaetze: [
          "Der Ausschluss findet sich nicht im Verordnungstext, sondern in Erwägungsgrund 15 DA. Ausgenommen sind danach gefolgerte oder abgeleitete Informationen, die das Ergebnis zusätzlicher Investitionen in die Zuweisung von Werten oder Erkenntnissen aus den Daten sind.",
          "Dass der Ausschluss nur in den Erwägungsgründen Ausdruck findet, steht seiner Maßgeblichkeit nach Wöbbeking/Andjic nicht entgegen. Er präzisiert den Begriff der vom Data Act erfassten Produktdaten."
        ]
      },
      {
        titel: "Informationen oder Daten?",
        absaetze: [
          "Informationen und Daten sind nicht gleichzusetzen. Daten können digitale Zeichendarstellungen von Nachrichten sein, die durch Interpretation zu semantischen Informationen werden; die Kodierung selbst lässt sich als syntaktische Information bezeichnen. Die Rechte im Data Act knüpfen nach Wöbbeking/Andjic nur an die syntaktische Information an.",
          "Würde sich der Ausschluss auf semantische Informationen beziehen, wäre die Aussage des Erwägungsgrundes Makulatur. Gemeint sein kann daher nur, dass auch die digitale Darstellung dieser Informationen als Daten nicht erfasst sein soll."
        ]
      },
      {
        titel: "Was sicher nicht abgeleitet ist",
        absaetze: [
          "Rohdaten sind mangels Verarbeitung nie abgeleitete Daten.",
          "Aufbereitete Daten sollen nach Wöbbeking/Andjic ebenfalls keine abgeleiteten Daten sein. Verarbeitungen zur Bereinigung oder Transformation, die der einfacheren Weiterverarbeitung und Auffindbarkeit dienen, ändern nichts an der Nutzerzuweisung, selbst bei Daten einer Gruppe verbundener Sensoren. Erwägungsgrund 15 DA verdeutlicht, dass es bei der Aufbereitung insbesondere um die Umrechnung physikalischer Größen geht.",
          "Bemerkenswert ist, dass insoweit selbst wesentliche Investitionen des Dateninhabers nicht zu einem Ausschluss führen."
        ]
      },
      {
        titel: "Wo die Abgrenzung schwierig wird",
        absaetze: [
          "Bei Metadaten und nicht-sensorgenerierten Produktdaten wird die Abgrenzung schwieriger. Wöbbeking/Andjic veranschaulichen dies an einer smarten Gartenberegnungsanlage mit Bodenfeuchtigkeitssensoren. Die Angabe zum Bodenfeuchtigkeitsdefizit ist bloß das Ergebnis eines Soll-Ist-Abgleichs. Die durchschnittliche Bodenfeuchtigkeit eines Tages erfordert ähnlich wenig Rechenaufwand. Für die empfohlene Beregnungsdauer könnte hingegen ein deutlich aufwändigerer Rechenprozess erforderlich sein, der etwa Verdunstungsprozesse berücksichtigt.",
          "Alle drei sind Produktdaten, wenn sie durch eine eingebettete Anwendung gewonnen wurden. Zugleich sind sie das Ergebnis eines Verarbeitungsschritts, der zu einem neuen Wert führt und über eine Aufbereitung hinausgeht, strenggenommen also abgeleitet."
        ]
      },
      {
        titel: "Werden alle abgeleiteten Daten ausgeschlossen?",
        absaetze: [
          "Nimmt man Erwägungsgrund 15 DA wörtlich, kann auch eine simple Berechnung als Ergebnis einer zusätzlichen Investition verstanden werden; eine wesentliche Investition wird nicht gefordert.",
          "Der Erwägungsgrund bezieht sich im Weiteren jedoch insbesondere auf Ableitungen mittels komplexer proprietärer Algorithmen. Als Beispiel wird die Sensorfusion genannt. Auch die EU-Kommission beschreibt abgeleitete Daten in ihren FAQ als „highly enriched“.",
          "Aus dem Gesetzgebungsverfahren ergibt sich nach Wöbbeking/Andjic lediglich, dass der LIBE-Ausschuss vorgeschlagen hatte, aus personenbezogenen Daten abgeleitete Daten dem Nutzer zuzuweisen; durchgesetzt hat sich der Ansatz der Ratspräsidentschaft, abgeleitete Daten auszuschließen."
        ]
      },
      {
        titel: "Systematische Argumente",
        absaetze: [
          "Für einen weiten Ausschluss spricht nach Wöbbeking/Andjic, dass sich selbst bei Daten aus einfachen Verarbeitungen eine Nutzerzuweisung nicht mit dessen Mitwirkung rechtfertigen lässt. Stattdessen nimmt der Dateninhaber durch seine Investition eine eigene Wertschöpfung vor.",
          "Für einen engeren Ausschluss spricht, dass auch andere Grenzen im Data Act restriktiv gehandhabt werden. Der Geheimnisschutz führt nur im Ausnahmefall zu einer echten Begrenzung. Noch markanter: Rechte des Geistigen Eigentums stellen zwar grundsätzlich eine Grenze dar, für das Datenbankherstellerrecht formuliert Art. 43 DA aber eine Ausnahme, obwohl gerade dieses auf Investitionsschutz abstellt.",
          "Daraus folgt zugleich, dass Datenverarbeitungen zur Umgehung von Nutzerrechten dem Ausschluss nicht unterfallen. Würde der Dateninhaber etwa alle Produktdaten mit dem Faktor 2 multiplizieren, sind die Ergebnisse keine abgeleiteten Daten im Sinne des Erwägungsgrundes 15 DA."
        ]
      },
      {
        titel: "Blick in das übrige Datenrecht",
        absaetze: [
          "Aufschlussreich ist die DSGVO: Abgeleitete Daten unterliegen zwar dem Auskunftsrecht nach Art. 15 DSGVO, mangels Bereitstellung durch den Betroffenen aber nicht dem Recht auf Datenübertragbarkeit nach Art. 20 DSGVO, etwa Creditscores oder Profilingdaten. Der genaue Ausschlussumfang ist dort nach Wöbbeking/Andjic jedoch hoch umstritten und bisher nicht höchstrichterlich geklärt. Die DSGVO bietet damit sogar weniger Anhaltspunkte als der Data Act."
        ]
      },
      {
        titel: "Immaterialgüterrechtliche Begründungstheorien",
        absaetze: [
          "Wöbbeking/Andjic prüfen, ob die Begründungstheorien des Geistigen Eigentums die Grenze bestimmen können. Das Ergebnis ist widersprüchlich: Die Eigentumstheorie würde alle abgeleiteten Daten dem Dateninhaber zuweisen, die Offenbarungstheorie spricht für einen engen Ausschluss.",
          "Am ehesten trägt nach ihrer Einschätzung ein Vergleich mit Leistungsschutzrechten wie dem Datenbankherstellerrecht, die an Investitionen anknüpfen, dabei aber nicht jede Investition genügen lassen, sondern eine Wesentlichkeit fordern."
        ]
      }
    ],

    fazit: "Der Data Act beantwortet nicht ausdrücklich, wie weit der Ausschluss reicht. Nach Wöbbeking/Andjic sprechen Auslegung, übriges Datenrecht und die immaterialgüterrechtlichen Begründungstheorien dafür, den Ausschluss enger zu verstehen, als der Wortlaut des Erwägungsgrundes 15 DA vermuten lässt. Als Kriterium schlagen sie vor, dass der Ausschluss nur solche Daten erfassen sollte, die das Ergebnis einer Ableitung sind, die der Nutzer allein aus den sonstigen Produktdaten nicht hätte vornehmen können. Nur eine qualitativ wesentliche Investition rechtfertige den Ausschluss. Ausgeschlossen wären danach aggregierte Daten aus verschiedenen IoT-Produkten, Sensorfusion mittels komplexer proprietärer Algorithmen sowie alle Daten, die selbst ein datenverarbeitungsversierter Nutzer mangels zur Verfügung stehender Informationen nicht hätte ableiten können.",

    empfehlungen: [
      "Nicht pauschal auf den Ausschluss berufen: Rohdaten und aufbereitete Daten sind nach dem ausgewerteten Material nie ausgeschlossen, auch dann nicht, wenn ihre Aufbereitung erheblichen Aufwand erfordert hat.",
      "Maßstab anlegen: Maßgeblich ist nach Wöbbeking/Andjic, ob der Nutzer die Verarbeitung mit den ihm zugänglichen Daten selbst hätte vornehmen können. Wo eigene Erkenntnisse, Erfahrungswerte oder Sollwerte des Dateninhabers einfließen, liegt ein Ausschluss näher.",
      "Verarbeitungsschritte dokumentieren: Welche Daten entstehen aus welchem Verarbeitungsschritt, und welche Informationen fließen dabei ein, die nicht aus den Produktdaten stammen? Diese Dokumentation ist die Grundlage jeder späteren Argumentation.",
      "Keine Umgehungsgestaltung: Verarbeitungen, die allein der Umgehung von Nutzerrechten dienen, unterfallen dem Ausschluss nicht.",
      "Nutzungsvertrag mitdenken: Die Nutzung erfasster Daten durch den Dateninhaber setzt nach dem ausgewerteten Material einen Vertrag mit dem Nutzer voraus, der mit dem Vertrag über das vernetzte Produkt verbunden werden kann."
    ],

    literatur: [
      "Wöbbeking, Maren K. / Andjic, Marko: Europäische Dateninvestitionsschutzgrenze – Datenrechte im Spannungsfeld von Innovation und Investition, GRUR 2026, 204–211."
    ],

    bewertungen: {
      haeufigkeit: {
        score: 4, konfidenz: "vorlaeufig",
        text: "Wöbbeking/Andjic widmen der Abgrenzung einen vollständigen Aufsatz, was für eine eigenständige Vertiefung spricht. Auch in den Projektunterlagen zu den Datenarten wird die Frage als zentral behandelt und mit Schreiber/Pommerening/Schoel belegt.",
        anmerkung: "Vorschlag ohne Literaturauszählung. Der Wert beruht auf der Dichte der ausgewerteten Quellen und ist vor einer Festlegung zu überprüfen."
      },
      aufwand: {
        score: 3, konfidenz: "vorlaeufig",
        text: "Die Abgrenzung erfordert eine Dokumentation sämtlicher Verarbeitungsschritte sowie der dabei einfließenden Informationen, die nicht aus den Produktdaten stammen. Das betrifft bestehende Prozesse der Datenverarbeitung und geht damit über eine reine Nachweispflicht hinaus."
      },
      streit: {
        score: 3, konfidenz: "vorlaeufig",
        text: "Wöbbeking/Andjic stellen zwei Auslegungsrichtungen gegenüber, einen weiten und einen engen Ausschluss, und argumentieren für die engere. Sie führen für beide Seiten systematische Gründe an. Ob sich daraus bereits etablierte Lager ergeben, lässt sich aus dem vorliegenden Material nicht abschließend beurteilen.",
        anmerkung: "Die Einordnung als 3 unterstellt, dass beide Positionen vertreten werden. Ob die weite Auslegung tatsächlich Anhänger hat, wäre über Literatur-Coding zu prüfen."
      },
      unsicherheit: {
        score: 4, konfidenz: "vorlaeufig",
        text: "Wöbbeking/Andjic stellen ausdrücklich fest, dass der Data Act die Frage nicht ausdrücklich beantwortet. Auch das übrige Datenrecht ermöglicht nach ihrer Darstellung keine abschließende Bestimmung; zur DSGVO bemerken sie, dass der dortige Ausschlussumfang hoch umstritten und nicht höchstrichterlich geklärt ist. Ein Abgrenzungskriterium wird vorgeschlagen, ist aber noch nicht gefestigt."
      },
      bussgeld: {
        score: 3, konfidenz: "vorlaeufig",
        text: "Eine zu weite Berufung auf den Ausschluss kommt einer Verweigerung der Datenbereitstellung gleich und wäre damit sanktionsbewehrt. Anders als bei einer Fehleinordnung im Anwendungsbereich betrifft dies jedoch nur einzelne Datenkategorien, nicht den gesamten Pflichtenkatalog.",
        anmerkung: "Der Sanktionsrahmen wurde nicht anhand einer Quelle geprüft."
      },
      haftung: {
        score: 3, konfidenz: "vorlaeufig",
        text: "Bei zu Unrecht angenommenem Ausschluss könnten Nutzer Erfüllungsansprüche geltend machen. Eine eigenständige Anspruchsgrundlage für diese Konstellation ist im ausgewerteten Material nicht ersichtlich.",
        anmerkung: "Nicht anhand einer Quelle geprüft."
      }
    }
  },
  {
    id: "mischdatensaetze",
    kategorie: "datenarten",
    kurztitel: "Mischdatensätze – personenbezogen / nicht-personenbezogen",
    frage: "Wie ist bei Datensätzen, die personenbezogene und nicht-personenbezogene Daten miteinander vermengen, die Grenze zwischen der Anwendbarkeit des Data Act und der DSGVO zu ziehen?",
    normen: "Art. 1 Abs. 5 DA · Art. 2 Nr. 3, 4 DA",
    einleitung: [
      "Der Data Act erfasst personenbezogene wie nicht-personenbezogene Daten; für die Definition personenbezogener Daten verweist er auf die DSGVO, und beide Rechtsakte gelten parallel. Nach Art. 1 Abs. 5 S. 1 DA gilt der Data Act „unbeschadet“ des Datenschutzrechts; im Konfliktfall hat das Datenschutzrecht nach Art. 1 Abs. 5 S. 3 DA ausdrücklich Vorrang.",
      "Praktisch bedeutsam wird die Abgrenzung, weil vernetzte Produkte häufig Datensätze erzeugen, in denen beide Arten von Daten zusammentreffen – etwa technische Messwerte neben Angaben, die Rückschlüsse auf die Person zulassen, die das Produkt bedient. Für den Dateninhaber stellt sich dann die Frage, welche Bestandteile welchem Regime unterliegen."
    ],
    abschnitte: [
      {
        titel: "Einordnung auf Ebene des einzelnen Datums",
        absaetze: [
          "Nach BeckOK/Schild ist ein Datum entweder personenbezogen oder nicht-personenbezogen; ein Dazwischen gibt es nicht. Die Einordnung knüpft damit nicht an den Datensatz als Ganzes an, sondern an seine einzelnen Bestandteile.",
          "Zugleich können Maschinendaten, die zunächst als reine Sachdaten erscheinen, durch Verknüpfung mit weiteren Informationen – etwa einem Schichtplan oder einer Zulassungsbescheinigung – Personenbezug erhalten und damit datenschutzrechtlich relevant werden (BeckOK/Schild). Ob ein Bestandteil personenbezogen ist, hängt also nicht allein vom Datum selbst ab, sondern auch davon, womit es verknüpft werden kann."
        ]
      },
      {
        titel: "Die Grenze ist relativ zur verarbeitenden Stelle",
        absaetze: [
          "Der Digital-Omnibus-Vorschlag präzisiert nach Dose/Pühl die Definition personenbezogener Daten in Art. 4 Nr. 1 DSGVO. Mit Verweis auf die Rechtsprechung des EuGH wird herausgestellt, dass für die Eröffnung des Anwendungsbereichs der DSGVO von den verfügbaren Mitteln aus Perspektive der verarbeitenden Stelle auszugehen ist. Mit diesem Prinzip des relativen Personenbezugs können pseudonymisierte Daten für andere Stellen als anonymisiert und damit außerhalb des Anwendungsbereichs der DSGVO verarbeitet werden.",
          "Zur Unterstützung der Anwendungspraxis soll die EU-Kommission nach Art. 41a DS-GVO-E ermächtigt werden, in Durchführungsrechtsakten Kriterien festzulegen, wann einer Pseudonymisierung anonymisierende Wirkung zukommt (Dose/Pühl).",
          "Für gemischte Datensätze folgt daraus, dass dieselben Bestandteile für den Dateninhaber nicht-personenbezogen, für einen Nutzer oder Dritten mit Zusatzwissen aber personenbezogen sein können. Die Grenze zwischen Data Act und DSGVO verläuft dann nicht einheitlich durch den Datensatz, sondern kann je nach Akteur unterschiedlich liegen."
        ]
      },
      {
        titel: "Verschiebung der Grenze durch die Rechtsprechung",
        absaetze: [
          "Wendehorst weist darauf hin, dass die SRB-Entscheidung des EuGH den Kreis der „nicht-personenbezogenen“ Daten für den Dateninhaber merklich erweitert hat. Sie sieht darin eine gesteigerte Brisanz der Regelung, dass nicht-personenbezogene Produktdaten und verbundene Dienstdaten vom Dateninhaber nur noch verwendet werden dürfen, soweit es ein Vertrag mit dem Nutzer gestattet."
        ]
      },
      {
        titel: "Unterschiedliche Regime innerhalb eines Datensatzes",
        absaetze: [
          "Nach Wendehorst soll der Dateninhaber zur Nutzung nicht-personenbezogener Daten nur noch berechtigt sein, wenn dies nach einem Vertrag mit dem Nutzer gestattet ist, während es hinsichtlich der Nutzung personenbezogener Daten bei der Geltung der DSGVO bleibt.",
          "Für einen gemischten Datensatz bedeutet das, dass der Dateninhaber für ein und denselben Datensatz zwei Maßstäbe anlegen muss: für die nicht-personenbezogenen Bestandteile die vertragliche Gestattung nach dem Data Act, für die personenbezogenen Bestandteile eine Rechtsgrundlage nach der DSGVO."
        ]
      },
      {
        titel: "Trennung in den Musterklauseln",
        absaetze: [
          "Die Mustervertragsklauseln der Kommission setzen eine Trennung voraus. Nach Denga verlangt Klausel 2 im Verhältnis zwischen Dateninhaber und Nutzer die Spezifizierung der erfassten Produkt- und Dienstdaten in Appendix 1, und zwar unter Unterscheidung zwischen personenbezogenen und nicht-personenbezogenen Daten.",
          "Bei den Vergütungsklauseln fehlt diese Differenzierung dagegen. Der Europäische Datenschutzausschuss hatte gefordert, Vergütungsklauseln auf nicht-personenbezogene Daten zu beschränken, da personenbezogene Daten keine handelbare Ware darstellen sollten; die Musterklauseln lassen eine solche Differenzierung nach Denga vermissen."
        ]
      },
      {
        titel: "Anhaltspunkt aus der Free-Flow-Verordnung",
        absaetze: [
          "Eine ausdrückliche Regel für gemischte Datensätze enthält Art. 2 Abs. 2 der Verordnung (EU) 2018/1807 über den freien Verkehr nicht-personenbezogener Daten: Bei einem Datensatz, der aus personenbezogenen und nicht-personenbezogenen Daten besteht, gilt diese Verordnung für die nicht-personenbezogenen Daten des Datensatzes. Sind beide Arten in einem Datensatz untrennbar miteinander verbunden, berührt die Verordnung nicht die Anwendung der DSGVO.",
          "Nach Dose/Pühl soll die Free-Flow-Verordnung durch den Digital Omnibus in den Data Act überführt werden. Ob die Regel zu gemischten Datensätzen dabei übernommen wird und damit unmittelbar für den Data Act Bedeutung erlangt, ergibt sich aus der ausgewerteten Quelle nicht."
        ]
      }
    ],
    fazit: "Nach dem ausgewerteten Material wird die Grenze nicht auf Ebene des Datensatzes gezogen, sondern auf Ebene des einzelnen Datums – ein Datum ist entweder personenbezogen oder nicht. Der Data Act erfasst beide Arten; für die personenbezogenen Bestandteile gilt die DSGVO zusätzlich und hat im Konfliktfall Vorrang. Schwierig wird die Abgrenzung dadurch, dass sie nicht feststeht: Personenbezug kann durch Verknüpfung entstehen, er ist nach dem Digital-Omnibus-Vorschlag relativ zur verarbeitenden Stelle zu bestimmen, und die Rechtsprechung hat den Kreis der nicht-personenbezogenen Daten erweitert. Dieselben Bestandteile eines Datensatzes können deshalb für verschiedene Akteure unterschiedlich einzuordnen sein. Wie mit Bestandteilen umzugehen ist, die sich nicht trennen lassen, beantworten die ausgewerteten Quellen zum Data Act nicht; eine Regel hierfür enthält die Free-Flow-Verordnung, deren Überführung in den Data Act geplant ist.",
    empfehlungen: [
      "Auf Datumsebene klassifizieren: Datensätze nicht als Ganzes einordnen, sondern ihre Bestandteile einzeln danach bestimmen, ob sie personenbezogen sind.",
      "Verknüpfungsmöglichkeiten erfassen: Prüfen, mit welchen weiteren Informationen – etwa Schichtplänen oder Zulassungsdaten – technische Daten einer Person zugeordnet werden können.",
      "Einordnung nach Empfänger prüfen: Da der Personenbezug relativ zur verarbeitenden Stelle zu bestimmen ist, sollte vor einer Weitergabe geprüft werden, welches Zusatzwissen beim Nutzer oder Dritten vorhanden ist.",
      "Trennung vertraglich abbilden: Die Unterscheidung zwischen personenbezogenen und nicht-personenbezogenen Daten in Appendix 1 der Musterklauseln nutzen.",
      "Eigene Nutzung doppelt absichern: Für nicht-personenbezogene Bestandteile eine vertragliche Gestattung nach dem Data Act, für personenbezogene Bestandteile eine Rechtsgrundlage nach der DSGVO vorhalten.",
      "Bei untrennbarer Verbindung vorsichtig bleiben: Lassen sich die Bestandteile nicht trennen, spricht der Vorrang des Datenschutzrechts nach Art. 1 Abs. 5 DA dafür, die Anforderungen der DSGVO für den gesamten Datensatz zu beachten.",
      "Entwicklung beobachten: Die angekündigten Durchführungsrechtsakte zur Pseudonymisierung und die Überführung der Free-Flow-Verordnung können die Grenze weiter verschieben."
    ],
    literatur: [
      "Dose, Michael / Pühl, Florian: Implikationen des Digital-Omnibus für das Datenwirtschaftsrecht, RDi 2026, 122–127, insb. Rn. 4, 14 f.",
      "Wendehorst, Christiane: Zweifel an der Primärrechtskonformität des Data Act – löst der Digitale Omnibus die Probleme?, NJW 2026, 291–296, insb. Rn. 6, 30.",
      "Denga, Michael: Die Musterklauseln für den Data Act, RDi 2026, 181–189, insb. Rn. 15, 50, 55.",
      "BeckOK Datenschutzrecht/Schild, DA Art. 2 Rn. 23–28.",
      "Verordnung (EU) 2018/1807 über einen Rahmen für den freien Verkehr nicht-personenbezogener Daten in der Europäischen Union, Art. 2 Abs. 2."
    ],
    bewertungen: {
      haeufigkeit: {
        score: 2,
        konfidenz: "vorlaeufig",
        text: "Das Verhältnis von Data Act und DSGVO wird in der ausgewerteten Literatur vielfach behandelt. Die konkrete Frage, wie gemischte Datensätze abzugrenzen sind, behandelt jedoch keine der ausgewerteten Quellen eigenständig; die Aussagen, auf denen die Ausarbeitung beruht, stehen jeweils in anderem Zusammenhang.",
        anmerkung: "Vorschlag ohne Literaturauszählung. Die Einordnung folgt der Bewertung vergleichbarer Schnittstellenfragen zur DSGVO in dieser Matrix."
      },
      aufwand: {
        score: 3,
        konfidenz: "vorlaeufig",
        text: "Erforderlich ist die Klassifizierung von Datensätzen auf Ebene einzelner Bestandteile, die Prüfung von Verknüpfungsmöglichkeiten sowie eine Einordnung, die je nach Empfänger unterschiedlich ausfallen kann. Das betrifft bestehende Prozesse und Verträge, erfordert aber nicht zwingend einen Umbau der Produktarchitektur."
      },
      streit: {
        score: 2,
        konfidenz: "vorlaeufig",
        text: "In den ausgewerteten Quellen sind keine gegensätzlichen Positionen zur Abgrenzung gemischter Datensätze erkennbar. Die Frage ist eher offen als umstritten.",
        anmerkung: "Die Einordnung als 2 statt 1 folgt der Bewertung vergleichbarer Fragen ohne erkennbaren Positionenstreit in dieser Matrix."
      },
      unsicherheit: {
        score: 4,
        konfidenz: "vorlaeufig",
        text: "Keine der ausgewerteten Quellen zum Data Act beantwortet, wie mit untrennbar verbundenen Bestandteilen umzugehen ist. Hinzu kommt, dass die Grenze selbst in Bewegung ist: Der relative Personenbezug ist Teil eines noch nicht verabschiedeten Vorschlags, die angekündigten Durchführungsrechtsakte stehen aus, und die Rechtsprechung hat den Kreis der nicht-personenbezogenen Daten nach Wendehorst bereits erweitert.",
        anmerkung: "Auch ein Wert von 5 wäre vertretbar. Gegen die Höchststufe spricht, dass Teilantworten vorliegen – Einordnung auf Datumsebene, Vorrang des Datenschutzrechts."
      },
      bussgeld: {
        score: 4,
        konfidenz: "vorlaeufig",
        text: "Eine Fehleinordnung kann in beide Richtungen sanktionsbewehrt sein: Werden personenbezogene Bestandteile ohne Rechtsgrundlage weitergegeben, liegt ein Verstoß gegen die DSGVO vor; werden nicht-personenbezogene Bestandteile zu Unrecht zurückgehalten, eine Nichterfüllung der Bereitstellungspflicht nach dem Data Act.",
        anmerkung: "Die Sanktionsrahmen wurden nicht anhand einer Quelle geprüft."
      },
      haftung: {
        score: 4,
        konfidenz: "vorlaeufig",
        text: "Für personenbezogene Bestandteile kommen bei unzulässiger Weitergabe Schadensersatzansprüche der betroffenen Personen in Betracht, für nicht-personenbezogene Bestandteile bei unberechtigter Zurückhaltung Erfüllungsansprüche des Nutzers. Das Risiko besteht damit gegenüber zwei unterschiedlichen Gläubigergruppen.",
        anmerkung: "Die Anspruchsgrundlagen wurden nicht anhand einer Quelle geprüft; die Einordnung folgt der Bewertung vergleichbarer Schnittstellenfragen in dieser Matrix."
      }
    }
  },

  /* ---------- 4. Data Act vs. DSGVO ---------- */
  {
    id: "rechtsgrundlage-drittdaten",
    kategorie: "dsgvo",
    kurztitel: "DSGVO-Rechtsgrundlage bei Drittdaten",
    frage: "Stellt der Data Act selbst eine datenschutzrechtliche Rechtsgrundlage (insb. als rechtliche Verpflichtung nach Art. 6 I 1 lit. c DS-GVO) für die Weitergabe der Daten von unbeteiligten Dritten dar?",
    normen: "Art. 4 Abs. 12 DA · Art. 5 Abs. 7 DA · Art. 6 Abs. 1 lit. c DSGVO",
    einleitung: [
      "Zwischen Data Act und Datenschutzrecht besteht ein strukturelles Spannungsverhältnis: Während die DSGVO auf eine Minimierung der Verarbeitung personenbezogener Daten ausgerichtet ist, zielt der Data Act in seinem Kapitel II gerade auf eine möglichst umfassende Offenlegung der durch vernetzte Produkte generierten Daten an Nutzer und von diesen bestimmte Dritte ab. Art. 1 Abs. 5 S. 1 DA ordnet an, dass der Data Act „unbeschadet“ des Datenschutzrechts gilt; im Konfliktfall hat das Datenschutzrecht nach Art. 1 Abs. 5 S. 3 DA ausdrücklich Vorrang.",
      "Innerhalb des Data Act lassen sich mehrere Themenkomplexe mit datenschutzrechtlichem Bezug identifizieren. Einer davon betrifft die relevanten Verarbeitungsszenarien und deren Rechtfertigung: Da jede Verarbeitung personenbezogener Daten einer Rechtfertigung nach Art. 6 ff. DSGVO bedarf, ist die Bestimmung des jeweils vorliegenden Verarbeitungsszenarios eine notwendige Vorfrage. Zunächst lohnt sich daher ein Blick auf den datenschutzrechtlichen Verarbeitungsbegriff selbst: Nach Art. 4 Nr. 2 DSGVO erfasst „Verarbeitung“ praktisch jeden denkbaren Umgang mit personenbezogenen Daten – von der Erhebung über die Speicherung bis zur Offenlegung durch Übermittlung."
    ],
    abschnitte: [
      {
        titel: "Die DSGVO in Bezug auf die Datenweitergabe an einen Dritten gem. Art. 5 DA",
        absaetze: [
          "Das Weitergeben nach Art. 5 DA lässt sich unter diesem weiten Verarbeitungsbegriff ohne Weiteres als Offenlegung, regelmäßig in Form einer Übermittlung i.S.v. Art. 4 Nr. 2 DSGVO, einordnen. Damit beschreibt die Vorschrift unzweifelhaft eine eigenständige Verarbeitungshandlung des Dateninhabers gegenüber Nutzer oder Dritten.",
          "Liegt damit eine datenschutzrelevante Verarbeitung vor, stellt sich die Anschlussfrage nach deren Rechtfertigung. Erwägungsgrund 7 S. 7 DA gibt hierauf eine erste, aber nur teilweise Antwort: Der Data Act enthalte „keine Rechtsgrundlage für die Erhebung oder Generierung personenbezogener Daten“. Für diese beiden Verarbeitungsschritte ist damit klargestellt, dass eine Rechtsgrundlage außerhalb des Data Act gesucht werden muss. Offen bleibt jedoch, was für die Weitergabe nach Art. 5 DA sowie für die Bereitstellung nach Art. 4 DA gilt, wenn man diese Vorgänge nicht bereits unter die in Erwägungsgrund 7 S. 7 DA genannten Begriffe „Erhebung“ oder „Generierung“ fasst.",
          "Aus dem in Erwägungsgrund 5 DA formulierten Regelungsziel, Produktdaten zugänglich und nutzbar zu machen, ließe sich eigentlich ableiten, dass der Unionsgesetzgeber die Dateninhaber mit den Vorschriften zur Datenweitergabe auch zur Offenlegung personenbezogener Daten verpflichten wollte. Anstatt dies jedoch über eine ausdrückliche Rechtsgrundlage nach Art. 6 Abs. 1 lit. c, Abs. 2 und Abs. 3 DSGVO abzusichern, hat der Gesetzgeber stattdessen, recht unauffällig platziert in Art. 4 Abs. 12 DA und Art. 5 Abs. 7 DA, lediglich zwei gleichlautende Negativaussagen getroffen: Der Data Act soll gerade keine Rechtsgrundlage darstellen, wenn Nutzer und betroffene Person nicht personenidentisch sind."
        ]
      },
      {
        titel: "Zur Abgrenzung: Wann sind Nutzer und betroffene Person personenidentisch?",
        absaetze: [
          "Personenidentität liegt vor, wenn der Nutzer, der die Weitergabe an einen Dritten (Datenempfänger) verlangt, zugleich die Person ist, auf die sich die Daten beziehen – etwa bei der Weitergabe eigener Fahrzeugdaten an eine Werkstatt.",
          "Personenidentität liegt nicht vor, wenn die Daten eine andere Person betreffen als den Nutzer – etwa bei einem Familienfahrzeug, dessen Daten auch Rückschlüsse auf einen Mitfahrer zulassen. Dieser ist dann der „unbeteiligte Dritte“.",
          "Im Umkehrschluss ließe sich daraus folgern, dass für Fälle der Personenidentität eine Lösung über Art. 6 Abs. 1 lit. c DSGVO denkbar wäre, indem man die Bereitstellungs- und Weitergabepflichten des Data Act selbst als „rechtliche Verpflichtung“ des Dateninhabers im Sinne dieser Vorschrift begreift. Bei der Weitergabe von Daten unbeteiligter Dritter fehlt es jedoch an dieser Personenidentität, sodass sich der Dateninhaber hierfür nicht auf den Data Act als Rechtsgrundlage für die Weitergabe personenbezogener Daten stützen kann und stattdessen auf die allgemeinen Rechtsgrundlagen der DSGVO zurückgreifen muss.",
          "Zunächst kommt eine Einwilligung in Betracht, deren Voraussetzungen an Informiertheit und Freiwilligkeit in der Praxis anspruchsvoll sein können, etwa bei Abhängigkeitsverhältnissen in Arbeitskontexten oder wegen ihrer jederzeitigen Widerrufbarkeit. Zum anderen kann die Vertragserfüllung nach Art. 6 Abs. 1 lit. b DSGVO herangezogen werden, die jedoch nicht zur Umgehung der strengeren Einwilligungsanforderungen dienen darf. Schließlich bleibt das berechtigte Interesse nach Art. 6 Abs. 1 lit. f DSGVO möglich, das eine Einzelfallabwägung unter Berücksichtigung der berechtigten Erwartungen des betroffenen Nutzers (vgl. Erwgr. 47 S. 1 DSGVO) sowie der Wertungen des Data Act selbst erfordert."
        ]
      }
    ],
    fazit: "Der Data Act stellt selbst keine Rechtsgrundlage für die Weitergabe personenbezogener Daten an unbeteiligte Dritte dar. Zwar lassen Art. 4 Abs. 12 DA und Art. 5 Abs. 7 DA im Umkehrschluss den Gedanken zu, die Bereitstellungs- und Weitergabepflichten des Data Act könnten bei Personenidentität von Nutzer und Betroffenem als rechtliche Verpflichtung i.S.d. Art. 6 Abs. 1 lit. c DSGVO fungieren – bei der Weitergabe an unbeteiligte Dritte fehlt es jedoch gerade an dieser Personenidentität. Der Dateninhaber muss sich für diese Fälle auf die allgemeinen Rechtsgrundlagen der DSGVO (Einwilligung, Vertragserfüllung oder berechtigtes Interesse) stützen, deren jeweilige Anforderungen in der Praxis nicht ohne Weiteres zu erfüllen sind.",
    empfehlungen: [
      "Personenidentität klären: Vor jeder Weitergabe prüfen, ob Nutzer und betroffene Person tatsächlich identisch sind, denn nur dann kommt überhaupt eine Anknüpfung an den Data Act als rechtliche Verpflichtung in Betracht.",
      "Eigene Rechtsgrundlage bestimmen und dokumentieren: Bei unbeteiligten Dritten eine der drei Rechtsgrundlagen (Einwilligung, Vertrag, berechtigtes Interesse) auswählen und die Prüfung nachvollziehbar festhalten.",
      "Einwilligung kritisch prüfen: Insbesondere bei Abhängigkeitsverhältnissen (z. B. Arbeitskontext) die Freiwilligkeit sorgfältig bewerten und die jederzeitige Widerrufbarkeit einkalkulieren.",
      "Vertragserfüllung nicht als Umgehung nutzen: Eine vertragliche Konstruktion darf nicht dazu dienen, die strengeren Anforderungen der Einwilligung zu unterlaufen.",
      "Interessenabwägung sorgfältig durchführen: Bei Berufung auf das berechtigte Interesse die berechtigten Erwartungen des betroffenen Dritten sowie die Wertungen des Data Act in die Abwägung einbeziehen und dokumentieren."
    ],
    literatur: [
      "Plum / Schneider: Mechanik des Datenrechts: Scharniere zwischen DS-GVO und Data Act – Ein Blick in den Werkzeugkasten von Digitalregulierung und Datenaufsicht, ZD 2026, 547 ff.",
      "Baumann / Brunnbauer: Datenschutzrechtliche Anforderungen bei der Bereitstellung von IoT-Daten nach dem Data Act – Herausforderung für Dateninhaber im Spannungsfeld zwischen DS-GVO und DA, ZD 2025, 132 ff."
    ],
    bewertungen: {
      haeufigkeit: {
        score: 2,
        konfidenz: "belegt",
        text: "Das Verhältnis von Data Act und DSGVO im Allgemeinen gehört zu den am intensivsten diskutierten Themenkomplexen des Data Act und wird in zahlreichen Beiträgen vertieft behandelt. Die hier konkret aufgeworfene Frage, ob der Data Act selbst als Rechtsgrundlage bzw. rechtliche Verpflichtung iSv Art. 6 Abs. 1 lit. c DSGVO für die Weitergabe von Daten unbeteiligter Dritter fungiert, wird demgegenüber nur vereinzelt und meist im Rahmen breiterer Darstellungen zum Datenschutz-Spannungsverhältnis mitbehandelt, nicht aber als eigenständiger Schwerpunkt."
      },
      aufwand: {
        score: 3,
        konfidenz: "belegt",
        text: "Für Dateninhaber besteht der Aufwand vor allem in der Prüfung und Dokumentation, ob Nutzer und betroffene Person personenidentisch sind, sowie in der anschließenden Bestimmung und Absicherung einer eigenständigen datenschutzrechtlichen Rechtsgrundlage (Einwilligung, Vertragserfüllung oder berechtigtes Interesse) für die Fälle, in denen dies nicht der Fall ist. Ein technischer Systemumbau ist damit nicht zwingend verbunden, wohl aber ein wiederkehrender rechtlicher Prüf- und Dokumentationsprozess bei jeder Weitergabeanfrage."
      },
      streit: {
        score: 2,
        konfidenz: "belegt",
        text: "Ein etablierter Meinungsstreit mit benannten Gegenpositionen ist zu dieser konkreten Frage nicht erkennbar. Die Argumentation, dass der Data Act keine Rechtsgrundlage bei fehlender Personenidentität darstellt, wird im Wege eines Umkehrschlusses aus Art. 4 Abs. 12 DA und Art. 5 Abs. 7 DA hergeleitet, ohne dass hierzu eine widersprechende Auffassung ersichtlich wäre."
      },
      unsicherheit: {
        score: 4,
        konfidenz: "belegt",
        text: "Der Verordnungstext selbst lässt ausdrücklich offen, wie die Weitergabe nach Art. 5 DA und die Bereitstellung nach Art. 4 DA datenschutzrechtlich einzuordnen sind, wenn man sie nicht unter die in Erwägungsgrund 7 S. 7 DA genannten Begriffe „Erhebung“ oder „Generierung“ fasst. Auch die Einordnung der Bereitstellungs- und Weitergabepflichten als rechtliche Verpflichtung iSv Art. 6 Abs. 1 lit. c DSGVO im Fall der Personenidentität wird nur im Konjunktiv als denkbare Lösung angeführt, nicht als gesicherte Erkenntnis."
      },
      bussgeld: {
        score: 4,
        konfidenz: "belegt",
        text: "Verlässt sich ein Dateninhaber fälschlich auf den Data Act als eigenständige Rechtsgrundlage für die Weitergabe von Daten unbeteiligter Dritter, liegt darin ein eigenständiger DSGVO-Verstoß mit entsprechendem Sanktionsrahmen nach Art. 83 DSGVO, unabhängig von etwaigen Sanktionen nach dem Data Act selbst."
      },
      haftung: {
        score: 4,
        konfidenz: "belegt",
        text: "Unbeteiligten Dritten, deren personenbezogene Daten ohne tragfähige eigenständige Rechtsgrundlage weitergegeben werden, steht grundsätzlich ein Schadensersatzanspruch nach Art. 82 DSGVO zu. Gleichzeitig drohen bei einer zu Unrecht verweigerten Weitergabe Erfüllungsansprüche des Nutzers aus Art. 5 DA."
      }
    }
  },
  {
    id: "verantwortlicher",
    kategorie: "dsgvo",
    kurztitel: "Datenschutzrechtliche Verantwortlichkeit im Data Act",
    frage: "Wer ist datenschutzrechtlich Verantwortlicher, wenn personenbezogene Daten im Rahmen der Zugänglichmachung nach Art. 3 DA, der Bereitstellung nach Art. 4 DA oder der Weitergabe an Dritte nach Art. 5 DA verarbeitet werden?",
    normen: "Art. 3, 4, 5 DA · Art. 4 Nr. 7 DSGVO · Art. 26 DSGVO",
    einleitung: [
      "Der Data Act verfolgt das Ziel, den Zugang zu Daten zu erleichtern und deren Nutzung zu fördern. Dem steht die bereits seit Jahren geltende DSGVO gegenüber, die auf einen restriktiven Umgang mit personenbezogenen Daten ausgerichtet ist. Beide Regelwerke folgen damit unterschiedlichen Leitgedanken: Während die DSGVO Datensparsamkeit betont und die Verarbeitung sowie Weitergabe personenbezogener Daten nur unter engen rechtlichen Voraussetzungen zulässt, blieben Unternehmensdaten nach Umfragen über Jahre hinweg zu einem erheblichen Teil ungenutzt und wurden nicht systematisch erschlossen. Der Data Act soll diese Datensilos durch einen rechtlich abgesicherten Zugangsanspruch öffnen, um Innovation, neue Geschäftsmodelle und mehr Wettbewerb in der europäischen Datenökonomie zu fördern, ohne dabei den Schutz personenbezogener Daten preiszugeben. Da der Data Act ausdrücklich sowohl personenbezogene als auch nicht-personenbezogene Daten erfasst, entsteht ein strukturelles Spannungsfeld: Wird die Herausgabe verweigert, droht ein Verstoß gegen den Data Act; wird hingegen ohne tragfähige Rechtsgrundlage weitergegeben, droht ein Verstoß gegen die DSGVO."
    ],
    abschnitte: [
      {
        titel: "Die Verantwortlichkeitsfrage als eigenständiges Scharnier zwischen Data Act und DSGVO",
        absaetze: [
          "Das Verhältnis von Datenschutz und Datennutzung bleibt eine der zentralen Grundsatzfragen des Digitalrechts, an der sich Data Act und DSGVO an mehreren Stellen berühren. Eine dieser Berührungsstellen betrifft die Bestimmung der datenschutzrechtlichen Verantwortlichkeitsstruktur bei Datenherausgaben nach dem Data Act.",
          "Nach Art. 4 Nr. 7 DSGVO ist Verantwortlicher, wer „allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet“. Bei einer Datenherausgabe nach dem Data Act kommen dabei typischerweise mehrere Akteure – Dateninhaber, Nutzer und Dritte – als mögliche Verantwortliche in Betracht. Die Rechtsprechung des EuGH zur gemeinsamen Verantwortlichkeit hat diese Zuordnung in den vergangenen Jahren erheblich ausdifferenziert, sodass sich die Frage nach dem Verantwortlichen je nach betroffenem Verarbeitungsszenario unterschiedlich beantworten lässt."
        ]
      },
      {
        titel: "Zugänglichmachung nach Art. 3 DA",
        absaetze: [
          "Bei der Zugänglichmachung nach Art. 3 DA ist die Verantwortlichkeit im Einzelfall zu bestimmen. Werden die Daten direkt aus dem Produkt oder Dienst übermittelt oder macht der Dateninhaber sie etwa über ein Portal nach eigenen Modalitäten zugänglich, dürfte er hierfür Verantwortlicher i.S.d. Art. 4 Nr. 7 DSGVO sein, vorausgesetzt, hierin liegt überhaupt eine datenschutzrechtlich relevante Verarbeitung iSv Art. 4 Nr. 2 DSGVO.",
          "Die Verantwortungssphäre der Adressaten des Art. 3 DA dürfte dabei regelmäßig an der Schnittstelle zum Nutzer enden, also in der bloßen Schaffung einer Zugangsmöglichkeit. Ruft ein Nutzer die Daten dagegen eigenmächtig ab und ist dies als „Erhebung“ nach Art. 4 Nr. 2 DSGVO zu werten, wäre regelmäßig allein der Nutzer Verantwortlicher, sofern er nicht selbst betroffene Person ist. Entscheiden Dateninhaber und Nutzer hingegen gemeinsam über die Modalitäten der Abrufbarkeit personenbezogener Daten eines Dritten, spricht vieles für eine gemeinsame Verantwortlichkeit nach Art. 26 DSGVO."
        ]
      },
      {
        titel: "Datenbereitstellung nach Art. 4 und Datenweitergabe nach Art. 5 DA",
        absaetze: [
          "Bei der Bereitstellung nach Art. 4 DA und der Weitergabe nach Art. 5 DA dürfte die Verantwortlichkeit im Regelfall beim Dateninhaber liegen: Er bestimmt durch sein Produktdesign und seine tatsächliche Datenherrschaft die Mittel der Übermittlung, während deren Zwecke bereits gesetzlich durch Art. 4 und 5 DA vorgezeichnet sind. Verlangt ein Nutzer Daten heraus, die einen Dritten betreffen, dürfte ihn nach Erwägungsgrund 34 S. 7 DA regelmäßig ebenfalls eine eigene Verantwortlichkeit treffen. Im Einzelfall ist dann auch eine gemeinsame Verantwortlichkeit von Dateninhaber und Nutzer nach Art. 26 DSGVO denkbar (vgl. Erwägungsgrund 34 S. 10 DA), sofern beide gemeinsam über die Verarbeitung der Daten des Dritten entscheiden. Zu beachten ist dabei jedoch die vom EuGH in der Rechtssache Fashion ID entwickelte Trennung der Verarbeitungsphasen: Für die Speicherung bei einem Akteur und für dessen eigenmächtige Weiterverarbeitung wird dieser Akteur regelmäßig allein verantwortlich sein, ohne dass sich daraus automatisch eine durchgängige gemeinsame Verantwortlichkeit über alle Phasen hinweg ergibt."
        ]
      }
    ],
    fazit: "Wer datenschutzrechtlich Verantwortlicher ist, lässt sich nicht einheitlich für den gesamten Data Act beantworten, sondern hängt vom jeweiligen Verarbeitungsszenario und den konkreten Umständen des Einzelfalls ab. Während bei Übermittlungen nach Art. 4 und 5 DA regelmäßig der Dateninhaber, bei eigenmächtigem Abruf nach Art. 3 DA regelmäßig der Nutzer als Verantwortlicher in Betracht kommt, ist in beiden Konstellationen auch eine gemeinsame Verantwortlichkeit nach Art. 26 DSGVO möglich, sobald beide Akteure gemeinsam über die Verarbeitung entscheiden.",
    empfehlungen: [
      "Verarbeitungsphasen sauber trennen: Für jede Phase (Zugänglichmachung, Bereitstellung, Weitergabe, Weiterverarbeitung) gesondert prüfen, wer über Zwecke und Mittel entscheidet, statt eine einheitliche Verantwortlichkeit für den gesamten Vorgang anzunehmen.",
      "Gemeinsame Verantwortlichkeit dokumentieren: Liegt eine gemeinsame Entscheidung über die Verarbeitung von Drittdaten vor, eine Vereinbarung nach Art. 26 DSGVO abschließen, die die jeweiligen Pflichten klar zuordnet.",
      "Rolle bei Art. 3 DA klären: Prüfen, ob die eigene Verantwortungssphäre tatsächlich nur bis zur Schaffung der Zugangsmöglichkeit reicht oder ob durch eigene Speicherung/Bereitstellung eine weitergehende Verantwortlichkeit entsteht.",
      "Nutzerrolle nicht übersehen: Auch Nutzer sollten sich bewusst sein, dass sie bei Anforderung von Drittdaten selbst datenschutzrechtlich verantwortlich sein können, mit entsprechenden eigenen Pflichten.",
      "EuGH-Rechtsprechung zur gemeinsamen Verantwortlichkeit verfolgen: Die Auslegung des Art. 26 DSGVO wird maßgeblich durch die fortlaufende EuGH-Rechtsprechung geprägt, die auf Data-Act-Konstellationen zu übertragen ist."
    ],
    literatur: [
      "Plum / Schneider: Mechanik des Datenrechts: Scharniere zwischen DS-GVO und Data Act – Ein Blick in den Werkzeugkasten von Digitalregulierung und Datenaufsicht, ZD 2026, 547 ff.",
      "Baumann / Brunnbauer: Datenschutzrechtliche Anforderungen bei der Bereitstellung von IoT-Daten nach dem Data Act, ZD 2025, 132.",
      "Metzger: Datenschutz oder Datenzugang? Neuausrichtung des europäischen Datenrechts nach dem Data Act, NJW 2025, 2729.",
      "Antoine: Datenzugang im Spannungsfeld zwischen DSGVO, Geschäftsgeheimnisschutz und Datenbankherstellerrecht, CR 2024, 73."
    ],
    bewertungen: {
      haeufigkeit: {
        score: 2,
        konfidenz: "belegt",
        text: "Die Verantwortlichkeitsfrage wird bislang nur als eines von mehreren Scharnieren zum Verhältnis von Data Act und DSGVO behandelt, nicht als eigenständiger Untersuchungsgegenstand. Während das übergeordnete Spannungsverhältnis zwischen Data Act und DSGVO insgesamt zu den am intensivsten diskutierten Themen zählt, ist die konkrete Verantwortlichkeitszuordnung bei den drei Verarbeitungsszenarien bislang nur vereinzelt vertieft worden."
      },
      aufwand: {
        score: 3,
        konfidenz: "belegt",
        text: "Für Dateninhaber und Nutzer besteht der Aufwand vor allem in der wiederkehrenden Einzelfallprüfung, wer bei welchem Verarbeitungsschritt über Zwecke und Mittel entscheidet, sowie im Abschluss und der Pflege von Vereinbarungen zur gemeinsamen Verantwortlichkeit nach Art. 26 DSGVO, sobald eine gemeinsame Entscheidung vorliegt. Ein technischer Umbau ist damit nicht zwingend verbunden, wohl aber ein nicht unerheblicher rechtlich-organisatorischer Dokumentationsaufwand."
      },
      streit: {
        score: 2,
        konfidenz: "belegt",
        text: "Eine etablierte Kontroverse mit benannten Gegenpositionen ist zu dieser Frage nicht erkennbar. Die vorliegende Darstellung entwickelt eine in sich stimmige, auf EuGH-Rechtsprechung (insbesondere zur gemeinsamen Verantwortlichkeit und zur Rechtssache Fashion ID) gestützte Differenzierung nach Verarbeitungsszenarien, ohne dass hierzu eine widersprechende Literaturauffassung ersichtlich wäre."
      },
      unsicherheit: {
        score: 3,
        konfidenz: "belegt",
        text: "Unsicherheit besteht bei der Frage, wann genau eine gemeinsame Verantwortlichkeit statt einer Alleinverantwortlichkeit vorliegt, sowie bei der exakten Abgrenzung der Verantwortungssphären an den Schnittstellen zwischen Dateninhaber und Nutzer – insbesondere im Rahmen der Zugänglichmachung nach Art. 3 DA, wo die Einordnung als eigenständige Verarbeitungshandlung des Dateninhabers selbst nicht abschließend geklärt ist."
      },
      bussgeld: {
        score: 4,
        konfidenz: "belegt",
        text: "Eine fehlerhafte Einordnung der eigenen Rolle als Verantwortlicher, gemeinsam Verantwortlicher oder Nicht-Verantwortlicher zählt zu den in der Aufsichtspraxis besonders häufig sanktionierten DSGVO-Verstößen, da hieran unmittelbar Rechenschafts-, Informations- und Dokumentationspflichten anknüpfen. Bei mehreren beteiligten Akteuren (Dateninhaber, Nutzer, Dritter) steigt das Risiko einer Fehlzuordnung zusätzlich."
      },
      haftung: {
        score: 4,
        konfidenz: "belegt",
        text: "Bei gemeinsamer Verantwortlichkeit haften Dateninhaber und Nutzer nach Art. 82 DSGVO grundsätzlich gesamtschuldnerisch gegenüber der betroffenen Person, unabhängig von der internen Aufgabenverteilung. Eine unzutreffende Einschätzung der eigenen Verantwortlichkeit kann daher zu einer unerwarteten vollumfänglichen Haftung gegenüber Dritten führen."
      }
    }
  },

  /* ---------- 5. Geschäftsgeheimnisschutz & TOMs ---------- */
  {
    id: "geheimnis-verweigerung",
    kategorie: "geheimnis",
    kurztitel: "Geschäftsgeheimnis-Verweigerung",
    frage: "Unter welchen Voraussetzungen darf ein Dateninhaber die Datenherausgabe unter Berufung auf ein Geschäftsgeheimnis verweigern, ohne den Zugangsanspruch faktisch auszuhöhlen?",
    normen: "Art. 4 VI–XI DA · Art. 5 DA",

    einleitung: [
      "Der Geschäftsgeheimnisschutz war nach Dose/Pühl eines der politisch umstrittensten Themen des Gesetzgebungsverfahrens zum Data Act. Dem Grundsatz einer umfänglichen Datenbereitstellung wurden im Ergebnis Ausnahmeregelungen beigefügt.",
      "Die zugrunde liegende Spannung ist strukturell angelegt: Ein generelles Verweigerungsrecht würde den Zugangsanspruch weitgehend leerlaufen lassen, ein vollständiger Vorrang des Zugangs den Geheimnisschutz entwerten. Nach dem ausgewerteten Material löst der Data Act dies nicht über eine Abwägung im Einzelfall, sondern über ein gestuftes Verfahren."
    ],

    abschnitte: [
      {
        titel: "Ein bloßer Hinweis auf das Geheimnis genügt nicht",
        absaetze: [
          "Dateninhaber sind verpflichtet, Nutzern auch solche Daten offenzulegen, die dem Schutz des Geschäftsgeheimnisses unterfallen; andernfalls liefe der Zugangsanspruch weitgehend leer. Als Beleg wird hierfür Erwägungsgrund 31 DA angeführt (Kiefer/Schneider, übernommen aus dem Projekt-Orientierungsdokument, nicht am Original geprüft).",
          "Wöbbeking/Andjic stützen diese Richtung: Nach ihrer Darstellung rechtfertigt der Geheimnisschutz nur unter strengen Voraussetzungen eine Einschränkung der Nutzerrechte und führt sogar nur im Ausnahmefall zu einer echten Begrenzung der Datenbereitstellung."
        ]
      },
      {
        titel: "Verfassungsrechtlicher Hintergrund",
        absaetze: [
          "Geschäftsgeheimnisse sind nach Wendehorst anerkanntermaßen vom Schutz des Art. 17 GRCh umfasst. Indem Dateninhaber grundsätzlich verpflichtet werden, auch Geschäftsgeheimnisse offenzulegen, liege eindeutig ein Eingriff in ihr Eigentum vor. Für Daten als solche gilt dies nach ihrer Einschätzung nicht: Dort habe sich die Auffassung durchgesetzt, dass de lege lata weder ein dem Sacheigentum vergleichbares Ausschließlichkeitsrecht noch ein Immaterialgüterrecht besteht.",
          "Der Eingriff ist nach der Vorstellung des europäischen Gesetzgebers durch eine eigentumsähnliche Position des Nutzers an den co-generierten Daten sowie durch die Förderung des Wettbewerbs gerechtfertigt. Wendehorst bezweifelt allerdings, ob die sehr asymmetrische Ausgestaltung der Beziehung dem Verhältnismäßigkeitsprinzip gerecht wird."
        ]
      },
      {
        titel: "Erste Stufe: Vertraulichkeitsmaßnahmen",
        absaetze: [
          "Vor der Offenlegung können zwischen Dateninhaber und Nutzer die erforderlichen Maßnahmen vereinbart werden, um die Vertraulichkeit zu wahren. Genannt werden Mustervertragsklauseln, Vertraulichkeitsvereinbarungen, strenge Zugangsprotokolle, technische Normen und Verhaltenskodizes. Nach dem Projekt-Orientierungsdokument darf der Dateninhaber die tatsächliche Umsetzung abwarten, bevor er Daten offenlegt (Kiefer/Schneider, nicht am Original geprüft).",
          "Wendehorst weist auf die Kehrseite hin: Der Dateninhaber habe grundsätzlich keine Kontrolle darüber, an wen die Daten gelangen, und müsse sich mit dem vertraglichen Versprechen des Nutzers oder dritten Datenempfängers begnügen, bestimmte technische und organisatorische Schutzmaßnahmen anzuwenden."
        ]
      },
      {
        titel: "Zweite Stufe: Verweigerung bei gescheiterter Einigung",
        absaetze: [
          "Kommt keine Einigung über die erforderlichen Vertraulichkeitsmaßnahmen zustande, besteht nach Dose/Pühl eine Ausnahmeregelung zugunsten des Dateninhabers.",
          "Nach dem Projekt-Orientierungsdokument greift das Verweigerungsrecht darüber hinaus, wenn vereinbarte Maßnahmen nicht umgesetzt werden oder die Vertraulichkeit verletzt wird. Diese Erweiterung ist am Verordnungstext noch abzugleichen."
        ]
      },
      {
        titel: "Dritte Stufe: Schwerer wirtschaftlicher Schaden",
        absaetze: [
          "Nach Art. 4 VIII und Art. 5 XI DA kann der Dateninhaber das Datenteilen nur ablehnen, wenn außergewöhnliche Umstände vorliegen, sodass er mit hoher Wahrscheinlichkeit einen schweren wirtschaftlichen Schaden durch eine Offenlegung von Geschäftsgeheimnissen erleiden wird, und zwar trotz der getroffenen technischen und organisatorischen Maßnahmen (Wendehorst).",
          "Denga ordnet dies als Fälle ein, in denen der Zugang nur in Ausnahmefällen vollständig verweigert werden darf. Die Musterklauseln der Kommission konkretisieren dies nach seiner Darstellung dahingehend, dass eine Verweigerung nur möglich ist, wenn trotz aller zumutbaren Maßnahmen das wirtschaftliche Offenlegungsrisiko schwerer wiegt als das Datenzugangsinteresse. Diese Regelung scheine eine gerechte Balance zu ergeben."
        ]
      },
      {
        titel: "Die eigentliche Schwachstelle",
        absaetze: [
          "Nach Wendehorst liegt das Problem an anderer Stelle als im Wortlaut vorgesehen: Es sei eher die Gefahr, dass der Nutzer oder Datenempfänger die versprochenen Maßnahmen gar nicht erst trifft. Genau dieser Fall ist vom Wortlaut nicht erfasst, weil dort ein Schadenseintritt trotz getroffener Maßnahmen verlangt wird.",
          "Geschäftsgeheimnisse müssen daher auch dann geteilt werden, wenn der Dateninhaber berechtigte Zweifel an der Seriosität und den Absichten des Nutzers hegt, solange er nicht nachweisen kann, dass vereinbarte Schutzmaßnahmen nicht ergriffen oder Geschäftsgeheimnisse unbefugt verwertet wurden. Ist ein Schaden bereits eingetreten, ist der Dateninhaber auf Schadensersatzansprüche beschränkt, hinsichtlich derer er das volle Prozessrisiko trägt und deren Befriedigung häufig an fehlender Auffindbarkeit oder mangelnder Solvenz des Schuldners scheitern wird."
        ]
      },
      {
        titel: "Das Problem der Vorabidentifikation",
        absaetze: [
          "Praktisch problematisch ist nach Denga die Verpflichtung, Geschäftsgeheimnisse vorab zu identifizieren: Bei Massenprodukten könne die Offenlegung gegenüber einer Vielzahl von Empfängern die Vertraulichkeit gerade zerstören.",
          "Der Schutzmechanismus kann sich damit selbst untergraben. Wie sich dieser Widerspruch auflösen lässt, wird in den ausgewerteten Quellen nicht beantwortet."
        ]
      },
      {
        titel: "Unbestimmte Maßstäbe",
        absaetze: [
          "Denga hält die Regelungen zum Geschäftsgeheimnisschutz zwar für detailliert, in entscheidenden Punkten aber für vage. Insbesondere fehlten klare Kriterien dafür, wann zusätzliche Schutzmaßnahmen erforderlich sind. Allgemein bemängelt er die Unbestimmtheit zentraler Begriffe, etwa „most appropriate measures“.",
          "Die Musterklauseln sehen gestaffelte Rechte des Dateninhabers vor: zusätzliche Schutzmaßnahmen verlangen, in Ausnahmefällen die Weitergabe verweigern oder bei Pflichtverletzungen aussetzen. Für zurückgehaltene Daten besteht eine Aufbewahrungspflicht."
        ]
      },
      {
        titel: "Erweiterung durch den Digital Omnibus",
        absaetze: [
          "Im Digitalen Omnibus sollen die Formulierungen in Art. 4 VIII und Art. 5 XI DA ergänzt werden. Ein Verweigerungsrecht soll ausdrücklich auch dann bestehen, wenn eine Offenlegung ein hohes Risiko der rechtswidrigen Weitergabe an Personen in Drittstaaten oder von Drittstaaten kontrollierte Personen mit sich bringt (Wendehorst; ebenso Dose/Pühl).",
          "Wendehorst hält die Formulierung für sprachlich doppeldeutig; vieles spreche dafür, dass der Schaden weiterhin trotz der getroffenen Maßnahmen eintreten müsse. Damit sei unklar, was durch die Ergänzung erreicht werden solle, denn das Problem liege gerade in der Gefahr der Nichteinhaltung. Dose/Pühl bemängeln in dieselbe Richtung, dass der konkrete Nachweismechanismus vage bleibt."
        ]
      },
      {
        titel: "Ein Auslegungsvorschlag",
        absaetze: [
          "Wendehorst hält es für möglich, durch primärrechtskonforme, extensive Auslegung von Art. 4 VIII und Art. 5 XI DA einen Zustand herzustellen, bei dem ein Verstoß gegen Art. 16 und 17 GRCh vermieden wird. Erreichen ließe sich dies, indem die Worte „trotz der getroffenen technischen und organisatorischen Maßnahmen“ nicht so verstanden werden, dass ein vertragskonformes Verhalten fingiert wird, sondern so, dass im Falle einer naheliegenden Vertragsbrüchigkeit mit hoher Wahrscheinlichkeit ein schwerer wirtschaftlicher Schaden droht.",
          "Ob eine Vertragsbrüchigkeit naheliegt, sollte nach ihrer Auffassung auch anhand des Wertes des Geschäftsgeheimnisses und der wirtschaftlichen Anreize, dieses preiszugeben, bewertet werden."
        ]
      }
    ],

    fazit: "Der Data Act beantwortet die Rechtsfrage nicht über eine Abwägung, sondern über ein Verfahren: zunächst Vertraulichkeitsmaßnahmen vereinbaren, bei gescheiterter Einigung verweigern, vollständig verweigern nur in Ausnahmefällen. Auf der Normebene dürfte eine Aushöhlung des Zugangsanspruchs damit verhindert sein. Die Schwierigkeiten liegen auf der Umsetzungsebene: Wann zusätzliche Schutzmaßnahmen erforderlich sind, bleibt nach Denga offen; die Vorabidentifikation kann bei Massenprodukten den Schutz gefährden, den sie herstellen soll; und der Wortlaut verlangt nach Wendehorst einen Schaden trotz getroffener Maßnahmen, während das praktische Problem gerade in der Gefahr liegt, dass Maßnahmen nicht getroffen werden. Ob die Erweiterung durch den Digital Omnibus daran etwas ändert, wird von Wendehorst und Dose/Pühl bezweifelt.",

    empfehlungen: [
      "Nicht auf das Geheimnis allein berufen: Der bloße Hinweis auf ein Geschäftsgeheimnis dürfte eine Verweigerung nicht tragen. Vorausgehen sollte die Verhandlung über Schutzmaßnahmen.",
      "Maßnahmen vor der Offenlegung vereinbaren und die Umsetzung prüfen: Die Offenlegung darf nach dem ausgewerteten Material unterbleiben, bis die vereinbarten Maßnahmen tatsächlich umgesetzt sind.",
      "Verweigerungsgründe dokumentieren: Da der Nachweis ein künftiges Risiko betrifft, dürfte eine belastbare Dokumentation praktisch unerlässlich sein.",
      "Anhaltspunkte für Vertragsbrüchigkeit erfassen: Folgt man dem Auslegungsvorschlag von Wendehorst, sind der Wert des Geschäftsgeheimnisses und die wirtschaftlichen Anreize zur Preisgabe maßgebliche Bewertungsfaktoren.",
      "Vorabidentifikation bewusst gestalten: Bei Massenprodukten ist abzuwägen, wie detailliert Geschäftsgeheimnisse gegenüber einer Vielzahl von Empfängern benannt werden.",
      "Musterklauseln als Maßstab einkalkulieren: Denga erwartet, dass Gerichte und Behörden sie als Maßstab für faire Vertragsgestaltung heranziehen und Abweichungen als Indiz für Unfairness gewertet werden könnten."
    ],

    literatur: [
      "Wendehorst, Christiane: Zweifel an der Primärrechtskonformität des Data Act – löst der Digitale Omnibus die Probleme?, NJW 2026, 291–296, insb. Rn. 8–15.",
      "Denga, Michael: Die Musterklauseln für den Data Act, RDi 2026, 181–189, insb. Rn. 16, 21, 47–49, 56.",
      "Dose, Michael / Pühl, Florian: Implikationen des Digital-Omnibus für das Datenwirtschaftsrecht, RDi 2026, 122–127, insb. Rn. 6 f., 11.",
      "Wöbbeking, Maren K. / Andjic, Marko: Europäische Dateninvestitionsschutzgrenze, GRUR 2026, 204–211, insb. S. 207 f.",
      "Kiefer / Schneider: Data Act und Geschäftsgeheimnisschutz in der Praxis, GRUR-Prax 2025, 648."
    ],

    bewertungen: {
      haeufigkeit: {
        score: 5, konfidenz: "vorlaeufig",
        text: "Alle fünf ausgewerteten Quellen behandeln das Thema, vier davon vertieft. Dose/Pühl bezeichnen den Geschäftsgeheimnisschutz als eines der politisch umstrittensten Themen des Gesetzgebungsverfahrens. Wendehorst widmet ihm einen eigenen Abschnitt im Rahmen ihrer Prüfung der Primärrechtskonformität.",
        anmerkung: "Vorschlag ohne Literaturauszählung. Der Wert beruht auf der Dichte der ausgewerteten Quellen und ist vor einer Festlegung zu überprüfen."
      },
      aufwand: {
        score: 4, konfidenz: "vorlaeufig",
        text: "Erforderlich sind die Identifikation der Geschäftsgeheimnisse, die Vereinbarung technischer und organisatorischer Maßnahmen, deren Überprüfung sowie eine laufende Dokumentation. Das betrifft Prozesse und Vertragswerke zugleich und liegt damit oberhalb einer bloßen Anpassung bestehender Verträge.",
        anmerkung: "Ob die Einordnung als 4 oder 5 zutrifft, hängt davon ab, ob die TOM-Implementierung als grundlegender technischer Umbau gewertet wird. Im Team abzustimmen."
      },
      streit: {
        score: 4, konfidenz: "vorlaeufig",
        text: "Wendehorst vertritt eine primärrechtskonform erweiternde Auslegung, die vom Wortlaut abweicht. Dose/Pühl verweisen für unterschiedliche Auffassungen auf Czychowski/Lettl/Steinrötter. Denga bewertet die Regelung dagegen als gerechte Balance. Damit stehen sich erkennbar unterschiedliche Einschätzungen gegenüber.",
        anmerkung: "Die Fundstelle bei Czychowski/Lettl/Steinrötter wurde nicht ausgewertet. Ob dort etablierte Lager belegt sind, ist offen."
      },
      unsicherheit: {
        score: 4, konfidenz: "vorlaeufig",
        text: "Denga: klare Kriterien dafür, wann zusätzliche Schutzmaßnahmen erforderlich sind, fehlen; zentrale Begriffe bleiben unbestimmt. Wendehorst: die Formulierung des Omnibus ist sprachlich doppeldeutig, und es bleibt unklar, was die Ergänzung erreichen soll. Dose/Pühl: der Nachweismechanismus bleibt vage, Evidenz zum Einfluss des Geheimnisschutzes fehlt."
      },
      bussgeld: {
        score: 4, konfidenz: "vorlaeufig",
        text: "Eine unberechtigte Verweigerung stellt eine Nichterfüllung der Bereitstellungspflicht dar und ist damit sanktionsbewehrt. Da die Voraussetzungen der Verweigerung nach dem ausgewerteten Material unklar sind, besteht ein erhöhtes Risiko einer Fehleinschätzung.",
        anmerkung: "Der Sanktionsrahmen wurde nicht anhand einer Quelle geprüft."
      },
      haftung: {
        score: 4, konfidenz: "vorlaeufig",
        text: "Wendehorst beschreibt eine doppelte Belastung: Bei unberechtigter Verweigerung drohen Erfüllungsansprüche des Nutzers; nach einer Geheimnisverletzung ist der Dateninhaber auf Schadensersatzansprüche beschränkt und trägt dabei das volle Prozessrisiko, wobei die Befriedigung häufig an Auffindbarkeit oder Solvenz des Schuldners scheitert."
      }
    }
  },
  {
    id: "beweislast",
    kategorie: "geheimnis",
    kurztitel: "Darlegungs- und Beweislast",
    frage: "Wen trifft die Darlegungs- und Beweislast, wenn sich ein Dateninhaber auf ein Geschäftsgeheimnis beruft, um die Herausgabe zu verweigern oder einzuschränken?",
    normen: "Art. 4 VI–XI DA · Art. 5 DA",

    einleitung: [
      "Die Frage schließt an das abgestufte Verweigerungssystem des Data Act an. Dort ist geregelt, unter welchen Voraussetzungen verweigert werden darf; die Verteilung der Darlegungs- und Beweislast ergibt sich daraus jedoch nur teilweise.",
      "Praktisch entscheidet die Antwort darüber, ob das Verweigerungsrecht durchsetzbar ist. Wer die Last trägt und den Nachweis nicht führen kann, unterliegt im Streitfall unabhängig von der materiellen Rechtslage."
    ],

    abschnitte: [
      {
        titel: "Die Nachweislast liegt beim Dateninhaber – und zwar vorab",
        absaetze: [
          "Nach Wendehorst müssen Geschäftsgeheimnisse nach dem Wortlaut des Data Act auch dann geteilt werden, wenn der Dateninhaber berechtigte Zweifel an der Seriosität und den Absichten des Nutzers oder dritten Datenempfängers hegt, solange er nicht nachweisen kann, dass vereinbarte Schutzmaßnahmen nicht ergriffen oder Geschäftsgeheimnisse unbefugt verwertet oder geteilt wurden.",
          "Die Nachweislast trifft damit den Dateninhaber, und sie greift zu einem Zeitpunkt, zu dem der Verletzungserfolg noch nicht eingetreten sein muss. Wendehorst hält die Ausgestaltung der Beziehung deshalb für sehr asymmetrisch und bezweifelt, ob sie dem Verhältnismäßigkeitsprinzip gerecht wird. Anders als nach der ursprünglichen Konzeption der ALI-ELI Principles werde ein berechtigtes Interesse des Nutzers im Einzelfall nicht geprüft."
        ]
      },
      {
        titel: "Volles Prozessrisiko nach Schadenseintritt",
        absaetze: [
          "Ist ein Schaden bereits eingetreten, ist der Dateninhaber nach Wendehorst auf Schadensersatzansprüche beschränkt. Hinsichtlich dieser Ansprüche trägt er das volle Prozessrisiko; ihre Befriedigung werde häufig an der fehlenden Auffindbarkeit oder mangelnden Solvenz des Schuldners scheitern.",
          "Damit liegt die Last in beiden Konstellationen beim Dateninhaber: vor der Offenlegung der Nachweis der Verweigerungsvoraussetzungen, nach einer Verletzung die Darlegung und der Beweis des Schadens im Prozess."
        ]
      },
      {
        titel: "Was konkret nachzuweisen ist",
        absaetze: [
          "Nach Art. 4 VIII und Art. 5 XI DA kann der Dateninhaber das Datenteilen nur ablehnen, wenn außergewöhnliche Umstände vorliegen, sodass er mit hoher Wahrscheinlichkeit einen schweren wirtschaftlichen Schaden durch eine Offenlegung erleiden wird, und zwar trotz der getroffenen technischen und organisatorischen Maßnahmen (Wendehorst).",
          "Das eigentliche Problem liegt nach Wendehorst jedoch woanders: Es sei eher die Gefahr, dass der Nutzer die versprochenen Maßnahmen gar nicht erst trifft. Genau dieser Fall ist vom Wortlaut nicht erfasst.",
          "Der Nachweis ist nach dem Projekt-Orientierungsdokument auf Grundlage objektiver Tatsachen zu führen; die Gründe sind zu dokumentieren und unverzüglich dem Nutzer beziehungsweise dem Dritten sowie der zuständigen Aufsichtsbehörde zu übermitteln (Kiefer/Schneider, nicht am Original geprüft)."
        ]
      },
      {
        titel: "Ein Auslegungsvorschlag, der den Gegenstand des Nachweises verschiebt",
        absaetze: [
          "Wendehorst hält es für möglich, durch primärrechtskonforme, extensive Auslegung einen Zustand herzustellen, bei dem ein Verstoß gegen Art. 16 und 17 GRCh vermieden wird. Die Worte „trotz der getroffenen technischen und organisatorischen Maßnahmen“ wären dann nicht so zu verstehen, dass ein vertragskonformes Verhalten fingiert wird, sondern so, dass im Falle einer naheliegenden Vertragsbrüchigkeit mit hoher Wahrscheinlichkeit ein schwerer wirtschaftlicher Schaden droht.",
          "Für die Darlegung nennt Wendehorst konkrete Anhaltspunkte: Ob eine Vertragsbrüchigkeit naheliegt, sollte auch anhand des Wertes des Geschäftsgeheimnisses und der wirtschaftlichen Anreize, dieses preiszugeben, bewertet werden.",
          "Folgt man diesem Vorschlag, verschiebt sich der Gegenstand des Nachweises: Darzulegen wäre dann nicht ein Schaden trotz eingehaltener Maßnahmen, sondern die naheliegende Gefahr, dass die Maßnahmen nicht eingehalten werden."
        ]
      },
      {
        titel: "Gegenläufige Darlegungslast des Datenempfängers",
        absaetze: [
          "Die Last liegt nicht einseitig beim Dateninhaber. Nach Denga verlangt Klausel 2.2.1 der Musterklauseln vom Datenempfänger die Zweckoffenlegung und bei Geschäftsgeheimnissen den Nachweis strikter Erforderlichkeit. Dies könne erhebliche Informationsasymmetrien herbeiführen."
        ]
      },
      {
        titel: "Vorabidentifikation und Audits",
        absaetze: [
          "Der Dateninhaber muss Geschäftsgeheimnisse nach den Musterklauseln vorab identifizieren; Klausel 4.1.2 fordert die Aufnahme in Appendix 4. Klausel 4.1.3 erlaubt die nachträgliche Erweiterung der geschützten Daten mit einem Aussetzungsrecht unter Behördenbenachrichtigung. Klausel 4.2.3 sieht optional jährliche Audits durch unabhängige Dritte vor, verbunden mit einem Streitschlichtungsmechanismus (Denga)."
        ]
      },
      {
        titel: "Die prozessuale Beweislast bleibt ungeregelt",
        absaetze: [
          "Denga hält fest, dass die Musterklauseln grenzüberschreitende Aspekte vollständig aussparen. Die Parteien werden damit dem allgemeinen Internationalen Privatrecht unterworfen; insbesondere das Schadensersatzrecht, aber auch Fragen der Beweislast und Verjährung bleiben nationale Angelegenheiten.",
          "Die prozessuale Beweislastverteilung wird also weder im Data Act abschließend noch in den Musterklauseln geregelt. Sie richtet sich nach dem anwendbaren nationalen Recht. Denga weist darauf hin, dass die Wahl des anwendbaren Rechts und des Gerichtsstandes damit Sache der Parteien bleibt und beratungsintensiv ist."
        ]
      },
      {
        titel: "Digital Omnibus: ein weiterer Nachweis mit unklarem Maßstab",
        absaetze: [
          "Im Digitalen Omnibus sollen die Formulierungen ergänzt werden; ein Verweigerungsrecht soll auch bei einem hohen Risiko der rechtswidrigen Weitergabe an Personen in Drittstaaten bestehen (Wendehorst; Dose/Pühl).",
          "Dose/Pühl bemängeln, dass der konkrete Mechanismus des erforderlichen Nachweises eines hohen Risikos des mangelhaften Schutzniveaus in Drittstaaten vage bleibt. Mit dem neuen Verweigerungsgrund entsteht damit eine weitere Nachweislast des Dateninhabers, ohne dass der Maßstab geklärt wäre."
        ]
      }
    ],

    fazit: "Die Frage lässt sich nicht einheitlich beantworten, weil sie auf zwei Ebenen liegt. Auf der Ebene der Voraussetzungen ist die Verteilung eindeutig: Die Nachweislast trifft den Dateninhaber. Nach Wendehorst muss er auch bei berechtigten Zweifeln an der Seriosität des Nutzers offenlegen, solange er nicht nachweisen kann, dass Schutzmaßnahmen nicht ergriffen oder Geheimnisse unbefugt verwertet wurden; nach Schadenseintritt trägt er zudem das volle Prozessrisiko. Umgekehrt trifft den Datenempfänger nach den Musterklauseln der Nachweis strikter Erforderlichkeit. Auf der Ebene der prozessualen Beweislast besteht dagegen eine Regelungslücke: Weder der Data Act noch die Musterklauseln regeln sie; sie bleibt nach Denga nationale Angelegenheit. Die Antwort hängt damit vom anwendbaren Recht ab.",

    empfehlungen: [
      "Anhaltspunkte für Vertragsbrüchigkeit dokumentieren: Folgt man dem Auslegungsvorschlag von Wendehorst, sind der Wert des Geschäftsgeheimnisses und die wirtschaftlichen Anreize zur Preisgabe die maßgeblichen Bewertungsfaktoren. Beides lässt sich vorab erfassen.",
      "Objektive Tatsachen sammeln, nicht Einschätzungen: Wirtschaftliche Kennzahlen, Marktdaten oder Vergleichsfälle dürften tragfähiger sein als Prognosen.",
      "Dokumentation laufend führen: Die Gründe sind unverzüglich zu übermitteln. Wer erst im Streitfall zu dokumentieren beginnt, dürfte die Frist nicht halten können.",
      "Rechtswahl und Gerichtsstand bewusst vereinbaren: Da Beweislastfragen nationale Angelegenheit bleiben, entscheidet die Rechtswahl mittelbar über die Durchsetzbarkeit.",
      "Die Gegenseite in die Pflicht nehmen: Bei nutzerinitiierter Weitergabe an Dritte trifft den Datenempfänger nach den Musterklauseln der Nachweis strikter Erforderlichkeit. Dieser Punkt sollte vertraglich abgebildet werden.",
      "Solvenz und Auffindbarkeit einbeziehen: Wendehorst weist darauf hin, dass Schadensersatzansprüche häufig daran scheitern. Das spricht dafür, präventive Maßnahmen höher zu gewichten als Ersatzansprüche."
    ],

    literatur: [
      "Wendehorst, Christiane: Zweifel an der Primärrechtskonformität des Data Act – löst der Digitale Omnibus die Probleme?, NJW 2026, 291–296, insb. Rn. 11–15.",
      "Denga, Michael: Die Musterklauseln für den Data Act, RDi 2026, 181–189, insb. Rn. 20 f., 53, 56.",
      "Dose, Michael / Pühl, Florian: Implikationen des Digital-Omnibus für das Datenwirtschaftsrecht, RDi 2026, 122–127, insb. Rn. 7, 11.",
      "Kiefer / Schneider: Data Act und Geschäftsgeheimnisschutz in der Praxis, GRUR-Prax 2025, 648."
    ],

    bewertungen: {
      haeufigkeit: {
        score: 2, konfidenz: "vorlaeufig",
        text: "Wendehorst behandelt die Nachweisproblematik ausführlich und als tragendes Argument ihrer Kritik. Denga und Dose/Pühl streifen sie, ohne sie zum eigenständigen Thema zu machen. Eine eigenständige Auseinandersetzung allein mit der Beweislastverteilung enthält keine der ausgewerteten Quellen.",
        anmerkung: "Vorschlag ohne Literaturauszählung. Bei der Auszählung ist auf Abgrenzung zur Frage nach den Verweigerungsvoraussetzungen zu achten, um Doppelzählungen zu vermeiden."
      },
      aufwand: {
        score: 2, konfidenz: "vorlaeufig",
        text: "Im Kern geht es um Dokumentationsvorbereitung sowie um Rechtswahl- und Gerichtsstandsklauseln. Ein Eingriff in technische Systeme ist damit nicht verbunden. Folgt man dem Auslegungsvorschlag von Wendehorst, käme die laufende Bewertung von Geheimniswert und wirtschaftlichen Anreizen hinzu.",
        anmerkung: "Optionale Audits nach den Musterklauseln würden den Aufwand deutlich erhöhen. Ob sie in die Bewertung einfließen sollen, ist im Team zu klären."
      },
      streit: {
        score: 2, konfidenz: "vorlaeufig",
        text: "Wendehorst vertritt eine vom Wortlaut abweichende, erweiternde Auslegung. Ob dieser Position widersprochen wird, ist aus den ausgewerteten Quellen nicht ersichtlich. Ein etablierter Streit zwischen zwei Lagern ist bislang nicht erkennbar; es handelt sich eher um eine offene als um eine umstrittene Frage."
      },
      unsicherheit: {
        score: 5, konfidenz: "vorlaeufig",
        text: "Denga stellt ausdrücklich fest, dass Fragen der Beweislast nationale Angelegenheiten bleiben und in den Musterklauseln nicht behandelt werden. Wendehorst hält die Formulierung des Omnibus für sprachlich doppeldeutig und den Zweck der Ergänzung für unklar. Dose/Pühl bemängeln den vagen Nachweismechanismus. Damit fehlt es sowohl an einer unionsrechtlichen Regelung als auch an einer konsolidierten Literaturmeinung."
      },
      bussgeld: {
        score: 2, konfidenz: "vorlaeufig",
        text: "Die Beweislastverteilung selbst dürfte kein Bußgeld auslösen. Relevant wird sie mittelbar, wenn eine Verweigerung mangels Nachweis als unberechtigt gilt. Das Risiko ist damit von der Frage nach den Verweigerungsvoraussetzungen abgeleitet und fällt eigenständig betrachtet gering aus.",
        anmerkung: "Grenzfall: Ob die Frage überhaupt eigenständig zu bewerten ist oder ob das Risiko vollständig der Verweigerungsfrage zuzuordnen wäre, sollte im Team besprochen werden."
      },
      haftung: {
        score: 4, konfidenz: "vorlaeufig",
        text: "Wendehorst beschreibt die Folge direkt: Nach Schadenseintritt trägt der Dateninhaber das volle Prozessrisiko, und die Befriedigung der Ansprüche scheitert häufig an fehlender Auffindbarkeit oder mangelnder Solvenz des Schuldners. Denga ergänzt, dass das Schadensersatzrecht nationale Angelegenheit bleibt. Beides spricht für ein erhebliches Risiko."
      }
    }
  },
  {
    id: "toms",
    kategorie: "geheimnis",
    kurztitel: "TOMs: erforderlich und ausreichend",
    frage: "Welche technischen und organisatorischen Maßnahmen sind erforderlich und ausreichend, um Geschäftsgeheimnisse im Rahmen der Datenherausgabe wirksam zu schützen?",
    normen: "Art. 4 VI DA",

    einleitung: [
      "Technische und organisatorische Maßnahmen bilden den Ausgangspunkt des Schutzsystems. Geschäftsgeheimnisse werden nur offengelegt, wenn vom Dateninhaber und vom Nutzer vor der Offenlegung alle Maßnahmen getroffen worden sind, die erforderlich sind, um die Vertraulichkeit zu wahren, insbesondere gegenüber Dritten.",
      "Damit verlagert der Data Act die Frage auf die Ebene der Vereinbarung. Welche Maßnahmen im Einzelfall erforderlich und welche ausreichend sind, bestimmt er nicht abschließend."
    ],

    abschnitte: [
      {
        titel: "Die Beispiele des Verordnungstextes",
        absaetze: [
          "Der Gesetzestext nennt Beispiele für angemessene Maßnahmen. Als technische Maßnahmen werden strenge Zugangsprotokolle und technische Normen angeführt, als organisatorische Maßnahmen Mustervertragsklauseln, Vertraulichkeitsvereinbarungen und Verhaltenskodizes (Kiefer/Schneider, übernommen aus dem Projekt-Orientierungsdokument, nicht am Original geprüft).",
          "Dem Dateninhaber steht nach derselben Quelle grundsätzlich die Überprüfung der getroffenen Maßnahmen zu; er darf die tatsächliche Umsetzung abwarten, bevor er Daten offenlegt."
        ]
      },
      {
        titel: "Konkretisierung durch die Musterklauseln",
        absaetze: [
          "Die Mustervertragsklauseln der Kommission enthalten nach Denga umfangreiche Regelungen zum Schutz von Geschäftsgeheimnissen, die auf die Richtlinie (EU) 2016/943 verweisen. Der Dateninhaber muss Geschäftsgeheimnisse vorab identifizieren und kann technische Schutzmaßnahmen vereinbaren.",
          "Im Verhältnis zwischen Dateninhaber und Nutzer setzen die Klauseln 5.1 bis 5.6 den Geschäftsgeheimnisschutz um. Sie verlangen die Identifikation der Geheimnisse in Appendix 4 und teilen die Schutzmaßnahmen zwischen Nutzer und Dateninhaber auf; optional sind Audit-Rechte durch unabhängige Dritte vorgesehen. Der Dateninhaber erhält gestaffelte Rechte: Er kann zusätzliche Schutzmaßnahmen verlangen, in Ausnahmefällen die Weitergabe verweigern oder bei Pflichtverletzungen aussetzen. Für zurückgehaltene Daten besteht eine Aufbewahrungspflicht.",
          "Im Verhältnis zum Datenempfänger fordert Klausel 4.1.2 ebenfalls die Identifikation in Appendix 4. Klausel 4.1.3 erlaubt die nachträgliche Erweiterung der geschützten Daten mit Aussetzungsrecht unter Behördenbenachrichtigung. Klausel 4.2.3 sieht optional jährliche Audits durch unabhängige Dritte vor, verbunden mit einem Streitschlichtungsmechanismus. Klausel 4.3.2 erlaubt einseitige Software-Updates durch den Dateninhaber, die der Datenempfänger nicht entfernen darf."
        ]
      },
      {
        titel: "Flankierender Schutz durch Nutzungsverbote",
        absaetze: [
          "Neben den Schutzmaßnahmen im engeren Sinne begrenzen die Musterklauseln die Nutzungsrechte des Nutzers durch vier zentrale Verbote: keine Entwicklung konkurrierender Produkte, keine Ableitung von Erkenntnissen über die wirtschaftliche Situation des Herstellers, kein Missbrauch technischer Infrastrukturen und keine Weitergabe an Torwächter im Sinne des Digital Markets Act (Denga).",
          "Diese Verbote wirken faktisch wie organisatorische Schutzmaßnahmen, ohne als solche bezeichnet zu werden."
        ]
      },
      {
        titel: "Der Maßstab bleibt offen",
        absaetze: [
          "Denga hält die Regelungen zum Geschäftsgeheimnisschutz zwar für detailliert, in entscheidenden Punkten aber für vage. Insbesondere fehlten klare Kriterien, wann zusätzliche Schutzmaßnahmen erforderlich sind.",
          "Hinzu kommt die durchgängige Unbestimmtheit zentraler Begriffe. Denga fragt ausdrücklich, was etwa „most appropriate measures“, „adequate business continuity management“ oder „due care“ sein sollen. Diese offenen Standards erschwerten die Subsumtion und Haftungsbeurteilung erheblich, brächten aber – wie unbestimmte Tatbestandsmerkmale im Allgemeinen – erhebliche Flexibilität. Wünschenswert wäre nach seiner Einschätzung eine klare Verzahnung mit etablierten Marktstandards oder Stellungnahmen technischer Agenturen gewesen."
        ]
      },
      {
        titel: "Das eigentliche Wirksamkeitsproblem",
        absaetze: [
          "Nach Wendehorst liegt die Schwierigkeit weniger in der Auswahl der Maßnahmen als in ihrer Durchsetzung. Der Dateninhaber habe grundsätzlich keine Kontrolle darüber, an wen die Daten gelangen, und müsse sich mit dem vertraglichen Versprechen des Nutzers oder dritten Datenempfängers begnügen, bestimmte technische und organisatorische Schutzmaßnahmen anzuwenden.",
          "Das Problem sei eher die Gefahr, dass der Nutzer oder Datenempfänger die von ihm versprochenen Maßnahmen gar nicht erst treffen wird. Damit entscheidet über die Wirksamkeit nicht die Qualität der vereinbarten Maßnahmen, sondern ihre tatsächliche Einhaltung."
        ]
      },
      {
        titel: "Vorbereitungsaufwand auf Seiten des Dateninhabers",
        absaetze: [
          "Wendehorst weist darauf hin, dass die Pflichten nach Art. 4 und 5 DA auf Seiten der Dateninhaber umfangreiche technische und organisatorische Vorbereitungsmaßnahmen voraussetzen, die rückwirkend nicht mehr eingepreist werden können. Sie führt dies im Zusammenhang mit ihren Zweifeln an der Primärrechtskonformität an."
        ]
      }
    ],

    fazit: "Der Data Act benennt Beispiele für technische und organisatorische Maßnahmen, definiert aber keinen Maßstab dafür, wann sie erforderlich und wann sie ausreichend sind. Die Musterklauseln konkretisieren den Ablauf – Vorabidentifikation, Aufteilung der Schutzmaßnahmen, optionale Audits, gestaffelte Rechte bei Pflichtverletzungen –, schließen die entscheidende Lücke jedoch nicht: Nach Denga fehlen gerade klare Kriterien dafür, wann zusätzliche Schutzmaßnahmen erforderlich sind, und zentrale Begriffe bleiben unbestimmt. Hinzu kommt ein strukturelles Problem: Nach Wendehorst entscheidet über die Wirksamkeit nicht die Auswahl der Maßnahmen, sondern ihre Einhaltung durch den Nutzer – worauf der Dateninhaber keinen Zugriff hat. Die Frage nach den ausreichenden Maßnahmen lässt sich damit nach dem ausgewerteten Material nicht abstrakt beantworten.",

    empfehlungen: [
      "Maßnahmen an der Bedeutung des Geheimnisses ausrichten: Da ein abstrakter Maßstab fehlt, bleibt die Einzelfallbetrachtung. Je wertvoller das Geheimnis, desto eher dürften zusätzliche Maßnahmen erforderlich sein.",
      "Umsetzung prüfen, nicht nur vereinbaren: Nach dem ausgewerteten Material darf der Dateninhaber die tatsächliche Umsetzung abwarten. Da die Wirksamkeit von der Einhaltung abhängt, ist dieser Schritt zentral.",
      "Audit-Rechte erwägen: Die Musterklauseln sehen optional jährliche Audits durch unabhängige Dritte vor. Sie sind das einzige im ausgewerteten Material genannte Instrument, mit dem sich die Einhaltung überprüfen lässt.",
      "Nutzungsverbote vertraglich abbilden: Die vier Verbote der Musterklauseln wirken faktisch wie organisatorische Schutzmaßnahmen und sollten nicht übersehen werden.",
      "Vorbereitungsaufwand einplanen: Nach Wendehorst setzen die Pflichten umfangreiche technische und organisatorische Vorbereitungsmaßnahmen voraus, die sich nachträglich nicht mehr einpreisen lassen.",
      "Marktstandards beobachten: Denga hält eine Verzahnung mit etablierten Marktstandards für wünschenswert. Bis dahin kann die Orientierung an anerkannten Sicherheitsstandards helfen, die eigene Einschätzung zu begründen."
    ],

    literatur: [
      "Denga, Michael: Die Musterklauseln für den Data Act, RDi 2026, 181–189, insb. Rn. 16, 21, 48 f., 56.",
      "Wendehorst, Christiane: Zweifel an der Primärrechtskonformität des Data Act – löst der Digitale Omnibus die Probleme?, NJW 2026, 291–296, insb. Rn. 12 f.",
      "Kiefer / Schneider: Data Act und Geschäftsgeheimnisschutz in der Praxis, GRUR-Prax 2025, 648, insb. Rn. 13 f.",
      "Schreiber / Pommerening / Schoel: Der neue Data Act, 2. Aufl. 2024, S. 65 f."
    ],

    bewertungen: {
      haeufigkeit: {
        score: 3, konfidenz: "vorlaeufig",
        text: "Die TOM-Thematik wird in der ausgewerteten Literatur durchgehend behandelt, meist jedoch als Bestandteil der Darstellung des Verweigerungssystems. Denga geht am ausführlichsten auf die konkrete Ausgestaltung in den Musterklauseln ein. Eine eigenständige Auseinandersetzung mit der Frage, welche Maßnahmen erforderlich und ausreichend sind, enthält keine der Quellen.",
        anmerkung: "Vorschlag ohne Literaturauszählung. Bei der Auszählung ist auf Abgrenzung zur Frage nach den Verweigerungsvoraussetzungen zu achten."
      },
      aufwand: {
        score: 5, konfidenz: "vorlaeufig",
        text: "Erforderlich sind die Vorabidentifikation der Geheimnisse, die Vereinbarung technischer und organisatorischer Maßnahmen mit jedem Nutzer und Datenempfänger, deren Überprüfung sowie gegebenenfalls Audit-Verfahren. Wendehorst spricht von umfangreichen technischen und organisatorischen Vorbereitungsmaßnahmen, die rückwirkend nicht mehr eingepreist werden können. Das entspricht nach der verankerten Skala einem grundlegenden technischen und organisatorischen Umbau."
      },
      streit: {
        score: 2, konfidenz: "vorlaeufig",
        text: "In der ausgewerteten Literatur ist kein Positionenstreit darüber erkennbar, welche Maßnahmen erforderlich sind. Die Kritik richtet sich übereinstimmend gegen das Fehlen eines Maßstabs. Es handelt sich damit eher um eine offene als um eine umstrittene Frage."
      },
      unsicherheit: {
        score: 5, konfidenz: "vorlaeufig",
        text: "Denga stellt ausdrücklich fest, dass klare Kriterien fehlen, wann zusätzliche Schutzmaßnahmen erforderlich sind, und dass zentrale Begriffe wie „most appropriate measures“ durchgängig unbestimmt bleiben. Eine Verzahnung mit etablierten Marktstandards oder Stellungnahmen technischer Agenturen hält er für wünschenswert, aber nicht erfolgt. Damit fehlt es sowohl an einer normativen Konkretisierung als auch an einem außerrechtlichen Referenzmaßstab."
      },
      bussgeld: {
        score: 3, konfidenz: "vorlaeufig",
        text: "Unmittelbar sanktionsbewehrt dürfte weniger die Auswahl der Maßnahmen sein als die daran anknüpfende Entscheidung: Wer die Maßnahmen des Nutzers zu Unrecht für unzureichend hält und deshalb verweigert, erfüllt die Bereitstellungspflicht nicht. Da der Maßstab unklar ist, besteht ein erhöhtes Risiko einer Fehleinschätzung.",
        anmerkung: "Der Sanktionsrahmen wurde nicht anhand einer Quelle geprüft."
      },
      haftung: {
        score: 4, konfidenz: "vorlaeufig",
        text: "Erweisen sich die Maßnahmen als unzureichend und wird das Geheimnis verwertet, ist der Dateninhaber nach Wendehorst auf Schadensersatzansprüche beschränkt und trägt das volle Prozessrisiko; die Befriedigung scheitert häufig an Auffindbarkeit oder Solvenz des Schuldners. Hinzu kommt bei Drittgeheimnissen eine mögliche Haftung gegenüber Zulieferern.",
        anmerkung: "Die Haftung gegenüber Zulieferern ergibt sich aus dem Projekt-Orientierungsdokument (Kiefer/Schneider, Schritt „Bewerten“) und wurde nicht am Original geprüft."
      }
    }
  }
];

/* Hinweise, die unter der Matrix erscheinen */
const ABSCHLUSSHINWEIS = "Die Heat Map ist im Rahmen des Forschungsprojekts Data Act Pioneer entstanden und bildet eine erste Einschätzung ab, wie sie sich aus unserer bisherigen Forschungsarbeit ergeben hat. Sie versteht sich als fortlaufend weiterentwickeltes Arbeitsergebnis, nicht als abschließende rechtliche Bewertung.";

const DISCLAIMER = "Die dargestellten Werte und Begründungen sind eine plausible Einschätzung als Diskussionsgrundlage, keine validierte Literaturauswertung. Die Auswahl der Rechtsfragen ist bewusst auf die Relevanz für das Projekt Data Act Pioneer beschränkt – es bestehen darüber hinaus weitere Themen und Unsicherheiten.";
