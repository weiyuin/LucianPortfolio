# Khởi tạo danh sách lưu kết quả của từng bước kiểm tra
ResultVec = []

# Khởi tạo danh sách lưu thông tin lỗi tương ứng khi từng bước kiểm tra thất bại
ErrorMessage = []

# 1. Kết quả kiểm tra của công cụ chụp ảnh 3D
ResultVec.append(GvTool.GetToolData("3D图像采集工具_019.执行结果"))
ErrorMessage.append("采集失败")

# 2. Kết quả kiểm tra của công cụ định vị hình học chuyên dụng
ResultVec.append(GvTool.GetToolData("专业几何定位_051.执行结果"))
ErrorMessage.append("几何定位失败")

# 3. Kết quả kiểm tra của công cụ tìm hình tròn
ResultVec.append(GvTool.GetToolData("找圆工具_027.执行结果"))
ErrorMessage.append("找圆失败")

# 4. Kết quả kiểm tra của công cụ mask / tạo vùng che HSG
ResultVec.append(GvTool.GetToolData("掩膜工具_037.执行结果"))
ErrorMessage.append("HSG掩膜失败")

# 5. Kết quả kiểm tra của công cụ tạo phần tử / trích xuất tâm tròn
ResultVec.append(GvTool.GetToolData("元素生成工具_373.执行结果"))
ErrorMessage.append("圆心摘取失败")

# 6. Kết quả kiểm tra của công cụ matching đa mục tiêu point cloud
ResultVec.append(GvTool.GetToolData("点云多目标匹配工具_034.执行结果"))
ErrorMessage.append("多目标匹配失败")

# 7. Kiểm tra liên quan đến đo thể tích, chỉ thực hiện khi công tắc đo thể tích được bật
if GvVar.GetVar("@bIsVolumeMeaFLag"):  # Kiểm tra cờ đo thể tích có bằng True hay không
    # 7.1 Kết quả kiểm tra của công cụ point cloud caliper dùng cho đo thể tích
    ResultVec.append(GvTool.GetToolData("点云卡尺工具_340.执行结果"))
    ErrorMessage.append("体积测量点云卡尺失败")

    # 7.2 Kết quả kiểm tra của công cụ đo dung sai dùng cho đo thể tích
    ResultVec.append(GvTool.GetToolData("公差测量工具_333.执行结果"))
    ErrorMessage.append("体积测量失败")

# 8. Kiểm tra bán kính vòng tròn pin có vượt giới hạn hay không
# Kiểm tra bán kính thực tế của vòng tròn pin có nằm trong phạm vi:
# bán kính chuẩn ± giới hạn sai số hay không. Kết quả trả về là True/False
ResultVec.append(
    GvVar.GetVar("#Circle_Radius")
    >= GvVar.GetVar("#Circle_RadiusStandard") - GvVar.GetVar("#Circle_RadiusLimit")
    and GvVar.GetVar("#Circle_Radius")
    <= GvVar.GetVar("#Circle_RadiusStandard") + GvVar.GetVar("#Circle_RadiusLimit")
)
ErrorMessage.append("电池圆半径超限")

# 9. Kiểm tra điểm số matching 3D có vượt giới hạn hay không
# Kiểm tra điểm số matching 3D có lớn hơn hoặc bằng giới hạn thấp nhất đã cài đặt hay không
ResultVec.append(GvVar.GetVar("#dScore_3D") >= GvVar.GetVar("#dSeacher3DLimit"))
ErrorMessage.append("匹配得分超限")

# 10. Kiểm tra độ lệch theo hướng X của matching 3D có vượt giới hạn hay không
# Kiểm tra trị tuyệt đối độ lệch X có nhỏ hơn hoặc bằng giới hạn sai số theo hướng X hay không
ResultVec.append(
    abs(GvVar.GetVar("#dSeacher3D_X")) <= GvVar.GetVar("#dSeacher3DLimit_X")
)
ErrorMessage.append("匹配X向超限")

# 11. Kiểm tra độ lệch theo hướng Y của matching 3D có vượt giới hạn hay không
ResultVec.append(
    abs(GvVar.GetVar("#dSeacher3D_Y")) <= GvVar.GetVar("#dSeacher3DLimit_Y")
)
ErrorMessage.append("匹配Y向超限")

# 12. Kiểm tra độ lệch theo hướng Z của matching 3D có vượt giới hạn hay không
ResultVec.append(
    abs(GvVar.GetVar("#dSeacher3D_Z")) <= GvVar.GetVar("#dSeacher3DLimit_Z")
)
ErrorMessage.append("匹配Z向超限")

# 13. Kiểm tra cáp FPC / dây cáp mềm
if GvVar.GetVar("@bIsFlaxFLag"):
    ResultVec.append(
        GvTool.GetToolData("灰度检测工具_598.平均灰度值")
        > GvVar.GetVar("#FlaxGrayLower")
    )
    ErrorMessage.append("排线灰度NG")


# Đánh giá kết quả tổng
print(ResultVec)

if False in ResultVec:
    error_msgs = []

    for idx, res in enumerate(ResultVec):
        if not res:
            error_msgs.append(ErrorMessage[idx])

    error_str = ";".join(error_msgs)

    GvVar.SetVar("#nErrorCode", 1)
    GvVar.SetVar("#sLocalResult", "NG:" + error_str)
    GvVar.SetVar("#strColor", 0)
    GvVar.SetVar("#strFlag", "NG")

    print(GvVar.GetVar("#sLocalResult"))

else:
    GvVar.SetVar("#nErrorCode", 0)
    GvVar.SetVar("#sLocalResult", "OK")
    GvVar.SetVar("#strColor", 1)
    GvVar.SetVar("#strFlag", "OK")

    print(0)
