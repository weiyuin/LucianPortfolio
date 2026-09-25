from ScImageShow import ScImageShow



##获取GUI显示数组——重要初始化显示数组

guiArray = GvVisionAssembly.GcScriptGuiArray()
step = GvVar.GetVar("#L2")
# step =5
if step < 3:
    rect = GvVisionAssembly.scRect(200+(step*1100), 450, 1200, 2000)
else:
    rect = GvVisionAssembly.scRect((200+(step-3)*1100), 2700, 1200, 2000)
GvTool.SetToolData("几何定位_010.搜索区域",rect)
ScImageShow.ImageShowRec(ScImageShow, guiArray, rect, clrLineColor=[0, 255, 0], nLineWidth=3)
GvGuiDataAgent.SetGraphicDisplay("View-1", guiArray)

