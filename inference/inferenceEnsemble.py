# -*- coding: utf-8 -*-
"""
Created on Wed Nov  6 17:04:30 2019

@author: Leo
"""
import pandas as pd
import numpy as np
import time
from utils.vibratedUtils import loadPickleModel,logErrorMsg

def inferenceEnsemble(data, config,logFile):
    
    try:
        ensembleModels =config["start"]["ensembleModels"]
        ensembleModelsArr=ensembleModels.split(',')
        saveModelPath =config["start"]["savePath"]
        
        if len(ensembleModelsArr) > 0:
            refModels=dict()
            pcaThreshold=0
            for modelName in ensembleModelsArr:
                modelName=modelName.strip()
                if "PCA" in modelName:
                    pcaThresholdFile =config["start"]["enPCAThresholdFile"]
                    with open(saveModelPath+'/'+pcaThresholdFile, 'r') as f:
                        pcaThreshold = float(f.read().strip())
                refModels[modelName] = loadPickleModel(saveModelPath, modelName, logFile)              
                
            for i in data:
                outputList=list()
                for key, value in refModels.items():
                    if "PCA" in key and pcaThreshold>0:
                        loadings_p = value.components_.T
                        eigenvalues = value.explained_variance_
                        hotelling_t2s = i.dot(loadings_p).dot(np.diag(eigenvalues ** -1)).dot(loadings_p.T).dot(i.T)
                        if hotelling_t2s < pcaThreshold:
                            outputList.append(1)
                    else:
                        y_pred_test = value.predict(pd.DataFrame(i).T)
                        if y_pred_test[0] != -1:
                            outputList.append(1)
                
                if np.sum(outputList)>0:
                    print("正常")
                else:
                    print("異常")
                time.sleep(2)
            
    except Exception as e:
        logFile.error(logErrorMsg(e))