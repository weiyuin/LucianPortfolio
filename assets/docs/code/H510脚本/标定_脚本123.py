points = GvTool.GetToolData("点云变换工具_121.输出三维点集")
RatioX = (points[2].GetX() - points[1].GetX() + points[1].GetX() - points[0].GetX())/2
RatioY = (points[4].GetY() - points[3].GetY() + points[3].GetY() - points[2].GetY())/2
RatioZ = (points[6].GetZ() - points[5].GetZ() + points[5].GetZ() - points[4].GetZ())/2
Message = " "
if RatioX < 0 and RatioY > 0 and RatioZ <0:
    Message = "标定方向正确  "
else:
    Message = "标定方向错误  "

if abs(RatioX)-1 < 0.01 and abs(RatioY)-1 < 0.01 and abs(RatioZ)-1 < 0.01:
    Message += "标定比例正确  "
else:
    Message += "标定比例错误  "


print(abs(RatioX)-1)
print(abs(RatioY)-1) 
print(abs(RatioZ)-1) 

print(Message)
Message += "\nX："+str(round((abs(RatioX)-1),5)) + "(spec:0±0.01)"
Message += "\nY："+str(round((abs(RatioY)-1),5)) + "(spec:0±0.01)"
Message += "\nZ："+str(round((abs(RatioZ)-1),5)) + "(spec:0±0.01)"


GvVar.SetVar("#sAxisCalibrationMessage",Message)