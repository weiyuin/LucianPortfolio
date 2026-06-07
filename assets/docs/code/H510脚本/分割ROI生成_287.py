baseplane = GvTool.GetToolData("元素生成工具_295.输出三维平面")

# 合模面法向信息
normal = baseplane.GetNormal()
pos = baseplane.GetPos()


# 合模面上3个点
p1 = GvVisionAssembly.sc3DPoint()
p2 = GvVisionAssembly.sc3DPoint()
p3 = GvVisionAssembly.sc3DPoint()
baseplane.Get3Points(p1, p2, p3)

# 构建垂直于合模面的平面
line1 = GvVisionAssembly.sc3DLine()
line1.SetDirection(normal)
line1.SetPos(p3)

p4 = GvVisionAssembly.sc3DPoint()
p5 = GvVisionAssembly.sc3DPoint()
line1.GetStartEndPoints(p4, p5)
plane1 = GvVisionAssembly.sc3DPlane(pos, p4, p5)

#长方体建立赋值
Cuboid = GvVisionAssembly.scVoxelCuboid()
Cuboid.SetCuboidHeightDirection(normal)
Cuboid.SetCuboidWidthDirection(plane1.GetNormal())
Cuboid.SetCuboidHeight(10)
Cuboid.SetCuboidLength(30)
Cuboid.SetCuboidWidth(30)
Cuboid.SetCuboidCenterPoint(GvVisionAssembly.sc3DPoint(pos.GetX(),pos.GetY(),pos.GetZ()))

GvTool.SetToolData("上下裁切后点云_288.长方体ROI",Cuboid)

