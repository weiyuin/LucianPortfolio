M=GvTool.GetToolData("点云坐标系对齐工具_100.刚性变换矩阵").GetMatrix()
T=GvTool.GetToolData("点云坐标系对齐工具_100.刚性变换矩阵").GetTrans()
Col1=str(M.GetElement(0,0))+"  "+str(M.GetElement(0,1))+"  "+str(M.GetElement(0,2))+"  "+str(T.GetX())
Col2=str(M.GetElement(1,0))+"  "+str(M.GetElement(1,1))+"  "+str(M.GetElement(1,2))+"  "+str(T.GetY())
Col3=str(M.GetElement(2,0))+"  "+str(M.GetElement(2,1))+"  "+str(M.GetElement(2,2))+"  "+str(T.GetZ())
Data=Col1+"\n"+Col2+"\n"+Col3
print(Data)
GvTool.SetToolData("TXT文本写入工具_103.写入内容",Data)