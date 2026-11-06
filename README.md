# IG DM Links

Chromium-Erweiterung (Manifest V3), die in Instagram Web die Link-Buttons automatisierter Direktnachrichten anzeigt, z. B. von ManyChat oder Boosend („Link abrufen“, „Guide öffnen“).

Instagram Web empfängt diese Buttons (`cta_buttons` mit `action_url`) bereits, stellt sie aber nicht dar. Laut Meta-Doku sind Button- und Generic-Templates „not available in the web version“. Die Erweiterung liest die Daten aus den GraphQL-Antworten, die die Seite ohnehin erhält, und setzt klickbare Links unter die passende Nachricht.

## Was sie tut und was nicht

- Liest nur mit. Sie sendet, speichert und klickt nichts.
- Braucht keine Berechtigungen und läuft nur auf `www.instagram.com`.
- Zeigt nur Buttons mit Web-Link. Buttons, die eine Antwort in deinem Namen senden würden (Postback, Quick Reply), werden bewusst nicht angezeigt.

## Installation (Vivaldi, Chrome, andere Chromium-Browser)

1. `vivaldi://extensions` bzw. `chrome://extensions` öffnen.
2. **Entwicklermodus** einschalten.
3. **Entpackte Erweiterung laden** und diesen Ordner auswählen.
4. Offene Instagram-Tabs neu laden.

## Grenzen

- Nachrichten, die eintreffen, während der Chat schon offen ist, bekommen ihren Button vermutlich erst nach einem Neuladen (F5).
- Karten ohne Text (nur Bild und Button) werden nicht erkannt.
- Baut auf Instagrams aktuellem Datenformat und Seitenaufbau auf und kann bei Änderungen ohne Vorwarnung aufhören zu funktionieren.
