# -*- coding: utf-8 -*-
from flask import Flask
import datetime
import os
import configparser
from logClass import LogObj
from utils.utils import logErrorMsg
import globalvars
globalvars.initialize()

#### set config and log #####################################
config = configparser.ConfigParser()
config.read('config.ini')
logFileName=config["logFile"]["LogFileName"]
logFileName=datetime.datetime.strftime(datetime.datetime.now(), '%Y%m%d')+logFileName
logFileSavePath = config["logFile"]["SavePath"]
if not os.path.exists(logFileSavePath): os.makedirs(logFileSavePath)
logFile = LogObj(logFileSavePath,logFileName)

try:
    #initial flask and argument
    app = Flask(__name__)
    app.config["JSON_AS_ASCII"] = False
    
    from app.routes import *

except Exception as e:
    if logFile:
        logFile.error(logErrorMsg(e))
        logFile.closeLogFile()

    

