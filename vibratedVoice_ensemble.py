
# coding: utf-8
import os
import pandas as pd
from configparser import ConfigParser
from LogClass import LogObj

from utils.vibratedUtils import loadPickleModel, logErrorMsg
from inference.inferenceEnsemble import inferenceEnsemble
from inference.inferencePCA import inferencePCA
from inference.inferenceOneClassSVM import inferenceOneClassSVM
from inference.inferenceIsolationForest import inferenceIsolationForest
from inference.inferenceRobustCovariance import inferenceRobustCovariance
from algorithmProcess.OneClassSVMProcess import OneClassSVMProcess
from algorithmProcess.PCAProcess import PCAProcess
from algorithmProcess.RobustCovarianceProcess import RobustCovarianceProcess
from algorithmProcess.IsolationForestProcess import IsolationForestProcess
import warnings
warnings.filterwarnings('ignore')

#argument
#reference https://medium.com/@sean22492249/python-argpase-%E7%9A%84%E4%BB%8B%E7%B4%B9-python-%E7%9A%84%E5%BC%95%E6%95%B8-26d54db52b1f
import argparse

def process_command():
    parser = argparse.ArgumentParser()
    #選擇訓練或啟用
    group = parser.add_mutually_exclusive_group()
    group.add_argument('--train', action='store_true', default=False, help='Choose train')
    group.add_argument('--start', action='store_true', default=False, help='Choose start')
    
    #訓練相關
    #ex: --train --pca_train 
    g1 = parser.add_argument_group('train', '訓練')
    
    #訓練相關演算法
    g1.add_argument('--pca_train', action='store_true', default=False, help='train by using pca algorithm')
    g1.add_argument('--oneClassSVM_train', action='store_true', default=False, help='train by using OneClassSVM algorithm')
    g1.add_argument('--isolationForest_train', action='store_true', default=False, help='train by using IsolationForest algorithm')
    g1.add_argument('--robustCovariance_train', action='store_true', default=False, help='train by using RobustCovariance algorithm')
    g1.add_argument('--ensemble_train', action='store_true', default=False, help='train by using Ensemble algorithm(PCA,OneClassSVM)')
    
    #啟用相關
    g2 = parser.add_argument_group('start', '啟用')

    #啟用相關演算法
    g2.add_argument('--pca', action='store_true', default=False, help='use pca algorithm')
    g2.add_argument('--oneClassSVM', action='store_true', default=False, help='use OneClassSVM algorithm')
    g2.add_argument('--isolationForest', action='store_true', default=False, help='use IsolationForest algorithm')
    g2.add_argument('--robustCovariance', action='store_true', default=False, help='use RobustCovariance algorithm')
    g2.add_argument('--ensemble', action='store_true', default=False, help='use Ensemble algorithm(PCA,OneClassSVM)')
    
    return parser.parse_args()


#init
if __name__ == '__main__':
    
    try:
        #import configuration
        config = ConfigParser()
        configName="config.ini"
        config.read(configName)
        logFileName="logFile"
        logFileSavePath = config["logFile"]["savePath"]
            
        args = process_command()
        if not os.path.exists(logFileSavePath): os.makedirs(logFileSavePath) 
        if args.train:
            #init log
            logFile = LogObj(logFileSavePath,logFileName+"_train")
            
            #輸入資料(須依實際狀況調整)--------------------------------------------
            inputData =config["train"]["inputData"]
            df = pd.read_excel(inputData)
            normal_df = df[df["label"]==0]
            d_normal_df=normal_df.drop(["id","file_name","rec_datetime","label"], axis=1)
            #------------------------------------------------------------------
            
            if args.pca_train:
                PCAProcess(d_normal_df,config,logFile)
                
            elif args.oneClassSVM_train:
                OneClassSVMProcess(d_normal_df, config,logFile)
            
            elif args.robustCovariance_train:
                RobustCovarianceProcess(d_normal_df, config,logFile)
                
            elif args.isolationForest_train:
                IsolationForestProcess(d_normal_df, config,logFile)
                
            elif args.ensemble_train:
                PCAProcess(d_normal_df,config,logFile)
                OneClassSVMProcess(d_normal_df, config,logFile)
                RobustCovarianceProcess(d_normal_df, config,logFile)
                IsolationForestProcess(d_normal_df, config,logFile)
                
        elif args.start:
            #init log
            logFile = LogObj(logFileSavePath,logFileName+"_start")
            
            #輸入資料(須依實際狀況調整)-------------------------------------------
            inputData =config["start"]["inputData"]
            df = pd.read_excel(inputData)
            normal_df = df[df["label"]==0]
            d_normal_df=normal_df.drop(["id","file_name","rec_datetime","label"], axis=1)
            #------------------------------------------------------------------
            
            norModelPath =config["start"]["norModelPath"]
            saveNorModelName = config["start"]["saveNorModelName"]
            normalModel = loadPickleModel(norModelPath,saveNorModelName,logFile)
            d_normal_Scaled = normalModel.transform(d_normal_df)
            
            if args.pca:
                inferencePCA(d_normal_Scaled, config, logFile)
                
            elif args.oneClassSVM:
                inferenceOneClassSVM(d_normal_Scaled, config, logFile)
            
            elif args.isolationForest:
                inferenceIsolationForest(d_normal_Scaled, config, logFile)
                
            elif args.robustCovariance:
                inferenceRobustCovariance(d_normal_Scaled, config, logFile)
                
            elif args.ensemble:
                inferenceEnsemble(d_normal_Scaled, config, logFile)               
        
    except Exception as e:
        try: 
            logFile
        except Exception: 
            logFile=LogObj("./log","logFile")
        logFile.error(logErrorMsg(e))
    finally:
        #關閉紀錄log的檔案
        try: logFile.closeLogFile()
        except NameError: pass
        
