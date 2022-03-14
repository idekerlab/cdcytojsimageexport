#!/usr/bin/env python

import sys
import base64
from PIL import Image
from io import BytesIO

with open(sys.argv[1], 'r') as f:
    data = f.read()

im = Image.open(BytesIO(base64.b64decode(data[22:])))
im.save(sys.argv[2], 'PNG')
