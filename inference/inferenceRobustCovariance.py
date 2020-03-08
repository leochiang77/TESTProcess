# -*- coding: utf-8 -*-
"""
Created on Thu Jan 16 10:59:30 2020

@author: Leo
"""

import pandas as pd
import time
from utils.vibratedUtils import loadPickleModel,logErrorMsg

def inferenceRobustCovariance(data, config,logFile):
    
    try:
        robustCovarianceModel =config["start"]["robustCovarianceModel"]
        robustCovarianceModel=robustCovarianceModel.strip()
        saveModelPath =config["start"]["savePath"]
        
        refModel=None
        refModel = loadPickleModel(saveModelPath, robustCovarianceModel, logFile)              
        
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