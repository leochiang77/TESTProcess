
# coding: utf-8

# In[ ]:


#安裝套件
#!pip install mysqlclient

#操作參考 
#https://www.cnblogs.com/zyever/p/9449344.html
#http://yhhuang1966.blogspot.com/2018/05/python-mysql.html


# In[15]:


import MySQLdb
import pandas as pd

class MySQLDB(object):
    
    """函式功能：

    初始資料庫物件

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
    
    連接資料庫

    Parameters
    ----------
        hostId :string
            資料庫ip

        port :string
            資料庫port

        user :string
            資料庫使用者名稱

        passwd :string
            資料庫密碼

        dbName :string
            資料庫名稱

    Returns
    ------
        object
            資料庫連線物件
    """
    def createConnMySQL(self, hostId, port, user, passwd, dbName):
        try:
            conn= MySQLdb.connect(
                host=hostId,
                port = port,
                user=user,
                passwd=passwd,
                db =dbName,
                )
            return conn

        except Exception as e:
            self.logFile.error(e)


    """函式功能：

    關閉資料庫

    Parameters
    ----------
        conn :object
            資料庫連線物件

        cur :object
            資料庫執行物件

    Returns
    ------
        None      
    """
    def closeConnMySQL(self, conn, cur):
        try:
            if cur != None:
                cur.close()

            if conn != None:
                conn.close()
        except Exception as e:
            self.logFile.error(e)


    """函式功能：

    執行SQL語句

    Parameters
    ----------
        conn :object
            資料庫連線物件

        cur :object
            資料庫執行物件

        SQL :string
            SQL語句

    Returns
    ------
        list
            資料庫內容  
    """
    def executeSQL(self, conn, cur, SQL):
        try:
            outputMySQL = None
            if conn !=None:
                cur.execute(SQL)
                outputMySQL = cur.fetchall()
            return list(outputMySQL)

        except Exception as e:
            self.logFile.error(e)


    """函式功能：

    抓取資料

    Parameters
    ----------
        hostId :string
            資料庫ip

        port :string
            資料庫port

        user :string
            資料庫使用者名稱

        passwd :string
            資料庫密碼

        dbName :string
            資料庫名稱

        sqlArr :list
            SQL語句集合

    Returns
    ------
        list
            資料庫內容  
    """
    def extractData(self, hostId, port, user, passwd, dbName, sqlArr):
        outputErrList=list()
        outputMySQL = None

        try:
            conn = None;
            cur = None;
            conn = self.createConnMySQL(hostId, port, user, passwd, dbName)
            cur = conn.cursor(MySQLdb.cursors.DictCursor)

            for item in sqlArr:
                outputMySQL = self.executeSQL(conn, cur,item)
                outputErrList.extend(outputMySQL)

        except Exception as e:
            self.logFile.error(e)
            traceback.print_exc()

        finally:
            self.closeConnMySQL(conn, cur)
            return pd.DataFrame(outputErrList)

