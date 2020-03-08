# -*- coding: utf-8 -*-
"""
Created on Fri Nov  8 11:22:41 2019

@author: Leo
"""

import datetime
from sklearn import preprocessing
from algorithmCollection.PCAAlg import PCAAlg
from utils.vibratedUtils import loadPickleModel,savePickleModel,logErrorMsg

def PCAProcess(data, config,logFile):
    
    try:
        pcaRatio = float(config["train"]["pcaRatio"])
        savePath = config["train"]["savePath"] 
        
        #normalize模型
        norModelPath =config["train"]["norModelPath"]
        saveNorModelName = config["train"]["saveNorModelName"]
        algorithmName='PCA'
        normalModel = loadPickleModel(norModelPath,saveNorModelName,logFile)
        tempModel=None
        if normalModel==None:
            std_scaler = preprocessing.StandardScaler()
            tempModel = std_scaler.fit(data)
            dataScaled = tempModel.transform(data)
        else:
            dataScaled = normalModel.transform(data)
            
        #建模
        pca, threshold = PCAAlg(dataScaled, pcaRatio, logFile)
        
        #儲存模型
        modelName = datetime.datetime.now().strftime('%Y%m%d%H')+algorithmName
        savePickleModel(savePath, modelName, pca, logFile)
        with open(savePath+ '/' + modelName + '.txt','w') as file:
             file.write(str(threshold))      
        if tempModel!=None:
            savePickleModel(savePath, saveNorModelName, tempModel, logFile)
    
    except Exception as e:
        logFile.error(logErrorMsg(e))