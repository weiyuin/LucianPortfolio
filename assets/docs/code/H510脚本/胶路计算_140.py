#实时胶路点
Real_Points=GvVisionAssembly.scPointXYZVec()
Points1 = GvTool.GetToolData("数组生成工具_199.输出数组")
Points2 = GvTool.GetToolData("数组生成工具_209.输出数组")

for i in range(len(Points1)):
    Point=GvVisionAssembly.scPointXYZ(Points1[i].GetX(),Points1[i].GetY(),Points1[i].GetZ())
    Real_Points.append(Point)  
    
for i in range(len(Points2)):
    Point=GvVisionAssembly.scPointXYZ(Points2[i].GetX(),Points2[i].GetY(),Points2[i].GetZ())
    Real_Points.append(Point)  
    #第二段起始点需要多发一次
    if i == 0:
        Real_Points.append(Point)  
    
    
GvTool.SetToolData("点云变换工具_285.输入三维点集",Real_Points)

