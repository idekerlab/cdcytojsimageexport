#!/bin/bash


docker run --rm -v `pwd`:`pwd` docker.io/coleslawndex/cdcytojsimageexport:0.0.1 `pwd`/original.cx --width 4096 --height 2048 > ha.b64

./base64topng.py ha.b64 ha.png
