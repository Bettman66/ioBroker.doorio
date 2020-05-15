![Logo](../admin/doorio.png)
# ioBroker.doorio

## Was kann man mit dem Adapter machen ?
Der Adapter ist das Verbindungsglied zwischen einer selbstgebauten Türsprechanlage und ioBroker. Auf der Türsprechstelle läuft der Sip-Client Baresip als Service, um bei Ereignissen wie eine Betätigung des Klingelknopfes einen Telefonanruf zu tätigen. Baresip ist in vielen auf Debian aufgebaute Distributionen enthalten und kann deshalb auf unterschiedlichen Hardwareplattformen eingesetzt werden. Es bietet sich natürlich ein RPI3 oder RPI4 an, da er schon GPIO-Pins besitzt. Es wäre aber auch ein PC gekoppelt mit einem Arduino oder einem Wemos mini vorstellbar. Die Kommunikation mit dem ioBroker läuft über TCP/Socket, wobei der Port einstellbar ist.

## Hardware Türsprechstelle
* Computer (RPI,Odroid,PC,..)
* Lautsprecher,Mikrofon,Sounddevice (Plantronics 610 USB, Jabra 410, ..)

## Software Türsprechstelle
* Debian (Raspian, ..)
* Baresip

mit diesen wenigen Komponenten ist es schon möglich eine Sprechstelle aufzubauen.

## Wie wird der Ruf ausgelöst ?
Jeder Eingang (z.B. sonoff, z-wave, HM, rpi-gpio, piface, .. ) im ioBroker kann ein Ruf auslösen. Es muss nur das vorhandene Eingangsobjekt im DoorIO-Adapter dem Klingeleingang zugewiesen werden.

## Kann auch was angesteuert werden ?
Ja, es gibt Events denen man Ausgangsobjekte zuweisen kann.
* Ruf aktiv
* Ruf aufgebaut
* Ruf beendet
* DTMF Toncode

## Links
* https://forum.iobroker.net/topic/23413/ich-baue-eine-t%C3%BCrsprechstelle-ohne-cloud
* https://forum.iobroker.net/topic/22746/test-adapter-doorio-v0-0-x