points = GvTool.GetToolData("数组生成工具_110.输出数组")
points2 = GvVisionAssembly.scPointXYZVec()
for i in range(len(points)):
    points2.append(GvVisionAssembly.scPointXYZ(points[i].GetX(),points[i].GetY(),points[i].GetZ()))
GvTool.SetToolData("点云变换工具_121.输入三维点集",points2)