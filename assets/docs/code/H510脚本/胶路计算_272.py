X1 = GvTool.GetToolData("数据包解析工具_003.输出数据13")
Y1 = GvTool.GetToolData("数据包解析工具_003.输出数据14")

if GvVisionAssembly.GetSystemState() == True or GvVar.GetVar("@ImageMode") == 1:
    GvVar.SetVar("#dLivepicPosX", float(X1))
    GvVar.SetVar("#dLivepicPosY", float(Y1))

# Điểm hiệu chuẩn kim / điểm校针
bChooseNeede = GvVar.GetVar("#bChooseNeede")
if bChooseNeede:
    Base_Points = GvTool.GetToolData("数组生成工具_129.输出数组")
    XX = GvVar.GetVar("#dAxis3D_X")
    YY = GvVar.GetVar("#dAxis3D_Y")
    ZZ = GvVar.GetVar("#dAxis3D_Z")
else:
    Base_Points = GvTool.GetToolData("数组生成工具_478.输出数组")
    XX = (
        GvVar.GetVar("#dLivepicPosX")
        - GvVar.GetVar("#dNeedlepicPosX")
        + GvVar.GetVar("#dNeedleplatPosX")
    )
    YY = (
        GvVar.GetVar("#dLivepicPosY")
        - GvVar.GetVar("#dNeedlepicPosY")
        + GvVar.GetVar("#dNeedleplatPosY")
    )
    ZZ = 0

print(XX, 100)
print(YY, 200)

# Điểm đường keo thời gian thực
Real_Points = GvTool.GetToolData("点云变换工具_139.输出三维点集")

# Đường keo trên ảnh - đoạn thứ nhất
FontReal_Points = Real_Points[0:15]

# Đường keo trên ảnh - đoạn thứ hai
BlackReal_Points = Real_Points[15:]

# Tính tọa độ cơ khí của điểm hạ kim
Data = ""

# Chuyển đường keo đoạn thứ nhất sang tọa độ bàn máy
for i in range(len(FontReal_Points)):
    # Lấy điểm bắt đầu của đoạn keo thứ nhất làm điểm bắt đầu điểm keo
    if i == 0:
        OffsetX = XX + FontReal_Points[i].GetX() - Base_Points[0].GetX()
        OffsetY = YY + Base_Points[0].GetY() - FontReal_Points[i].GetY()
        OffsetZ = ZZ + FontReal_Points[i].GetZ() - Base_Points[0].GetZ()
        Data += (
            str(round(OffsetX, 3))
            + ","
            + str(round(OffsetY, 3))
            + ","
            + str(round(0.00001, 3))
            + "@"
        )
        GvVar.SetVar("#dSend_X1", round(OffsetX, 3))
        GvVar.SetVar("#dSend_Y1", round(OffsetY, 3))
        GvVar.SetVar("#dSend_D1", 0)
    else:
        OffsetX = XX + FontReal_Points[i].GetX() - Base_Points[0].GetX()
        OffsetY = YY + Base_Points[0].GetY() - FontReal_Points[i].GetY()
        OffsetZ = ZZ + FontReal_Points[i].GetZ() - Base_Points[0].GetZ()
        Data += (
            str(round(OffsetX, 3))
            + ","
            + str(round(OffsetY, 3))
            + ","
            + str(round(0.00001, 3))
            + "@"
        )

Data = Data[0:-1] + "|"

# Chuyển đường keo đoạn thứ hai sang tọa độ bàn máy
for i in range(len(BlackReal_Points)):
    if i == 0:
        OffsetX = XX + BlackReal_Points[i].GetX() - Base_Points[0].GetX()
        OffsetY = YY + Base_Points[0].GetY() - BlackReal_Points[i].GetY()
        OffsetZ = ZZ + BlackReal_Points[i].GetZ() - Base_Points[0].GetZ()
        Data += (
            str(round(OffsetX, 3))
            + ","
            + str(round(OffsetY, 3))
            + ","
            + str(round(0.00001, 3))
            + "@"
        )
        GvVar.SetVar("#dSend_X2", round(OffsetX, 3))
        GvVar.SetVar("#dSend_Y2", round(OffsetY, 3))
        GvVar.SetVar("#dSend_D2", 0)
    else:
        OffsetX = XX + BlackReal_Points[i].GetX() - Base_Points[0].GetX()
        OffsetY = YY + Base_Points[0].GetY() - BlackReal_Points[i].GetY()
        OffsetZ = ZZ + BlackReal_Points[i].GetZ() - Base_Points[0].GetZ()
        Data += (
            str(round(OffsetX, 3))
            + ","
            + str(round(OffsetY, 3))
            + ","
            + str(round(0.00001, 3))
            + "@"
        )

Data = Data[0:-1]
GvVar.SetVar("#nRecodData", ",{}".format(Data))

print(Data)
print(GvVar.GetVar("#dSend_X1"))
print(GvVar.GetVar("#dSend_Y1"))
print(GvVar.GetVar("#dSend_X2"))
print(GvVar.GetVar("#dSend_Y2"))

# Tách đường keo theo tọa độ bàn máy
listPoint_1 = Data.split("|")

# Điểm bắt đầu của đoạn keo thứ nhất
P0 = (
    str(GvVar.GetVar("#dSend_X1"))
    + ","
    + str(GvVar.GetVar("#dSend_Y1"))
    + ","
    + str(GvVar.GetVar("#dSend_D1"))
)

# Điểm bắt đầu của đoạn keo thứ hai
P1 = (
    str(GvVar.GetVar("#dSend_X2"))
    + ","
    + str(GvVar.GetVar("#dSend_Y2"))
    + ","
    + str(GvVar.GetVar("#dSend_D2"))
)

# Tập hợp điểm đường keo đoạn thứ nhất theo tọa độ bàn máy
listPoint_11 = listPoint_1[0].split("@")

# Tập hợp điểm đường keo đoạn thứ hai theo tọa độ bàn máy
listPoint_22 = listPoint_1[1].split("@")

# Tính độ lệch của đường keo đoạn thứ nhất theo tọa độ bàn máy và cộng dồn vào chuỗi kết quả
SendResult = ""
for i in range(0, len(listPoint_11)):
    point = listPoint_11[i].split(",")
    P0LIST = P0.split(",")
    xx = round(float(point[0]) - float(P0LIST[0]), 3)
    yy = round(float(point[1]) - float(P0LIST[1]), 3)
    zz = round(float(point[2]) - float(P0LIST[2]), 3)
    strReasult = str(xx) + "," + str(yy) + "," + str(zz) + "@"
    SendResult += strReasult

SendResult = SendResult[0:-1] + "|"

# Tính độ lệch của đường keo đoạn thứ hai theo tọa độ bàn máy và cộng dồn vào chuỗi kết quả
for i in range(0, len(listPoint_22)):
    point = listPoint_22[i].split(",")
    P0LIST = P1.split(",")
    xx = round(float(point[0]) - float(P0LIST[0]), 3)
    yy = round(float(point[1]) - float(P0LIST[1]), 3)
    zz = round(float(point[2]) - float(P0LIST[2]), 3)
    strReasult = str(xx) + "," + str(yy) + "," + str(zz) + "@"
    SendResult += strReasult

print(SendResult, 999)
GvVar.SetVar("#SendResult", SendResult[0:-1])
