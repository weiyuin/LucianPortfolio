import math
from ScImageShow import ScImageShow

guiArray = GvVisionAssembly.GcScriptGuiArray()

# Tâm O
O = GvTool.GetToolData("多圆多线查找工具_009.圆_004.圆心")
Ox = O.GetX()
Oy = O.GetY()
# Line1, Line2 là 2 trục mới, Line2 vuông góc với Line1
rad_1_Line = GvVisionAssembly.scRadian(math.pi)
Line1 = GvVisionAssembly.scLine(O,rad_1_Line)
rad_2_Line = GvVisionAssembly.scRadian(rad_1_Line.ToDouble() + math.pi / 2.0)
Line2 = GvVisionAssembly.scLine(O,rad_2_Line)
rad_1 = rad_1_Line.ToDouble()
rad_2 = rad_2_Line.ToDouble()
# Hiển thị 2 trục
ScImageShow.ImageShowLine(ScImageShow, guiArray, Line1, [255, 0, 0], 1) #X
ScImageShow.ImageShowLine(ScImageShow, guiArray, Line2, [0, 255, 0], 1) #Y

# Bán kính
R = 180

# Vector chứa 360 điểm
pointVec = GvVisionAssembly.sc2VectorVec()
for deg in range(360):
    t = math.radians(deg)

    localX = R * math.cos(t)
    localY = R * math.sin(t)

    px = Ox + localX * math.cos(rad_1) + localY * math.cos(rad_2)
    py = Oy + localX * math.sin(rad_1) + localY * math.sin(rad_2)

    p = GvVisionAssembly.sc2Vector(px, py)
    pointVec.append(p)
    # Hiển thị từng điểm
    ScImageShow.ImagechowCrossVec(ScImageShow,guiArray,p,[0, 200, 0],1)
    if deg % 10 == 0:
        ScImageShow.ImageShowTextPos(ScImageShow,guiArray,p,str(deg),[255, 0, 0],30)

GvGuiDataAgent.SetGraphicDisplay("View-2", guiArray)