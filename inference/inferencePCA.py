# -*- coding: utf-8 -*-
"""
Created on Tue Nov 12 11:35:37 2019

@author: Leo
"""
import numpy as np
import time
from utils.vibratedUtils import loadPickleModel,logErrorMsg

def inferencePCA(data, config,logFile):
    
    try:
        pcaModel =config["start"]["pcaModel"]
        pcaModel=pcaModel.strip()
        saveModelPath =config["start"]["savePath"]
        
        refModel=None
        pcaThreshold=0
        pcaThresholdFile =config["start"]["pcaThresholdFile"]
        with open(saveModelPath+'/'+pcaThresholdFile, 'r') as f:
            pcaThreshold = float(f.read().strip())
        refModel = loadPickleModel(saveModelPath, pcaModel, logFile)              
        
        if refModel!=None:
            for i in data:       
                loadings_p = refModel.components_.T
                eigenvalues = refModel.explained_variance_
                hotelling_t2s = i.dot(loadings_p).dot(np.diag(eigenvalues ** -1)).dot(loadings_p.T).dot(i.T)
                if hotelling_t2s < pcaThreshold:
                    print("正常")
                else:
                    print("異常")
                    
                time.sleep(2)
            
    except Exception as e:
        logFile.error(logErrorMsg(e))