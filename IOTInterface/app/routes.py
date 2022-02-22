# -*- coding: utf-8 -*-

# -*- coding: utf-8 -*-

import os
import datetime
import globalvars
from app import app ,logFile
from utils.utils import logErrorMsg,getrandomData
import threading as td
from flask import jsonify, send_from_directory, make_response
from flask import request, render_template, flash, redirect, url_for,session

basePath = "C:/Users/Leo/Desktop/auo/R2RDashbord/data/"

@app.route("/")
def index():
    
    title="IOT_Dashborad"
    return render_template("index.html",title=title)

@app.route("/getRefreshData", methods=["GET"])
def getRefreshData():
    try:
        result={}
        fileLocation = os.path.join(basePath,"AM2015.txt")
        if os.path.exists(fileLocation):
            with open(fileLocation,'r') as f:
                result["am2015"] = f.read()
        
        fileLocation = os.path.join(basePath,"arduinovibe.txt")
        if os.path.exists(fileLocation):
            with open(fileLocation,'r') as f:
                result["arduinovibe"] = f.read()
        
        fileLocation = os.path.join(basePath,"Current.txt")
        if os.path.exists(fileLocation):
            with open(fileLocation) as f:
                result["current"] = f.read()
        
        fileLocation = os.path.join(basePath,"DS.txt")
        if os.path.exists(fileLocation):
            with open(fileLocation,'r') as f:
                result["ds"] = f.read()

        return jsonify(result)
    except Exception as e:
        logFile.error(logErrorMsg(e))

def loginfo(text):
    with open("./log.txt",'a') as f:
        f.write(text)
    
