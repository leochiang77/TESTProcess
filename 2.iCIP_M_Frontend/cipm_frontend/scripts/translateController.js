var translationsEN = {
    NAVIGATION: 'NAVIGATION',
    CIPDSTATUS: 'CIP-D Status',
    REALTIMECHART: 'Real-time chart',
    HISTORICALCHART: 'Historical chart',
    SET:'Settings',
    NO: 'No.',
    Description:'Description',
    STATUS: 'Status',
    CPU:'CPU',
    RAM: 'RAM Available space (MB)',
    CDISK: 'C Disk Available space(%)',
    DDISK: 'D Disk Available space(%)',
    QUERY: 'Query',
    FILTER: 'Filter',
    BUTTON_LANG_zhTW: 'Chinese',
    BUTTON_LANG_EN: 'English',
    TAGS: 'Tags',
    TAGNAME: 'TagName',
    SEARCH: 'Search from Tagname',
    MQTTINFO: 'MQTT Settings',
    IP: 'IP Address',
    PORT: 'Port',
    User: 'User',
    Password: 'Password',
    RealtimeTopic: 'Real-time Topic',
    ResendTopic: 'Resend Topic',
    HealthTopic: 'Health Topic',
    MODIFY: 'Modify',
    PIP: 'Enter IP Address',
    PPOR: 'Enter Port Number',
    PUser: 'Enter User',
    PPassword: 'Enter password',
    PCTopic: 'Enter Realtime Topic',
    PRTopic: 'Enter Resend Topic',
    PHTopic: 'Enter Health Topic',
    Error: 'Error! Server no response',
    Succeed: 'Save Succeed!',
    TagSearch: 'Watch the Real-time data by tag name',

    HEADLINE: 'Historical Trend Chart',
    abTime: 'absolute time',
    reTime: 'relative time',
    byreab: 'relative/absolute',
    wdfrom: 'from',
    wdto: 'to',
    metric: 'Metric',
    name: 'Name',
    aggregator: 'aggregator',
    graph: 'Graph',
    save: 'Save',
    uploadCSV: 'Import Data by CSV File',
    selectCsvFile: 'Select CSV file',
    fileDesc: 'First row must be "tag,time,value"\n Each field can not be null\n "time" format must be yyyy/MM/dd HH:mm:ss\n "value" only accepts numeric',
    fileError: 'Error : First row must be "tag,time,value"\n Each field can not be null\n "time" format must be yyyy/MM/dd HH:mm:ss\n "value" only accepts numeric',
    fileUploaded: 'Data import success !',
    BUTTON_LANG_zhTW: 'Chinese',
    BUTTON_LANG_EN: 'English'
};

var translationszhTW = {
    NAVIGATION: '功能導覽',
    CIPDSTATUS: 'CIP-D 裝置狀態',
    REALTIMECHART: '即時趨勢圖',
    HISTORICALCHART: '歷史趨勢圖',
    SET:'設定',
    NO: '編號',
    Description:'描述',
    STATUS: '裝置狀態',
    CPU:'CPU使用率',
    RAM: '剩餘可用記憶體(MB)',
    CDISK: 'C碟剩餘容量',
    DDISK: 'D碟剩餘容量',
    QUERY: '查詢',
    FILTER:'篩選',
    BUTTON_LANG_zhTW: '中文',
    BUTTON_LANG_EN: '英文',
    TAGS: '所有標籤',
    TAGNAME: '標籤名稱',
    SEARCH: '從標籤名稱中搜尋',
    MQTTINFO: 'MQTT設定',
    IP: '網路位址',
    PORT: '埠號',
    User: '使用者名稱',
    Password: '密碼',
    RealtimeTopic: '即時資料Topic',
    ResendTopic: '補送資料Topic',
    HealthTopic: '健康狀態Topic',
    MODIFY: '修改',
    PIP: '請輸入網路位址',
    PPOR: '請輸入埠號',
    PUser: '請輸入使用者名稱',
    PPassword: '請輸入密碼',
    PCTopic: '請輸入即時資料Topic',
    PRTopic: '請輸入重傳Topic',
    PHTopic: '請輸入健康狀態Topic',
    Error: '錯誤! 無法連接至伺服器抓取資料',
    Succeed: '保存成功!',
    TagSearch: '選擇欲觀看標籤的即時資料',

    HEADLINE: '歷史趨勢圖',
    abTime: '絕對時間',
    reTime: '相對時間',
    byreab: '相對時間/絕對時間',
    wdfrom: '從',
    wdto: '到',
    metric: '標籤',
    name: '標籤名稱',
    aggregator: '聚合函數',
    graph: '繪圖',
    save: '下載',
    uploadCSV: '由CSV檔匯入資料',
    selectCsvFile: '選取CSV檔',
    fileDesc: '第一列必須是 "tag,time,value"\n 各欄位不可為空值\n "time" 格式必須是 yyyy/MM/dd HH:mm:ss\n "value" 只接受數值',
    fileError: '錯誤 : 第一列必須是 "tag,time,value"\n 各欄位不可為空值\n "time" 格式必須是 yyyy/MM/dd HH:mm:ss\n "value" 只接受數值',
    fileUploaded: '資料已匯入成功',
    BUTTON_LANG_zhTW: '中文',
    BUTTON_LANG_EN: '英文'
};

app.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('zhTW', translationszhTW);
    $translateProvider.translations('en', translationsEN);
    $translateProvider.preferredLanguage('zhTW');
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escape');
}]);

app.controller('TranslateCtrl', ['$translate', '$scope', '$rootScope', '$sce', 'kairosdbURL', function ($translate, $scope, $rootScope, $sce, kairosdbURL) {

    $scope.changeLanguage = function (langKey) {
        console.log(langKey);
        if (langKey === 'en') {
            $scope.test = 1;
            $rootScope.urllang = kairosdbURL + '?en';
            $rootScope.url = $sce.trustAsResourceUrl($rootScope.urllang);
        } else if (langKey === 'zhTW') {
            $scope.test = 2;
            $rootScope.urllang = kairosdbURL + '?zhTW';
            $rootScope.url = $sce.trustAsResourceUrl($rootScope.urllang);
        }
        $translate.use(langKey);
        $rootScope.lang = langKey;
    };
}]);


app.controller('UrlCtrl', ['$rootScope', '$sce', function ($rootScope, $sce) {
    $rootScope.urllang = kairosdbURL + '?zhTW';
    $rootScope.url = $sce.trustAsResourceUrl($rootScope.urllang);
}]);