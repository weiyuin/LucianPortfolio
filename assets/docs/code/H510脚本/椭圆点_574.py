points = GvVisionAssembly.sc2VectorVec()
img = GvTool.GetToolData("旋转镜像工具_587.输出图像")
startP =GvTool.GetToolData("找圆工具_027.圆心")
for y in range(int(startP.GetY()),1000,1):
    for x in range(int(startP.GetX()),1000,1):
        if img.GetPixelValue(x,y) > 100:
            points.append(GvVisionAssembly.sc2Vector(x,y))
GvTool.SetToolData("椭圆拟合工具_575.输入点集",points)
