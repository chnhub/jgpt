from django.shortcuts import render
from django.views.decorators.clickjacking import xframe_options_sameorigin

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
def receiveRecord(request, name):
    print(f'请求名字为{name}')
    if name == 'receiveRecord':
        return render(
        request,
        'jgpt/receiveRecord.html',) 
    else:
        print(f'无此请求')
        return HttpResponse('404 error')
    