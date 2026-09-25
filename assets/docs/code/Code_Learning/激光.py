from ScImageShow import ScImageShow



##获取GUI显示数组——重要初始化显示数组

guiArray = GvVisionAssembly.GcScriptGuiArray()
OK = GvVar.GetVar("#OK").split(",")
OK = ",".join(map(str,OK))
YIWU = GvVar.GetVar("#YIWU").split(",")
YIWU = ",".join(map(str,YIWU))
FANGFAN = GvVar.GetVar("#FangFan").split(",")
FANGFAN = ",".join(map(str,FANGFAN))
WULIAO = GvVar.GetVar("#WULIAO").split(",")
WULIAO = ",".join(map(str,WULIAO))
print(OK)
ScImageShow.ImageShowTextXY(ScImageShow,guiArray,0,100,"OK： {:s}穴".format(OK[1:]),[0, 255, 0],200)
ScImageShow.ImageShowTextXY(ScImageShow,guiArray,0,300,"异常产品: {:s}穴".format(YIWU[1:]),[0, 255, 0],200)
ScImageShow.ImageShowTextXY(ScImageShow,guiArray,0,500,"产品防反: {:s}穴".format(FANGFAN[1:]),[0, 255, 0],200)
result = GvTool.GetToolData("数组生成工具_041.输出数组")
parts = []

# for group in [OK, FANGFAN, YIWU, WULIAO]:
    # for s in group.split(","):
        # if s:
            # idx = int(s) - 1
            # parts.append("{:.3f},{:.3f},{:.3f}".format(result[idx].X,result[idx].Y,result[idx].D))
for i in range(6):
    X = result[i].X
    Y = result[i].Y
    D = result[i].D
    strCMD = "{:.3f},{:.3f},{:.3f}".format(X,Y,D)
    parts.append(strCMD)
strSend = ";".join(parts)
print(strSend)
GvVar.SetVar("#SEND",strSend)
nOK = OK.strip(",").split(",")
print(len(nOK))
GvVar.SetVar("#nOK",len(nOK))
strSN = GvTool.GetToolData("图像源工具_009.当前文件名称")
GvVar.SetVar("#strSN",strSN)
print(strSN)
ScImageShow.ImageShowTextXY(ScImageShow,guiArray,0,2500,"发送: {:s}".format(strSend),[0, 255, 0],200)
GvGuiDataAgent.SetGraphicDisplay("View-1", guiArray)