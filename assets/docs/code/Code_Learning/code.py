from ScImageShow import ScImageShow
import math

guiArray = GvVisionAssembly.GcScriptGuiArray()

X_axis = GvTool.GetToolData("多圆多线查找工具_003.线_001.直线结果")
Y_axis = GvTool.GetToolData("多圆多线查找工具_003.线_002.直线结果")
O = GvTool.GetToolData("多圆多线查找工具_003.交点_003")
#Radian của trục X và trục Y so với phương ngang
alpha = X_axis.GetRotation().ToDouble()
beta = Y_axis.GetRotation().ToDouble()
print(alpha,beta)
ScImageShow.ImageShowTextPos(ScImageShow,guiArray,O,"O",[255, 0, 0],100)
pointX_Xaxis = O.GetX() + 1000*math.cos(alpha) + 0*math.cos(beta)
pointY_Xaxis = O.GetY() + 1000*math.sin(alpha) + 0*math.sin(beta)
point_Xaxis=GvVisionAssembly.sc2Vector(pointX_Xaxis,pointY_Xaxis)
ScImageShow.ImageShowTextPos(ScImageShow,guiArray,point_Xaxis,"X+",[255, 0, 0],100)
pointX_Yaxis = O.GetX() + 0*math.cos(alpha) + 800*math.cos(beta)
pointY_Yaxis = O.GetY() + 0*math.sin(alpha) + 800*math.sin(beta)
point_Yaxis=GvVisionAssembly.sc2Vector(pointX_Yaxis,pointY_Yaxis)
ScImageShow.ImageShowTextPos(ScImageShow,guiArray,point_Yaxis,"Y+",[255, 0, 0],100)

#Tạo 1 điểm nằm cách tâm O(x,y) khoảng cách bằng [Q theo chiều X và P theo chiều Y]. ***Công thức:***
# Ax = x + Q * math.cos(a) + P * math.cos(b)
# Ay = y + Q * math.sin(a) + P * math.sin(b)
Q = 500
P = 0
pointX = O.GetX() + Q*math.cos(alpha) + P*math.cos(beta)
pointY = O.GetY() + Q*math.sin(alpha) + P*math.sin(beta)
ScImageShow.ImagechowCrossVec(ScImageShow,guiArray,point, [255, 0, 0],5)
#Tạo 1 đường thẳng đi qua Point và song song với trục Y
point=GvVisionAssembly.sc2Vector(pointX,pointY)
line = GvVisionAssembly.scLine(point,Y_axis.GetRotation())
ScImageShow.ImageShowLine(ScImageShow,guiArray,line,[0, 255, 0],1)#显示直线

#Tạo điểm dựa trên tâm O và xoay theo góc theta. ***Công thức***:
# X_new = Cx + Lx * cos(theta) - Ly * sin(theta)
# Y_new = Cy + Lx * sin(theta) + Ly * cos(theta)

GvGuiDataAgent.SetGraphicDisplay("View-1", guiArray)