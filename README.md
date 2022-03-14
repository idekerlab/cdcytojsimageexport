# cdcytojsimageexport

ISSUES:

* Image exported is base64 encoded which is not very efficient

* Layout is not fitting into viewport

To RUN:

```Bash
yarn dockerbuild
docker run --rm -v `pwd`:`pwd` docker.io/coleslawndex/cdcytojsimageexport:0.0.1 `pwd`/original.cx --width 2000 --height 1000 > ha

# this script requires python 3 and PIL aka pillow image library
python base64topng.py ha ha.png
```

Links of interest:

https://github.com/cytoscape/cytosnap

https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker

