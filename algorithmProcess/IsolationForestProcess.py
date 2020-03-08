# -*- coding: utf-8 -*-
"""
Created on Thu Jan 16 10:36:13 2020

@author: Leo
"""

import datetime
from sklearn import preprocessing
from algorithmCollection.IsolationForestAlg import IsolationForestAlg
from utils.vibratedUtils import loadPickleModel,savePickleModel,logErrorMsg

def IsolationForestProcess(data, config,logFile):
    
    try:
        if_nuVal = float(config["train"]["if_nuVal"])
        savePath = config["train"]["savePath"]
        
        #normalize模型
        norModelPath =config["train"]["norModelPath"]
        saveNorModelName = config["train"]["saveNorModelName"]
        algorithmName='IsolationForest'
        normalModel = loadPickleModel(norModelPath,saveNorModelName,logFile)
        tempModel=None
        if normalModel==None:
            std_scaler = preprocessing.StandardScaler()
            tempModel = std_scaler.fit(data)
            dataScaled = tempModel.transform(data)
        else:
            dataScaled = normalModel.transform(data)
            
        #建模
        isolationForest= IsolationForestAlg(dataScaled, if_nuVal, logFile)
        
        #儲存模型
        modelName = datetime.datetime.now().strftime('%Y%m%d%H')+algorithmName
        savePickleModel(savePath, modelName, isolationForest, logFile)
        if tempModel!=None:
            saveScaleModelName = config["train"]["saveScaleModelName"] 
            savePickleModel(savePath, saveScaleModelName, tempModel, logFile)

    except Exception as e:
        logFile.error(logErrorMsg(e))