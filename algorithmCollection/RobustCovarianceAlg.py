# -*- coding: utf-8 -*-
"""
Created on Thu Jan 16 10:23:05 2020

@author: Leo
"""

import datetime
from sklearn.covariance import EllipticEnvelope
from utils.vibratedUtils import logErrorMsg
import warnings
warnings.filterwarnings('ignore')

#algorithm collection
def RobustCovarianceAlg(inputData, ratio, logFile):
    
    try:
        start_time = datetime.datetime.now()
        
        #OneClassSVM建模
        clf = EllipticEnvelope(contamination=0.01).fit(inputData)
        
        end_time=datetime.datetime.now()
        msg="model %s created successfully, cost time: %s seconds ---" % ("RobustCovariance",(end_time - start_time))
        logFile.info(msg)
        
        return clf
    
    except Exception as e:
        logFile.error(logErrorMsg(e))