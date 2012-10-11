#!/usr/bin/env python

import os
import sys

package_dir = "packages"
package_dir_path = os.path.join(os.path.dirname(__file__), package_dir)
sys.path.insert(0, package_dir_path)

import bottle
from app import views

if len(sys.argv) > 1 and sys.argv[1] == 'dev':
  bottle.debug(True)
  bottle.run(reloader=True, host='127.0.0.1')
else:
  bottle.run(host='0.0.0.0')
