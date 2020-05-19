from django.shortcuts import render
from django.views.decorators.clickjacking import xframe_options_sameorigin
import json


# Create your views here.
from django.http import HttpResponse

def home(request):
    return HttpResponse("Hello, Django!")

def hello_there(request, name):
    return HttpResponse("Hello, Django2!")

def jgpt_root(request):
    return render(
        request,
        'jgpt/index.html',
    )

# 设置该页面可以在相同域名页面的 frame 中展示
# 或者全局设置 X_FRAME_OPTIONS = 'SAMEORIGIN'
# @xframe_options_sameorigin
def menu(request, name):
    print(f'请求名字为{name}')
    try:
        if name:
            return render(
                request,
                f'jgpt/{name}.html',
            ) 
        else:
            print(f'无此请求')
            return HttpResponse('404 error')
    except Exception as identifier:
        print('进入异常')
        return HttpResponse('404 error')
    
def receiveRecord(request, name):
    print(f'请求名字为{name}')
    str_json = '{"total":54,"rows":[{"id":22798,"fromIp":"192.168.190.92","requestUrl":"/imageup/stuimg","requestId":60,"requestTime":"2020-05-19 16:29:37","urlParams":{"v":"1.0.0.e2","sign":"","user":"15BE6CD8362","ts":"1589876953957"},"bodyParams":"","type":"POST","filePath":"http://172.16.8.104:8096/jgpt/wKgAIF3nHJyAP2fKAAAwnDmvjqQ195.jpg","urlRegex":"/imageup/{type}","description":"文件上传接口"}]}'
    print(f'返回的字符串为：{str_json}')
    dict_json = json.loads(str_json)
    print(dict_json)

    return HttpResponse(json.dumps(json.loads(str_json)),content_type="application/json")
        