# Lấy tham số ảnh độ sâu
img = GvTool.GetToolData("深度图像源_022.输出深度图像").GetRangeParam()
XOffset = img.XOffset
XResolution = img.XResolution
YOffset = img.YOffset
YResolution = img.YResolution

# Tập điểm đường keo
cloud_3d = GvTool.GetToolData("点云变换工具_285.输出三维点集")

IMGX = GvVar.GetVar("#dDisplayTrainingGrayX")
IMGY = GvVar.GetVar("#dDisplayTrainingGrayY")
P2X = GvVar.GetVar("#dDisplayTrainingCloudX")
P2Y = GvVar.GetVar("#dDisplayTrainingCloudY")

bLeftOrRight = GvVar.GetVar("@bLeftOrRight")
h = GvTool.GetToolData("灰度图像源_021.输出图像").Height()

# Thiết lập định dạng GUI
guiStyle = GvVisionAssembly.GsScriptGuiStyle()
guiStyle.bVisible = True
guiStyle.nLineStyle = 2
guiStyle.nLineWidth = 2
guiStyle.clrLineColor = [0, 255, 255]
guiStyle.bLabelVisible = True
guiStyle.lFontSize = 20

guiStyle1 = GvVisionAssembly.GsScriptGuiStyle()
guiStyle1.bVisible = True
guiStyle1.nLineStyle = 1
guiStyle1.nLineWidth = 2
guiStyle1.clrLineColor = [0, 0, 255]
guiStyle1.bLabelVisible = True
guiStyle1.lFontSize = 20

guiStyle2 = GvVisionAssembly.GsScriptGuiStyle()
guiStyle2.bVisible = True
guiStyle2.nLineStyle = 1
guiStyle2.nLineWidth = 2
guiStyle2.clrLineColor = [255, 0, 0]
guiStyle2.bLabelVisible = True
guiStyle2.lFontSize = 20

# Lấy mảng GUI dùng để hiển thị
guiArray = GvVisionAssembly.GcScriptGuiArray()

# Thiết lập hiển thị dấu chữ thập
vv = GvVisionAssembly.sc2VectorVec()
nn = len(GvTool.GetToolData("数组生成工具_199.输出数组"))

# Bù giá trị K
OffsetX = GvVar.GetVar("#dOffsetGuiding_X")
OffsetY = GvVar.GetVar("#dOffsetGuiding_Y")
OffsetX1 = GvVar.GetVar("#dOffsetGuiding_X_1")
OffsetY1 = GvVar.GetVar("#dOffsetGuiding_Y_1")

for i in range(len(cloud_3d)):
    if i < 15:
        OffsetX = OffsetX
        OffsetY = OffsetY
    else:
        OffsetX = OffsetX1
        OffsetY = OffsetY1

    if i == 0 or i == 15:
        x = (cloud_3d[i].GetX() - P2X) / XResolution + IMGX
        y = (
            (-(cloud_3d[i].GetY() - P2Y)) / YResolution + IMGY
            if bLeftOrRight
            else h - ((-(cloud_3d[i].GetY() - P2Y)) / YResolution + IMGY)
        )

        vv.append(GvVisionAssembly.sc2Vector(x, y))

        guiCross = GvVisionAssembly.GsScriptGuiCross()
        guiCross.sScriptGuiStyle = guiStyle1
        guiCross.cross.SetX(x)
        guiCross.cross.SetY(y)
        guiArray.Add(guiCross)

        x = (cloud_3d[i].GetX() + OffsetX - P2X) / XResolution + IMGX
        y = (
            (-(cloud_3d[i].GetY() + OffsetY - P2Y)) / YResolution + IMGY
            if bLeftOrRight
            else h - ((-(cloud_3d[i].GetY() - P2Y)) / YResolution + IMGY)
        )

        vv.append(GvVisionAssembly.sc2Vector(x, y))

        guiCross = GvVisionAssembly.GsScriptGuiCross()
        guiCross.sScriptGuiStyle = guiStyle2
        guiCross.cross.SetX(x)
        guiCross.cross.SetY(y)
        guiArray.Add(guiCross)

    x = (cloud_3d[i].GetX() + OffsetX - P2X) / XResolution + IMGX
    y = (
        (-(cloud_3d[i].GetY() + OffsetY - P2Y)) / YResolution + IMGY
        if bLeftOrRight
        else h - ((-(cloud_3d[i].GetY() - P2Y)) / YResolution + IMGY)
    )

    vv.append(GvVisionAssembly.sc2Vector(x, y))

    guiCross = GvVisionAssembly.GsScriptGuiCross()
    guiCross.sScriptGuiStyle = guiStyle
    guiCross.cross.SetX(x)
    guiCross.cross.SetY(y)
    guiArray.Add(guiCross)

    guiText = GvVisionAssembly.GsScriptGuiText()
    guiText.sScriptGuiStyle = guiStyle
    guiText.strText = str(i + 1)

    if i == 15:
        guiText.posX = x
        guiText.posY = y - 30
        guiText.deg = 0.0
    else:
        guiText.posX = x
        guiText.posY = y
        guiText.deg = 0.0

    guiArray.Add(guiText)

    if i < nn:
        guiText = GvVisionAssembly.GsScriptGuiText()
        guiText.sScriptGuiStyle = guiStyle
        guiText.strText = (
            str(i)
            + ":  "
            + str(round(cloud_3d[i].GetX(), 3))
            + "; "
            + str(round(cloud_3d[i].GetY(), 3))
            + "; "
            + str(round(cloud_3d[i].GetZ(), 3))
        )
        guiText.posX = 550
        guiText.posY = i * 20
        guiText.deg = 0.0
        guiArray.Add(guiText)
    else:
        guiText = GvVisionAssembly.GsScriptGuiText()
        guiText.sScriptGuiStyle = guiStyle
        guiText.strText = (
            str(i)
            + ":  "
            + str(round(cloud_3d[i].GetX(), 3))
            + "; "
            + str(round(cloud_3d[i].GetY(), 3))
            + "; "
            + str(round(cloud_3d[i].GetZ(), 3))
        )
        guiText.posX = 800
        guiText.posY = (i - nn) * 20
        guiText.deg = 0.0
        guiArray.Add(guiText)

# Gửi mảng GUI lên cửa sổ hiển thị
GvGuiDataAgent.SetGraphicDisplay("点胶引导-CCD2", guiArray)
