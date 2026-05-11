# TMDB Project

TMDB Project e' una web app pensata per consultare informazioni su film e contenuti cinematografici usando i dati forniti da TMDB, The Movie Database.

L'obiettivo del progetto e' creare un'interfaccia semplice per cercare film, leggere le informazioni principali e visualizzare dati utili come titolo, descrizione, immagine, valutazione e altri dettagli disponibili tramite API.

## Obiettivi del progetto

- Collegarsi all'API di TMDB
- Recuperare dati aggiornati sui film
- Permettere la ricerca di contenuti cinematografici
- Mostrare le informazioni principali in modo chiaro
- Organizzare il codice come base per una web app espandibile

## Funzionalita principali

- Ricerca di film tramite titolo
- Visualizzazione dei risultati restituiti da TMDB
- Dettagli del film, come titolo, trama, data di uscita e valutazione
- Gestione delle immagini dei film tramite i poster forniti da TMDB
- Struttura predisposta per aggiungere nuove funzionalita in futuro

## Possibili sviluppi futuri

Il progetto puo' essere esteso con funzionalita aggiuntive, ad esempio:

- Pagina di dettaglio per ogni film
- Lista dei film popolari
- Lista dei film piu' votati
- Film in uscita
- Salvataggio dei preferiti
- Filtri per genere, anno o valutazione
- Miglioramento dell'interfaccia grafica
- Gestione degli errori durante le chiamate API
- Stato di caricamento durante il recupero dei dati

## API utilizzata

Il progetto utilizza TMDB, una piattaforma che mette a disposizione dati su film, serie TV, attori, immagini, valutazioni e informazioni correlate.

Sito ufficiale:

https://www.themoviedb.org/

Documentazione API:

https://developer.themoviedb.org/docs

## Configurazione

Per usare il progetto e' necessario avere una API key di TMDB.

1. Crea un account su TMDB
2. Accedi al tuo profilo
3. Vai nella sezione dedicata agli sviluppatori
4. Richiedi o genera una API key
5. Inserisci la chiave nel progetto secondo la configurazione prevista

Esempio di variabile d'ambiente:

```env
TMDB_API_KEY=la_tua_api_key
```

Se il progetto usa un frontend moderno, la variabile potrebbe avere un prefisso specifico, ad esempio:

```env
VITE_TMDB_API_KEY=la_tua_api_key
```

## Struttura del progetto

La struttura puo' variare in base alla tecnologia usata, ma in generale il progetto contiene:

- file sorgenti dell'applicazione
- componenti o pagine dell'interfaccia
- logica per comunicare con l'API TMDB
- eventuali file di configurazione
- file README con la documentazione del progetto

## Come avviare il progetto

Installa prima le dipendenze, se il progetto le prevede:

```bash
npm install
```

Avvia poi il server di sviluppo:

```bash
npm run dev
```

In alternativa, se il progetto e' composto solo da file HTML, CSS e JavaScript, puo' essere sufficiente aprire il file HTML principale nel browser.

## Repository GitHub

Repository del progetto:

https://github.com/FabioBl77/tmdb-project.git

## Note

Questo progetto e' stato creato a scopo di studio e pratica, con l'obiettivo di imparare a lavorare con API esterne, organizzare una repository GitHub e costruire una piccola applicazione web basata su dati reali.
