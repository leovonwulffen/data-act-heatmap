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
    normen: "",
    bewertungen: {}
  },

  /* ---------- 2. Datenzugangsregelungen ---------- */
  {
    id: "anonymisierung",
    kategorie: "zugang",
    kurztitel: "Flucht in die Anonymisierung",
    frage: "Dürfen Dateninhaber ihre IoT-Systeme bewusst so gestalten, dass eine Zuordnung der erzeugten Daten zu konkreten Nutzern unmöglich wird, um Zugangsansprüche zu vermeiden?",
    normen: "",
    bewertungen: {}
  },
  {
    id: "access-by-design",
    kategorie: "zugang",
    kurztitel: "Data Access by Design vs. Datenzugangsanspruch",
    frage: "Wie verhalten sich die Pflicht zu „Data Access by Design“ nach Art. 3 I DA und der eigenständige Datenzugangsanspruch des Nutzers nach Art. 4 I DA zueinander?",
    normen: "Art. 3 I DA · Art. 4 I DA",
    bewertungen: {}
  },

  /* ---------- 3. Datenarten ---------- */
  {
    id: "abgeleitete-daten",
    kategorie: "datenarten",
    kurztitel: "Produktdaten vs. abgeleitete Daten",
    frage: "Wo verläuft die Grenze zwischen herausgabepflichtigen Produktdaten und den vom Datenzugriff ausgeschlossenen „abgeleiteten oder gefolgerten“ Daten?",
    normen: "",
    bewertungen: {}
  },
  {
    id: "mischdatensaetze",
    kategorie: "datenarten",
    kurztitel: "Mischdatensätze – personenbezogen / nicht-personenbezogen",
    frage: "Wie ist bei Datensätzen, die personenbezogene und nicht-personenbezogene Daten miteinander vermengen, die Grenze zwischen der Anwendbarkeit des Data Act und der DSGVO zu ziehen?",
    normen: "Art. 1 Abs. 5 DA",
    bewertungen: {}
  },

  /* ---------- 4. Data Act vs. DSGVO ---------- */
  {
    id: "rechtsgrundlage-drittdaten",
    kategorie: "dsgvo",
    kurztitel: "DSGVO-Rechtsgrundlage bei Drittdaten",
    frage: "Stellt der Data Act selbst eine datenschutzrechtliche Rechtsgrundlage (insb. als rechtliche Verpflichtung nach Art. 6 I 1 lit. c DS-GVO) für die Weitergabe von Daten unbeteiligter Dritter dar?",
    normen: "Art. 6 I 1 lit. c DSGVO",
    bewertungen: {}
  },
  {
    id: "verantwortlicher",
    kategorie: "dsgvo",
    kurztitel: "Verantwortlicher bei Drittweitergabe",
    frage: "Wer ist datenschutzrechtlich Verantwortlicher, wenn personenbezogene Daten aufgrund eines Anspruchs nach Art. 5 DA an Dritte weitergegeben werden?",
    normen: "Art. 5 DA",
    bewertungen: {}
  },

  /* ---------- 5. Geschäftsgeheimnisschutz & TOMs ---------- */
  {
    id: "geheimnis-verweigerung",
    kategorie: "geheimnis",
    kurztitel: "Geschäftsgeheimnis-Verweigerung",
    frage: "Unter welchen Voraussetzungen darf ein Dateninhaber die Datenherausgabe unter Berufung auf ein Geschäftsgeheimnis verweigern, ohne den Zugangsanspruch faktisch auszuhöhlen?",
    normen: "",
    bewertungen: {}
  },
  {
    id: "beweislast",
    kategorie: "geheimnis",
    kurztitel: "Darlegungs- und Beweislast",
    frage: "Wen trifft die Darlegungs- und Beweislast, wenn sich ein Dateninhaber auf ein Geschäftsgeheimnis beruft, um die Herausgabe zu verweigern oder einzuschränken?",
    normen: "",
    bewertungen: {}
  },
  {
    id: "toms",
    kategorie: "geheimnis",
    kurztitel: "TOMs: erforderlich und ausreichend",
    frage: "Welche technischen und organisatorischen Maßnahmen sind erforderlich und ausreichend, um Geschäftsgeheimnisse im Rahmen der Datenherausgabe wirksam zu schützen?",
    normen: "",
    bewertungen: {}
  }
];

/* Hinweise, die unter der Matrix erscheinen */
const ABSCHLUSSHINWEIS = "Die Heat Map ist im Rahmen des Forschungsprojekts Data Act Pioneer entstanden und bildet eine erste Einschätzung ab, wie sie sich aus unserer bisherigen Forschungsarbeit ergeben hat. Sie versteht sich als fortlaufend weiterentwickeltes Arbeitsergebnis, nicht als abschließende rechtliche Bewertung.";

const DISCLAIMER = "Die dargestellten Werte und Begründungen sind eine plausible Einschätzung als Diskussionsgrundlage, keine validierte Literaturauswertung. Die Auswahl der Rechtsfragen ist bewusst auf die Relevanz für das Projekt Data Act Pioneer beschränkt – es bestehen darüber hinaus weitere Themen und Unsicherheiten.";
