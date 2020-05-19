import json,sqlite3
 
def test():
    str_json = '{"total":54,"rows":[{"id":22798,"fromIp":"192.168.190.92","requestUrl":"/imageup/stuimg","requestId":60,"requestTime":"2020-05-19 16:29:37","urlParams":"{\"v\":\"1.0.0.e2\",\"sign\":\"\",\"user\":\"15BE6CD8362\",\"ts\":\"1589876953957\"}","bodyParams":"","type":"POST","filePath":"http://172.16.8.104:8096/jgpt/wKgAIF3nHJyAP2fKAAAwnDmvjqQ195.jpg","urlRegex":"/imageup/{type}","description":"文件上传接口"}]}'
    str_json2 = '{"total":54,"rows":[{"id":"{\"v\":\"1.0.0.e2\",\"sign\":\"\",\"user\":\"15BE6CD8362\",\"ts\":\"1589876953957\"}"}]}'
    str_json3 = '{"total":54,"rows":[{"id":22798,"fromIp":"192.168.190.92","requestUrl":"/imageup/stuimg","requestId":60,"requestTime":"2020-05-19 16:29:37","urlParams":{"v":"1.0.0.e2","sign":"","user":"15BE6CD8362","ts":"1589876953957"},"bodyParams":"","type":"POST","filePath":"http://172.16.8.104:8096/jgpt/wKgAIF3nHJyAP2fKAAAwnDmvjqQ195.jpg","urlRegex":"/imageup/{type}","description":"文件上传接口"}]}'
    # dict_json = json.loads(str_json3)
def connsqlit():
    conn = sqlite3.connect('db.sqlite3')
    
connsqlit()