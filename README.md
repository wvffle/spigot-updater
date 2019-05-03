spigot-updater
---
sup is a minecraft server updater. It uses yivesmirror to download cores. Default core is paper

## Usage

```
Usage: sup [options]

Options:
  -V, --version       output the version number
  -c, --core [core]   server core to be updated
  -v, --mc [version]  minecraft version
  --core-list         output server core list
  -h, --help          output usage information
```

## Example startup script

```bash
#!/bin/bash

# Start particular version
[[ "$#" -eq 1 ]] && {
  sup -v $1
}

# Start latest version
[[ "$#" -eq 0 ]] && {
  sup
}

cp cores/paper-$VERSION.jar server.jar
java -Xmx1G -Xms1G -jar server.jar
```
