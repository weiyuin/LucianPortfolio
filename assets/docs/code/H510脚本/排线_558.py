points = GvVisionAssembly.sc2VectorVec()
img = GvTool.GetToolData("掩膜工具_559.输出图像")

for y in range(0,img.Height(),4):
    for x in range(0,img.Width(),4):
        if img.GetPixelValue(x,y) > 50:
            points.append(GvVisionAssembly.sc2Vector(x,y))
            
GvTool.SetToolData("点集摘取工具_557.输入灰度图点集",points)