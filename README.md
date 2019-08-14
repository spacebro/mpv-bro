# MPV Bro

Control an mpv player over Spacebro

## Currently support following messages

- loadAndPlay

- loadPath

- play

- stop

- pause

- resume

Only `loadAndPlay` and `loadPath` accept argument. You must provide a local path where the client runs in order to load it and play it.
For instance you can send :

`loadAndPlay` with a data object like `'{"path":"/opt/share/myvideo.mp4", "options": {"inf":true}}'`

This will load the file myvideo and play it **infinitely**.

For instance with **clibro** : `emit loadAndPlay '{"path":"/opt/share/myvideo.mp4", "options": {"inf":true}}'`

You can also specify no infinity loop: `emit loadAndPlay '{"path":"/opt/share/myvideo.mp4", "options": {"inf":false}}'` or even omit the options : `emit loadAndPlay '{"path":"/opt/share/myvideo.mp4"}'`

You can then `play` / `pause` / `resume`. Watch out, if you stop, you won't be able to play again without sending a path like with `loadAndPlay`.



See the commands of mpv here
https://github.com/00SteinsGate00/Node-MPV/tree/Node-MPV-2#controlling-mpv