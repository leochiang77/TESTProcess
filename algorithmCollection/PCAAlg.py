# -*- coding: utf-8 -*-
"""
Created on Fri Nov  8 11:28:14 2019

@author: Leo
"""

import numpy as np
import datetime
from sklearn.decomposition import PCA
from utils.vibratedUtils import logErrorMsg
import warnings
warnings.filterwarnings('ignore')

#algorithm collection
def PCAAlg(inputData, ratio, logFile):
    
    try:
        start_time = datetime.datetime.now()
        
        #pca建模
        pca = PCA(n_components=ratio).fit(inputData)
        loadings_p = pca.components_.T
        eigenvalues = pca.explained_variance_
        #t-square
        hotelling_t2s = np.array([xi.dot(loadings_p)
                                    .dot(np.diag(eigenvalues ** -1))
                                    .dot(loadings_p.T)
                                    .dot(xi.T)
                                  for xi in inputData])
        threshold=np.max(hotelling_t2s)
        
        end_time=datetime.datetime.now()
        msg="model %s created successfully, cost time: %s seconds ---" % ("PCA",(end_time - start_time))
        logFile.info(msg)
        
        return pca, threshold
    
    except Exception as e:
            logFile.error(logErrorMsg(e))
