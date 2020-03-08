# -*- coding: utf-8 -*-
"""
Created on Fri Nov  8 11:29:06 2019

@author: Leo
"""

import datetime
from sklearn import svm
from utils.vibratedUtils import logErrorMsg
import warnings
warnings.filterwarnings('ignore')

def OneClassSVMAlg(inputData, nuVal, logFile):
    
    try:
        start_time = datetime.datetime.now()
        
        #OneClassSVM建模
        clf = svm.OneClassSVM(nu=nuVal, kernel='rbf')
        clf.fit(inputData)
        
        end_time=datetime.datetime.now()
        msg="model %s created successfully, cost time: %s seconds ---" % ("OneClassSVM",(end_time - start_time))
        logFile.info(msg)
        
        return clf
    
    except Exception as e:
        logFile.error(logErrorMsg(e))