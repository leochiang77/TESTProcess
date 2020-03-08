# -*- coding: utf-8 -*-
"""
Created on Tue Nov 12 13:30:31 2019

@author: Leo
"""
import pandas as pd
import time
from utils.vibratedUtils import loadPickleModel,logErrorMsg

def inferenceOneClassSVM(data, config,logFile):
    
    try:
        oneClassSVMModel =config["start"]["oneClassSVMModel"]
        oneClassSVMModel=oneClassSVMModel.strip()
        saveModelPath =config["start"]["savePath"]
        
        refModel=None
        refModel = loadPickleModel(saveModelPath, oneClassSVMModel, logFile)              
        
        if refModel!=None:
            for i in data:
                y_pred = refModel.predict(pd.DataFrame(i).T)
                if y_pred[0] != -1:
                    print("正常")
                else:
                    print("異常")
                time.sleep(2)

    except Exception as e:
        logFile.error(logErrorMsg(e))