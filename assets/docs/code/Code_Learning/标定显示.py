from ScImageShow import ScImageShow
guiArray = GvVisionAssembly.GcScriptGuiArray()

nCalibIndex = GvVar.GetVar("@nCalibIndex")
pointVec = GvTool.GetToolData("CCD2独立标定_008.标定Mark点集")
PltX = GvTool.GetToolData("CCD2独立标定_008.平台坐标X")
PltY = GvTool.GetToolData("CCD2独立标定_008.平台坐标Y")
PltD = GvTool.GetToolData("CCD2独立标定_008.平台坐标D")
bResult = GvTool.GetToolData("CCD2独立标定_008.执行结果")
calibResult = GvTool.GetToolData("CCD2独立标定_008.标定结果")
calib_error = GvTool.GetToolData("CCD2独立标定_008.平移标定误差")
# 初始结果
if bResult == True:
    nCalibRS = 1
    calib_Msg = "标定OK"
else:
    nCalibRS = 0
    calib_Msg = "标定NG"
ImageAngle = 0
############################ 显示标定点 ############################
if len(pointVec) > 0:
    ScImageShow.ImagechowCrossVec(ScImageShow, guiArray, pointVec[0][0], [0, 255, 0], 2)
    ScImageShow.ImageShowTextPos(ScImageShow, guiArray, pointVec[0][0], "1", [0, 255, 0], 100)
    for i in range(1, nCalibIndex+1):
        point = pointVec[i][0]
        P1 = pointVec[i-1][0]
        ScImageShow.ImagechowCrossVec(ScImageShow, guiArray, point, [0, 255, 0], 2)
        ScImageShow.ImageShowTextXY(ScImageShow, guiArray, point.GetX(), point.GetY()+30, str(i+1), [0, 255, 0], 100)
        ScImageShow.ImageShowLineSegVec(ScImageShow, guiArray, P1, point, [255, 255, 0], 1)
############################ 标定结果判断 ############################
if nCalibIndex == 11 and bResult == True:
    PixelX = calibResult.PixelX
    PixelY = calibResult.PixelY
    ImageAngle = calibResult.ImageAngle
    M00 = calibResult.Matrix.GetElement(0, 0)
    M01 = calibResult.Matrix.GetElement(0, 1)
    M10 = calibResult.Matrix.GetElement(1, 0)
    M11 = calibResult.Matrix.GetElement(1, 1)
    # 像素当量异常
    if PixelX <= 0 or PixelY <= 0:
        nCalibRS = 0
        calib_Msg = "标定NG，像素当量异常!"
    # 平移标定误差过大
    elif calib_error > 5 * PixelX:
        nCalibRS = 0
        calib_Msg = "标定NG，标定误差过大!误差:{calib_error:.5f},上限:{USL:.5f}".format(calib_error=calib_error, USL=2*PixelX)
    # PixelX、PixelY差异大于5%
    elif abs(PixelX - PixelY) / PixelX > 0.05:
        nCalibRS = 0
        calib_Msg = "标定NG，像素当量差异过大(5%)!PixelX:{PixelX:.5f},PixelY:{PixelY:.5f}".format(PixelX=PixelX, PixelY=PixelY)
    else:
        nCalibRS = 1
        calib_Msg = "标定OK"
        GvVar.SetVar("#dCalibPixX", PixelX)
        GvVar.SetVar("#dCalibPixY", PixelY)
############################ 显示颜色 ############################
if nCalibRS == 0:
    clr = [255, 0, 0]
else:
    clr = [0, 255, 0]
############################ 基本信息显示 ############################
ScImageShow.ImageShowTextXY(ScImageShow, guiArray, 0, 0, calib_Msg, clr, 100, 0)
ScImageShow.ImageShowTextXY(ScImageShow, guiArray, 0, 100, "第{n}步".format(n=nCalibIndex+1), clr, 100, 0)
ScImageShow.ImageShowTextXY(ScImageShow, guiArray, 0, 200, "当前机构坐标X:{X:.3f},Y:{Y:.3f},D:{D}".format(X=PltX, Y=PltY, D=PltD), clr, 100, 0)
############################ 机构轴方向显示 ############################
if nCalibIndex == 11 and bResult == True:
    if abs(M00) >= abs(M01) and abs(M11) >= abs(M10):
        ScImageShow.ImageShowTextXY(ScImageShow, guiArray, 0, 300, "X轴正方向:{:s}".format("右" if M00 > 0 else "左"), clr, 100, 0)
        ScImageShow.ImageShowTextXY(ScImageShow, guiArray, 0, 400, "Y轴正方向:{:s}".format("下" if M11 > 0 else "上"), clr, 100, 0)
    else:
        ScImageShow.ImageShowTextXY(ScImageShow, guiArray, 0, 300, "图像XY与机构XY约90°", [255, 255, 0], 100, 0)
GvGuiDataAgent.SetGraphicDisplay("CCD2独立标定", guiArray)
GvVar.SetVar("#nCalibResult", nCalibRS)