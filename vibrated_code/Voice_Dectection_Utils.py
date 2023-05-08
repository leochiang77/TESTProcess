
# coding: utf-8

# In[1]:

import os
import pickle
import pandas as pd
import warnings

class VoiceDetectionUtils(object):
    
    """函式功能：

    初始工具物件

    Parameters
    ----------
        logFile :object
            紀錄log物件

    Returns
    ------
        object
            資料庫物件
    """
    def __init__(self, logFile):
        self.logFile = logFile
    
    """函式功能：
    
    轉換資料格式

    Parameters
    ----------
        data :dataframe
            輸入資料

    Returns
    ------
        DataFrame
            轉換後資料
    """
    def transRawData(self, data):
        
        try:
            
            #只取band資料
            output= data.iloc[:,0:76]

            #改變columns名稱
            outputRenameCols = dict()
            for item in output.columns:
                outputRenameCols[item]=str(item.split("_")[1])

            output = output.rename(columns=outputRenameCols)

            #按欄位排序
            outputTrans = output[sorted(output.columns, key=lambda x: int(x))]

            return outputTrans
        
        except Exception as e:
            self.logFile.error(e)
    

    """函式功能：

    儲存模型

    Parameters
    ----------
        savePath :string
            儲存路徑
    
        modelName :string
            模型名稱

        model :object
            模型物件

    Returns
    ------
        None      
    """
    def savePickleModel(self,savePath, modelName, model):
        
        try:
            if os.path.isdir(savePath):
                with open(savePath+ '/' + fileName + '.pickle', 'wb') as f:
                    pickle.dump(model, f)
                    
            else:
                self.logFile.warning("資料夾尚未建立")
                
        except Exception as e:
            self.logFile.error(e)

    """函式功能：

    執行SQL語句

    Parameters
    ----------
        savePath :string
            儲存路徑
    
        modelName :string
            模型名稱

    Returns
    ------
        object
            模型物件  
    """
    def loadPickleModel(self,savePath, modelName):
        
        try:
            if os.path.isdir(savePath):
                with open(savePath+ '/' + modelName+ '.pickle', 'rb') as f:
                    return pickle.load(f) 
            else:
                self.logFile.warning("資料夾尚未建立")
                
        except Exception as e:
            self.logFile.error(e)

    """函式功能：

    匯入模型並預測

    Parameters
    ----------
        savePath :string
            儲存路徑

        modelDate :string
            模型儲存日期

        data :DataFrame
            欲預測資料

    Returns
    ------
        DataFrame
            時間,預測結果0->正常, 1->異常 
    """

    def loadEnsembleModelPredict(self, savePath, modelDate, data):

        rf=None
        svm=None
        xgb=None

        try:
            
            #轉換資料格式
            outputTrans = self.transRawData(data)

            #正規化
            modelName = modelDate+'normal'
            if os.path.isfile(savePath+'/'+modelName+ '.pickle'):
                normal = self.loadPickleModel(savePath,modelName)
                outputTransNormal = pd.DataFrame(normal.transform(outputTrans))

                #輸入模型
                modelName = modelDate+'rf'
                if os.path.isfile(savePath+'/'+modelName+ '.pickle'):
                    rf = self.loadPickleModel(savePath, modelName)

                modelName = modelDate+'svm'
                if os.path.isfile(savePath+'/'+modelName+ '.pickle'):
                    svm = self.loadPickleModel(savePath, modelName)

                modelName = modelDate+'xgb'
                if os.path.isfile(savePath+'/'+modelName+ '.pickle'):
                    xgb = self.loadPickleModel(savePath, modelName)

                #輸入單筆資料
                resultList = []
                for index,item in outputTransNormal.iterrows():
                    result=[]
                    datatemp = pd.DataFrame(item).T
                    if not xgb==None:
                        warnings.filterwarnings('ignore')
                        result.append(xgb.predict(datatemp.iloc[:, 0:76])[0])
                    if not svm==None:
                        result.append(svm.predict(datatemp.iloc[:, 0:76])[0])
                    if not rf==None:
                        result.append(rf.predict(datatemp.iloc[:, 0:76])[0])
                    resultList.append((sum(result)>len(result)*0.5)*1)

                resultDf = pd.DataFrame(resultList)
                resultDf["rec_datetime"]=data["rec_datetime"]
                return resultDf
            
            else:
                self.logFile.warning("找不到正規化模型")

        except Exception as e:
            self.logFile.error(e)

