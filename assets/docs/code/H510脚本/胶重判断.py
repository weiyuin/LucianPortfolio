# 1. Lấy mảng khoảng cách Gap
GapList = GvTool.GetToolData("Gap距离数组_200.输出数组")
GapList1 = GvTool.GetToolData("Gap距离数组_236.输出数组")

# 2. Trích xuất 3 giá trị Gap tại các vị trí chỉ định trong mảng
GapdataA = GapList[2]  # Phần tử thứ 3, index bắt đầu từ 0
GapdataB = GapList[6]  # Phần tử thứ 7
GapdataC = GapList[12]  # Phần tử thứ 13

print(GapdataA, GapdataB, GapdataC)

# 4. Tính giá trị trung bình của 3 giá trị Gap
GapAvg = (GapdataA + GapdataB + GapdataC) / 3
GvVar.SetVar("#GapAvg", GapAvg)

# 5. Khởi tạo các biến liên quan đến trọng lượng keo
GlueWeight = 0  # Tham số trọng lượng keo đoạn thứ nhất
GlueWeight1 = 0  # Tham số trọng lượng keo đoạn thứ hai


# 6. Dựa theo khoảng giá trị Gap trung bình để chọn tham số trọng lượng keo tương ứng

# Khoảng Gap nhỏ:
if GapAvg > 0 and GapAvg < 0.34:
    GlueWeight = 8.1
    GlueWeight1 = 4.3

# Khoảng Gap trung bình:
elif GapAvg >= 0.34 and GapAvg <= 0.7:
    GlueWeight = 12.2222 * GapAvg + 3.9444
    GlueWeight1 = 4.0

# Khoảng Gap lớn:
elif GapAvg > 0.7:
    GlueWeight = 12.5
    GlueWeight1 = 3.7


point_data = (
    "%Battery_Avg_gap_p3_p7_p13:{:.3},"
    "GapP1:{:.3},GapP2:{:.3},GapP3:{:.3},GapP4:{:.3},GapP5:{:.3},"
    "GapP6:{:.3},GapP7:{:.3},GapP8:{:.3},GapP9:{:.3},GapP10:{:.3},"
    "GapP11:{:.3},GapP12:{:.3},GapP13:{:.3},GapP14:{:.3},GapP15:{:.3},"
    "GapP16:{:.3},GapP17:{:.3},GapP18:{:.3},GapP19:{:.3},GapP20:{:.3},"
    "GapP21:{:.3},GapP22:{:.3},GapP23:{:.3},GapP24:{:.3},GapP25:{:.3},"
    "GapP26:{:.3},GapP27:{:.3},GapP28:{:.3}"
).format(
    GapAvg,
    GapList[0],
    GapList[1],
    GapList[2],
    GapList[3],
    GapList[4],
    GapList[5],
    GapList[6],
    GapList[7],
    GapList[8],
    GapList[9],
    GapList[10],
    GapList[11],
    GapList[12],
    GapList[13],
    GapList[14],
    GapList1[0],
    GapList1[0],
    GapList1[1],
    GapList1[2],
    GapList1[3],
    GapList1[4],
    GapList1[5],
    GapList1[6],
    GapList1[7],
    GapList1[8],
    GapList1[9],
    GapList1[10],
    GapList1[11],
)

print(point_data)

# Lưu chuỗi dữ liệu Gap vào biến hệ thống
GvVar.SetVar("#strGapData", point_data)

print(GapAvg, GlueWeight, GlueWeight1)

# Lưu tham số trọng lượng keo theo định dạng: trọng lượng đoạn 1 | trọng lượng đoạn 2
GvVar.SetVar("#strGlueWeight", str(round(GlueWeight, 3)) + "|" + str(GlueWeight1))
