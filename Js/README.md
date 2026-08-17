# El Pollo Loco

Ein 2D Jump-and-Run-Spiel, entwickelt mit HTML, CSS und JavaScript.

## Projektstruktur

El-Pollo-Loco/

```
index.html              Einstiegspunkt des Spiels

js/
    game.js             Spielsteuerung und Game Loop

levels/
    level1.js           Aufbau und Inhalte von Level 1

models/
    character.class.js  Spieler-Charakter
    chicken.class.js    Gegner: Chicken
    endboss.class.js    Endboss
    coin.class.js       Münzen
    bottle.class.js     Flaschen
    cloud.class.js      Wolken
    bird.class.js       Vögel
    world.class.js      Spielwelt und Kollisionen
    level.class.js      Level-Verwaltung
    keyboard.class.js   Tastatursteuerung
    status-bar.class.js Lebensanzeige
    throwable-object.class.js  Wurfbare Flaschen
    background-object.class.js Hintergrund
    movable-object.class.js Bewegliche Objekte
    drawable-object.class.js Zeichnen der Objekte

img/
    Spielgrafiken, Hintergründe und Charaktere

style.css               Gestaltung des Spiels
```

## Lokal starten

Das Projekt kann direkt über die `index.html` geöffnet werden.

Alternativ kann ein lokaler Server verwendet werden.

Beispiel mit Python:

```
python3 -m http.server
```

Anschließend im Browser öffnen:

```
http://localhost:8000
```

## Steuerung

A / Pfeil links       Nach links bewegen

D / Pfeil rechts      Nach rechts bewegen

Leertaste             Springen

F                     Flasche werfen

## Spiel

Im Spiel bewegt sich der Spieler durch das Level.

Dabei können Münzen gesammelt, Gegner besiegt und Flaschen zum Werfen eingesammelt werden.

Am Ende des Levels wartet der Endboss.

## Technologien

HTML

CSS

JavaScript

## Browser-Support

Getestet mit aktuellen Versionen von:

Chrome

Firefox

Safari

Microsoft Edge

Das Spiel ist für Desktop und mobile Geräte ausgelegt.
