# -*- coding: utf-8 -*-
"""
Created on Fri Nov  8 11:23:36 2019

@author: Leo
"""

import datetime
from sklearn import preprocessing
from algorithmCollection.OneClassSVMAlg import OneClassSVMAlg
from utils.vibratedUtils import loadPickleModel,savePickleModel,logErrorMsg

def OneClassSVMProcess(data, config,logFile):
    
    try:
        nuVal = float(config["train"]["nuVal"])
        savePath = config["train"]["savePath"]
        
        #normalize模型
        norModelPath =config["train"]["norModelPath"]
        saveNorModelName = config["train"]["saveNorModelName"]
        algorithmName='OneClassSVM'
        normalModel = loadPickleModel(norModelPath,saveNorModelName,logFile)
        tempModel=None
        if normalModel==None:
            std_scaler = preprocessing.StandardScaler()
            tempModel = std_scaler.fit(data)
            dataScaled = tempModel.transform(data)
        else:
            dataScaled = normalModel.transform(data)
            
        #建模
        oneClassSVM= OneClassSVMAlg(dataScaled, nuVal, logFile)
        
        #儲存模型
        modelName = datetime.datetime.now().strftime('%Y%m%d%H')+algorithmName
        savePickleModel(savePath, modelName, oneClassSVM, logFile)
        if tempModel!=None:
            saveScaleModelName = config["train"]["saveScaleModelName"] 
            savePickleModel(savePath, saveScaleModelName, tempModel, logFile)

    except Exception as e:
        logFile.error(logErrorMsg(e))