Img = GvTool.GetToolData("深度图像源_022.输出深度图像")
GvTool.SetToolData("点云投影彩色图工具_554.X起始位置",Img.GetRangeParam().XOffset)
GvTool.SetToolData("点云投影彩色图工具_554.Y起始位置",Img.GetRangeParam().YOffset)

GvTool.SetToolData("点云投影彩色图工具_554.输出图像宽度",Img.Width())
GvTool.SetToolData("点云投影彩色图工具_554.输出图像高度",Img.Height())

GvTool.SetToolData("点云投影彩色图工具_554.X像素当量",Img.GetRangeParam().XResolution)
GvTool.SetToolData("点云投影彩色图工具_554.X像素当量",Img.GetRangeParam().YResolution)

