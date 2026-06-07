baseplane = GvTool.GetToolData("点云平面拟合工具_053.平面拟合结果")

# Thông tin pháp tuyến của mặt hợp khuôn / mặt chuẩn
normal = baseplane.GetNormal()
pos = baseplane.GetPos()

# Lấy 3 điểm nằm trên mặt hợp khuôn / mặt chuẩn
p1 = GvVisionAssembly.sc3DPoint()
p2 = GvVisionAssembly.sc3DPoint()
p3 = GvVisionAssembly.sc3DPoint()
baseplane.Get3Points(p1, p2, p3)

# Xây dựng một mặt phẳng vuông góc với mặt hợp khuôn / mặt chuẩn
line1 = GvVisionAssembly.sc3DLine()
line1.SetDirection(normal)
line1.SetPos(p3)

p4 = GvVisionAssembly.sc3DPoint()
p5 = GvVisionAssembly.sc3DPoint()
line1.GetStartEndPoints(p4, p5)
plane1 = GvVisionAssembly.sc3DPlane(pos, p4, p5)

# Khởi tạo và gán thông số cho khối hộp chữ nhật ROI
Cuboid = GvVisionAssembly.scVoxelCuboid()
Cuboid.SetCuboidHeightDirection(normal)
Cuboid.SetCuboidWidthDirection(plane1.GetNormal())
Cuboid.SetCuboidHeight(3)
Cuboid.SetCuboidLength(30)
Cuboid.SetCuboidWidth(30)
Cuboid.SetCuboidCenterPoint(
    GvVisionAssembly.sc3DPoint(pos.GetX(), pos.GetY(), pos.GetZ())
)

GvTool.SetToolData("上下裁切后点云_055.长方体ROI", Cuboid)
