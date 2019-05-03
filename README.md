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
VERSION=$1

[[ "$#" -eq 0 ]] && {
  VERSION="1.12.2"
}

sup -v $VERSION -c $CORE
cp cores/paper-$VERSION.jar server.jar
java -Xmx1G -Xms1G -jar server.jar
```
