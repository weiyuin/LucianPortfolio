from ScImageShow import ScImageShow
import math
guiArray = GvVisionAssembly.GcScriptGuiArray()

X_axis = GvTool.GetToolData("多圆多线查找工具_003.线_001.直线结果")
Y_axis = GvTool.GetToolData("多圆多线查找工具_003.线_002.直线结果")
O = GvTool.GetToolData("多圆多线查找工具_003.交点_003")
X = O.GetX()
Y = O.GetY()
#Radian của trục X và trục Y so với phương ngang
alpha = X_axis.GetRotation().ToDouble()
beta = Y_axis.GetRotation().ToDouble()
print(alpha,beta)
#Vẽ ký hiệu tâm O, trục X, trục Y
pointX_Xaxis = X + 1000*math.cos(alpha) + 0*math.cos(beta)
pointY_Xaxis = Y + 1000*math.sin(alpha) + 0*math.sin(beta)
point_Xaxis=GvVisionAssembly.sc2Vector(pointX_Xaxis,pointY_Xaxis)
pointX_Yaxis = X + 0*math.cos(alpha) + 800*math.cos(beta)
pointY_Yaxis = Y + 0*math.sin(alpha) + 800*math.sin(beta)
point_Yaxis=GvVisionAssembly.sc2Vector(pointX_Yaxis,pointY_Yaxis)
ScImageShow.ImageShowTextPos(ScImageShow,guiArray,O,"O",[255, 0, 0],100)
ScImageShow.ImageShowTextPos(ScImageShow,guiArray,point_Xaxis,"X+",[255, 0, 0],100)
ScImageShow.ImageShowTextPos(ScImageShow,guiArray,point_Yaxis,"Y+",[255, 0, 0],100)

#Tạo 1 điểm nằm cách tâm O(x,y) khoảng cách bằng [Q theo chiều X và P theo chiều Y].
# Ax = x + Q * math.cos(alpha) + P * math.cos(beta)
# Ay = y + Q * math.sin(alpha) + P * math.sin(beta)
Q = 500
P = 0
pointX = X + Q*math.cos(alpha) + P*math.cos(beta)
pointY = Y + Q*math.sin(alpha) + P*math.sin(beta)
point=GvVisionAssembly.sc2Vector(pointX,pointY)
ScImageShow.ImagechowCrossVec(ScImageShow,guiArray,point, [255, 0, 0],5) #显示Point点
#Tạo 1 đường thẳng Line1 đi qua Point và song song với trục Y
point=GvVisionAssembly.sc2Vector(pointX,pointY)
Line1 = GvVisionAssembly.scLine(point,Y_axis.GetRotation())
ScImageShow.ImageShowLine(ScImageShow,guiArray,Line1,[0, 255, 0],1) #显示直线 Line1

#Tạo 1 đường thẳng Line2 đi qua Point và vuông góc với Line1
Line1_angle = Line1.GetAngle
Line2 = GvVisionAssembly.scLine(point,Line1.GetRotation())
#Tạo điểm dựa trên tâm O và xoay theo góc theta.:
# X_new = Cx + Lx * cos(theta) - Ly * sin(theta)
# Y_new = Cy + Lx * sin(theta) + Ly * cos(theta)
theta = math.radians(15)
Lx = 100
Ly = 100
pointVec = GvVisionAssembly.sc2VectorVec()
for i in range(10):
    X_new = pointX + Lx*i * math.cos(theta) - Ly * math.sin(theta)
    Y_new = pointY + Lx*i * math.sin(theta) + Ly * math.cos(theta)
    point_new=GvVisionAssembly.sc2Vector(X_new,Y_new)
    # pointVec.append(point_new)
    ScImageShow.ImagechowCrossVec(ScImageShow,guiArray,point_new, [255, 200, 0],3)
    ScImageShow.ImageShowTextPos(ScImageShow,guiArray,point_new,f"{i+1}",[255, 0, 0],80)
GvGuiDataAgent.SetGraphicDisplay("View-1", guiArray)