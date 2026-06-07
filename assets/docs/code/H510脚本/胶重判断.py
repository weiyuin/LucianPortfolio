# 1. 获取Gap距离数组
GapList = GvTool.GetToolData("Gap距离数组_200.输出数组")
GapList1 = GvTool.GetToolData("Gap距离数组_236.输出数组")
# 2. 从数组中提取指定位置的3个Gap测量值
GapdataA = GapList[2]  # 第3个元素（索引从0开始）
GapdataB = GapList[6]  # 第7个元素
GapdataC = GapList[12] # 第13个元素
print(GapdataA, GapdataB, GapdataC)
# 4. 计算3个Gap值的平均值
GapAvg = (GapdataA + GapdataB + GapdataC) / 3
GvVar.SetVar("#GapAvg",GapAvg)

# 5. 初始化胶水重量相关变量
GlueWeight = 0    # 第一段胶水重量参数
GlueWeight1 = 0   # 第二段胶水重量参数


# 6. 根据Gap平均值区间，匹配对应的胶水重量参数
# 小Gap区间：
if GapAvg > 0 and GapAvg < 0.34:
    GlueWeight = 8.1   
    GlueWeight1 = 4.3 
# 中Gap区间：
elif GapAvg >= 0.34 and GapAvg <= 0.7:
    GlueWeight = 12.2222*GapAvg + 3.9444
    GlueWeight1 = 4.0
# 大Gap区间：
elif GapAvg > 0.7:
    GlueWeight = 12.5
    GlueWeight1 = 3.7

point_data=("%Battery_Avg_gap_p3_p7_p13:{:.3},GapP1:{:.3},GapP2:{:.3},GapP3:{:.3},GapP4:{:.3},GapP5:{:.3},GapP6:{:.3},GapP7:{:.3},GapP8:{:.3},GapP9:{:.3},GapP10:{:.3},GapP11:{:.3},GapP12:{:.3},GapP13:{:.3},GapP14:{:.3},GapP15:{:.3},GapP16:{:.3},GapP17:{:.3},GapP18:{:.3},GapP19:{:.3},GapP20:{:.3},GapP21:{:.3},GapP22:{:.3},GapP23:{:.3},GapP24:{:.3},GapP25:{:.3},GapP26:{:.3},GapP27:{:.3},GapP28:{:.3}").format(GapAvg,GapList[0],GapList[1],GapList[2],GapList[3],GapList[4],GapList[5],GapList[6],GapList[7],GapList[8],GapList[9],GapList[10],GapList[11],GapList[12],GapList[13],GapList[14],GapList1[0],GapList1[0],GapList1[1],GapList1[2],GapList1[3],GapList1[4],GapList1[5],GapList1[6],GapList1[7],GapList1[8],GapList1[9],GapList1[10],GapList1[11])
print(point_data)
GvVar.SetVar("#strGapData",point_data)

    
print(GapAvg, GlueWeight, GlueWeight1)

GvVar.SetVar("#strGlueWeight", str(round(GlueWeight,3)) + "|" + str(GlueWeight1))