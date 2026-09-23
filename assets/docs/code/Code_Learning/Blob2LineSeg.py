from ScImageShow import ScImageShow

guiArray=GvVisionAssembly.GcScriptGuiArray()

def GetNearPoint(P,lineSeg):
    A=lineSeg.GetP1(); B=lineSeg.GetP2()
    dx=B.GetX()-A.GetX(); dy=B.GetY()-A.GetY()
    t=((P.GetX()-A.GetX())*dx+(P.GetY()-A.GetY())*dy)/(dx*dx+dy*dy)
    t=max(0,min(1,t))
    return GvVisionAssembly.sc2Vector(A.GetX()+t*dx,A.GetY()+t*dy)

def GetMinMaxLine(blobPoints,lineSeg):
    minDis=999999999; maxDis=-1
    for P in blobPoints:
        dis=GvVisionAssembly.DistancePoint2LineSeg(P,lineSeg).distance
        if dis<minDis: minDis=dis; minP=P
        if dis>maxDis: maxDis=dis; maxP=P
    minLine=GvVisionAssembly.scLineSeg(GetNearPoint(minP,lineSeg),minP)
    maxLine=GvVisionAssembly.scLineSeg(GetNearPoint(maxP,lineSeg),maxP)
    return minDis,maxDis,minLine,maxLine

blobPoints=GvTool.GetToolData("Blob结果解析_006.轮廓边界点")
print(dir(blobPoints))
lineSeg=GvTool.GetToolData("找线工具_003.线段结果")

minDis,maxDis,minLine,maxLine=GetMinMaxLine(blobPoints,lineSeg)

ScImageShow.ImageShowLineSeg(ScImageShow,guiArray,lineSeg,[255,255,0],2)
ScImageShow.ImageShowLineSeg(ScImageShow,guiArray,minLine,[0,255,255],4)
ScImageShow.ImageShowLineSeg(ScImageShow,guiArray,maxLine,[255,0,0],4)

print("Min:",minDis,"Max:",maxDis)
GvGuiDataAgent.SetGraphicDisplay("View-1",guiArray)