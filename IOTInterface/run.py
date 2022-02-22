#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu Oct 29 13:59:57 2020

@author: pi
"""

#start web server
from app import app

if __name__=="__main__":
    app.run(host="0.0.0.0",debug=True)       