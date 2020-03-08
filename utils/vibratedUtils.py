# -*- coding: utf-8 -*-
"""
Created on Mon Nov  4 09:11:52 2019

@author: Leo
"""
import os
import pickle
import sys
import traceback

def savePickleModel(savePath, modelName, model,logFile):
    
    try:
        if not os.path.exists(savePath): os.makedirs(savePath) 
        with open(savePath+ '\\' + modelName + ".pickle", 'wb') as f:
            pickle.dump(model, f)               
            
    except Exception as e:
        logFile.error(logErrorMsg(e))
        
def loadPickleModel(savePath, modelName,logFile):
        
    try:
        model=savePath+ '\\' + modelName+ '.pickle'
        if os.path.isfile(model):
            with open(model, 'rb') as f:
                return pickle.load(f) 
        else:
            logFile.warning(model+": could not find correspond file")
            return None
        
    except Exception as e:
        logFile.error(logErrorMsg(e))


def logErrorMsg(e):
    
    error_class = e.__class__.__name__ #取得錯誤類型
    detail = e.args[0] #取得詳細內容
    cl, exc, tb = sys.exc_info() #取得Call Stack
    lastCallStack = traceback.extract_tb(tb)[0] #取得Call Stack的最後一筆資料
    fileName = lastCallStack[0] #取得發生的檔案名稱
    lineNum = lastCallStack[1] #取得發生的行號
    funcName = lastCallStack[2] #取得發生的函數名稱
    errMsg = "File \"{}\", line {}, in {}: [{}] {}".format(fileName, lineNum, funcName, error_class, detail)
    return errMsg