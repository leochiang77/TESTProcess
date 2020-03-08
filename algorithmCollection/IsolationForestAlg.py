# -*- coding: utf-8 -*-
"""
Created on Thu Jan 16 10:37:57 2020

@author: Leo
"""

import datetime
from sklearn.ensemble import IsolationForest
from utils.vibratedUtils import logErrorMsg
import warnings
warnings.filterwarnings('ignore')

def IsolationForestAlg(inputData, nuVal, logFile):
    
    try:
        start_time = datetime.datetime.now()
        
        #OneClassSVM建模
        clf = IsolationForest(contamination=0.01)
        clf.fit(inputData)
        
        end_time=datetime.datetime.now()
        msg="model %s created successfully, cost time: %s seconds ---" % ("IsolationForest",(end_time - start_time))
        logFile.info(msg)
        
        return clf
    
    except Exception as e:
        logFile.error(logErrorMsg(e))