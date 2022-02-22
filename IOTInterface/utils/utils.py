# -*- coding: utf-8 -*-
import traceback
import sys
from random import random

def logErrorMsg(e):
    
    error_class = e.__class__.__name__ #取得錯誤類型
    if e.args and e.args[0]:
        
        detail = e.args[0] #取得詳細內容
        cl, exc, tb = sys.exc_info() #取得Call Stack
        lastCallStack = traceback.extract_tb(tb)[0] #取得Call Stack的最後一筆資料
        fileName = lastCallStack[0] #取得發生的檔案名稱
        lineNum = lastCallStack[1] #取得發生的行號
        funcName = lastCallStack[2] #取得發生的函數名稱
        errMsg = "File \"{}\", line {}, in {}: [{}] {}".format(fileName, lineNum, funcName, error_class, detail)
    else:
        errMsg = e
    
    return errMsg

def getrandomData():
    
    result={}
    temp = 26 + (random()*(28-25))
    humidity = 63 + (random()*(65-60))
    light = 100 + (random()*(500-0))
    vibration = 0 + (random()*(3-(-3)))
    
    result={"temp":round(temp,2),"humidity":round(humidity,2),"light":round(light,2),"vibration":round(vibration,2)}
    
    return result

