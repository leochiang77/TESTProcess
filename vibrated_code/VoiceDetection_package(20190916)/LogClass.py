
# coding: utf-8

# In[ ]:


import logging
import getpass

class LogObj(object):
    """函式功能：
    
    初始[紀錄log]物件

    Parameters
    ----------
        savePath :string
            儲存路徑

        fileName :string
            儲存檔案名稱

    Returns
    ------
        object
            執行物件
    """
    def __init__(self, savePath, fileName):
        user=getpass.getuser()
        self.logger=logging.getLogger(user)
        self.logger.setLevel(logging.DEBUG)
        format='%(asctime)s - %(levelname)s -%(name)s : %(message)s'
        formatter=logging.Formatter(format)
        streamhandler=logging.StreamHandler()
        streamhandler.setFormatter(formatter)
        self.logger.addHandler(streamhandler)
        logfile=savePath + '/' + fileName + '.log'
        filehandler=logging.FileHandler(logfile)
        filehandler.setFormatter(formatter)
        self.logger.addHandler(filehandler)
    """函式功能：
    
    紀錄debug log

    Parameters
    ----------
        msg :string
            log內容

    Returns
    ------
        None
    """
    def debug(self, msg):
        self.logger.debug(msg)
    def info(self, msg):
        self.logger.info(msg)
    def warning(self, msg):
        self.logger.warning(msg)
    def error(self, msg):
        self.logger.error(msg)
    def critical(self, msg):
        self.logger.critical(msg)
    def log(self, level, msg):
        self.logger.log(level, msg)
    """函式功能：
    
    設置需要紀錄之log層級，層級以下的log不會被打印出來

    Parameters
    ----------
        level :string
            設置層級:
            NOTSET < DEBUG < INFO < WARNING < ERROR < CRITICAL
            ex: logging.INFO

    Returns
    ------
        None
    """
    def setLevel(self, level):
        self.logger.setLevel(level)
    def disable(self):
        logging.disable(50)


# In[ ]:


if __name__ == '__main__':
    mylog=logClass('.','logFile')

