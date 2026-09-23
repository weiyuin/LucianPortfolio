from ScImageShow import ScImageShow
guiArray = GvVisionAssembly.GcScriptGuiArray()

bResult = GvTool.GetToolData("CCD1关联标定计算工具_016.执行结果")
calibResult = GvTool.GetToolData("CCD1关联标定计算工具_016.标定结果")
M00 = calibResult.Matrix.GetElement(0, 0)
M11 = calibResult.Matrix.GetElement(1, 1)
# 初始结果
if bResult == True:
    nCalibRS = 1
    calib_Msg = "CCD1 关联标定OK"
else:
    nCalibRS = 0
    calib_Msg = "CCD2 关联标定NG"
if nCalibRS == 0:
    clr = [255, 0, 0]
else:
    clr = [0, 255, 0]
ScImageShow.ImageShowTextXY(ScImageShow, guiArray, 0, 0, calib_Msg, clr, 200, 0)
ScImageShow.ImageShowTextXY(ScImageShow, guiArray, 0, 300, "X轴正方向:{:s}".format("右" if M00 > 0 else "左"), clr, 200, 0)
ScImageShow.ImageShowTextXY(ScImageShow, guiArray, 0, 600, "Y轴正方向:{:s}".format("下" if M11 > 0 else "上"), clr, 200, 0)
ScImageShow.ImageShowTextXY(ScImageShow, guiArray, 0, 900, "像素当量X:{:s}".format(str(abs(round(M00,4)))), clr, 200, 0)
ScImageShow.ImageShowTextXY(ScImageShow, guiArray, 0, 1200, "像素当量Y:{:s}".format(str(abs(round(M11,4)))), clr, 200, 0)
GvGuiDataAgent.SetGraphicDisplay("CCD1关联标定", guiArray)
GvVar.SetVar("#nCalibResult", nCalibRS)