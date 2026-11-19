import json
import GvGluePathAOI
import os
import time
import math
import datetime
import hashlib
# 获取异型胶检测结果
str_10 = GvTool.GetToolData("异形胶检R8_2405.缺陷序列化结果")
str_11 = GvTool.GetToolData("异形胶检R9_2402.缺陷序列化结果")
str_12 = GvTool.GetToolData("异形胶检测工具_2404.缺陷序列化结果")

str_2 = GvTool.GetToolData("异形胶检测工具_2376.缺陷序列化结果")

str_3 = GvTool.GetToolData("异形胶检测工具_2582.缺陷序列化结果")

#获取缺胶结果
# nStateHole=GvVar.GetVar("#nStateHole")
# 获取异型胶检测结果
str_10=json.loads(str_10)
str_11=json.loads(str_11)
str_12=json.loads(str_12)

str_2=json.loads(str_2)



# 获取结果处理操作类
result_opr = GvGluePathAOI.result_operator()
# 合并ROI和coverage shift
str_out1 = result_opr.add(str_10,str_11)
str_out11 = result_opr.merge(str_out1,str_2)

print(type(str_out1))
str_out = result_opr.add(str_out11,str_12)


#获取E字形三条coverageline数据
str_3=json.loads(str_3)

####左边数据获取
data_R1,errorcode_R1=result_opr.data_obtain(str_3,[0,1,2],5)
print(data_R1)
max_R1=max(data_R1)
print(max_R1)
# #左边数据写回
str_2=result_opr.data_replace(str_2,[max_R1],[0],5)


####右边数据获取
data_L1,eLLoLcode_L1=result_opr.data_obtain(str_3,[3,4,5],5)
max_L1=max(data_L1)
print(max_L1)
#右边数据写回
str_2=result_opr.data_replace(str_2,[max_L1],[1],5)


# #结束

#####获取str_2的胶占比信息
coverageShift=[]

# #左
region=[0]
coverageShift2,temp1=result_opr.data_obtain(str_2,region,5)
mincoverageShift2=min(coverageShift2)
coverageShift.append(mincoverageShift2)
#右
region=[1]
coverageShift1,temp1=result_opr.data_obtain(str_2,region,5)
mincoverageShift1=coverageShift1[0]
coverageShift.append(mincoverageShift1)

# str_out = result_opr.merge(str_out,str_2)
str_out=result_opr.data_replace(str_out,coverageShift,[0,1],5)


####COF
thred_miss = GvVar.GetVar("@dMissingThreshold")
thred_break = 0.5
thred_hole = 99
thred_coverage = 0.5
#显示及修改的区域
list_region=[0,1,2,3,4]
str_out=result_opr.recalculate_result(str_out,thred_miss,thred_break,thred_hole,thred_coverage,list_region)
# # 显示
guiArray = GvVisionAssembly.GcScriptGuiArray()

gui_opr = GvGluePathAOI.glue_display()

###设置想显示的区域
# list_region=[0]
#显示一般信息
# guiArray = gui_opr.show_general_data(guiArray,str_out,list_region,120,20,20,0,2,None,True,True,True,False,False,False)
guiArray = gui_opr.show_general_data_Ex2(guiArray,str_out,list_region,120,20,20,0,2,True,False,False,False,False)
###设置想显示的区域
# list_region=[0]
#显示检测ROI
guiArray = gui_opr.show_detetion_Region(guiArray,str_out,list_region,False,80,3,True,False)
list_region1=[0,1,2,3,4,5]
guiArray = gui_opr.show_detetion_Region(guiArray,str_3,list_region1,True,30)


#各区域NG信息显示
guiArray = gui_opr.show_NG_data(guiArray,str_out,0,80,150,-100,0,None,False)
guiArray = gui_opr.show_NG_data(guiArray,str_out,1,80,-1000,-150,0,None,False)
guiArray = gui_opr.show_NG_data(guiArray,str_out,2,80,-750,-40,0,None,False)
guiArray = gui_opr.show_NG_data(guiArray,str_out,3,80,-750,-40,0,None,False)
guiArray = gui_opr.show_NG_data(guiArray,str_out,4,80,-750,-40,0,None,False)

# ----------------------------------------------------------------
# 存储
db_opr = GvGluePathAOI.database_operator()
str_file_path = GvVar.GetVar("@filePath1")
str_path_cap = GvVar.GetVar("#strImgPathCapSnd")
str_path_src = GvVar.GetVar("#strImgPathSrcSnd")
strtime=str(datetime.datetime.now().strftime('%Y%m%d'))

db_opr.set_pos(3)
# db_opr.record_datas(str_out,str_file_path,strtime,str_path_cap,str_path_src,1)


GvGuiDataAgent.SetGraphicDisplay("CCD2复检3", guiArray)

# #____________________存储图片路径结果赋值
error_code=str_out["base_info"]["error_code"]
print(error_code)

GvVar.SetVar("#error_code_3",error_code)


if error_code==1 :
    strFlag="NG"
elif error_code==2 :
    strFlag="OK"
else:
    strFlag="OK"
GvVar.SetVar("#error_code",error_code)

strCurDate=datetime.datetime.now().strftime('%Y-%m-%d')
strCurDateNOW=datetime.datetime.now().strftime('%H%M%S')

#获取标定Mark点集
nImgIndex=GvVar.GetVar("#strCMD0")
SN=GvVar.GetVar("#strSN")
ImageNum = GvVar.GetVar("#ImageNum") 
dCT=GvTool.GetToolData("计时结束_2235.计时时长")
Pix=GvVar.GetVar("#Pix_X")


#原图
strImgPathSrc = strCurDate+"\\"+"CCD2"+"\\"+strFlag+"\\"+SN+"\\H37-FT220-"+SN+"-"+"Recheck"+"-"+"SRC"+"-"+ strCurDateNOW + strFlag + "-1#CCD2_3"
strImgPathSrcSnd = "E:\\GVIMAGES\\"+strImgPathSrc+".jpg"
GvVar.SetVar("#strImgPathSrcSnd",strImgPathSrcSnd)
GvVar.SetVar("#strImgPathSrc",strImgPathSrc)
print(strImgPathSrc)


#截图
strImgPathCapAI = strCurDate+"\\"+"CCD2"+"\\"+"AI"+"\\"+SN+"\\H37-FT220-"+SN+"-"+"Recheck"+"-"+"CAP"+"-"+ strCurDateNOW + strFlag + "-1#CCD2_3"
GvVar.SetVar("#strImgPathCapAI3",strImgPathCapAI)

strImgPathCap = strCurDate+"\\"+"CCD2"+"\\"+strFlag+"\\"+SN+"\\H37-FT220-"+SN+"-"+"Recheck"+"-"+"CAP"+"-"+ strCurDateNOW + strFlag + "-1#CCD2_3"
strImgPathCap1= "MES\\"+strCurDate+"\\"+"CCD2"+"\\"+SN+"\\H37-FT220-"+SN+"-"+"Recheck"+"-"+"CAP"+"-"+ strCurDateNOW + strFlag + "-1#CCD2_3"
strImgPathCapSnd = "E:\\GVIMAGES\\"+strImgPathCap1+".jpg"

GvVar.SetVar("#strImgPathCap1",strImgPathCap1)
GvVar.SetVar("#strImgPathCap",strImgPathCap)
GvVar.SetVar("#strImgPathCapSnd",strImgPathCapSnd)
print(strImgPathCap1)




####操作日志复制

path="E:\LusterCache\OperationLog\GluePathAOI"
#获取文件夹下全路径 
def get_all_paths(directory):
    paths = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            paths.append(file_path)
    return paths
    
AllPath=get_all_paths(path)
#获取Txt文件名
txtNames1=[]
for file in AllPath:
    txtName=file.split('\\')
    txtNames1.append(txtName[-1])
#获取包含Produce文件名
txtNames2=[]
for ProduceName in txtNames1:
    if ProduceName.find("Produce")!=-1:
        txtNames2.append(ProduceName)
#给Produce文件名赋值全路径
txtPath=[]
for txtName in txtNames2:
    txtPath.append(path+'\\'+txtName)
#按照时间排序排序
try: 
    txtPath= sorted(txtPath)
    txtPathstr= txtPath[-1]
    print(txtPathstr)
except:
    print("-1")


##Hash Code

def CalcSha1(txtPathstr):
    with open(txtPathstr,'rb') as f:
        shalobi=hashlib.sha1()
        shalobi.update(f.read())
        hashs = shalobi.hexdigest()
    return hashs

hashs=CalcSha1(txtPathstr)

#_____________________________通讯发送结果
error_code=str_out["base_info"]["error_code"]

if error_code==1 :
    strFlag="NG"
    
else:
    strFlag="OK"
reflow_3 = 0
if GvTool.GetToolData("Blob工具_2727.执行结果"):
    Blob_area = GvTool.GetToolData("Blob工具_2727.总像素数")
    if Blob_area < 21000:
     reflow_3 = 1
     reflow_message = "LineFlag:3"
     strflag_reflow = "NG"
    else:
     reflow_3 = 0 #残胶ok
     reflow_message = "LineFlag:"
     strflag_reflow = "OK"
else:
    Blob_area = 999999
    reflow_3 = 1
    reflow_message = "LineFlag:3"
    strflag_reflow = "NG"
GvVar.SetVar("#reflow_3",reflow_3)     
#MES上传
mes_opr = GvGluePathAOI.mes_upload()
str_mes = mes_opr.get_mes_info_ex(str_out,3)
str_mes = str_mes.replace(",","?")


#####0:OK,1:NG,2:COF
error_code_1=GvVar.GetVar("#error_code_1")
error_code_2=GvVar.GetVar("#error_code_2")
error_code_3=GvVar.GetVar("#error_code_3")
# error_code_1 = 0 
# error_code_2 = 0
# error_code_3 = 0 

if error_code_1 == 1 or error_code_2 == 1 or error_code_3 == 1 :
    error_code = 1
elif error_code_1 == 2 or error_code_2 == 2 or error_code_3 == 2 :
    error_code = 2
else:
    error_code = 0
# print(error_code)
if error_code==1 :
    strFlag_gross="NG"
    strSndFlag = "0"
    strFlag="NG"
elif error_code==0 :
    strFlag_gross="OK"
    strSndFlag = "1"
    strFlag="OK"
elif error_code==2 :
    strFlag_gross="OK"
    strSndFlag = "1"
    strFlag="OK"
print(strSndFlag)    
    
#发送赋值
Station=GvVar.GetVar("#Station")
Station1=GvVar.GetVar("#Station1")
Position_Recheck=GvVar.GetVar("#Position_Recheck")
###获取前两次结果
strSndMsg_1 = GvVar.GetVar("#strSndMsg_1")
strSndMsg_2 = GvVar.GetVar("#strSndMsg_2")

#发送内容赋值     
strSnd="{:s},{:s},{:s},{:s},{:s},{:s},,{:s}".format(Station,Station1,Position_Recheck,strFlag_gross,strImgPathCapSnd,strFlag_gross,str_mes)
strSnd_strFlag = "Result:"+strSnd.split(",")[5]
strSnd_NGMsg = "NGMsg:"
strSnd_IsShow = "IsShow:1"
strSnd_Key = "Key:"+strSnd.split(",")[7]
strSnd_Key_1 = strSnd_Key[:4] + strSndFlag + "?"
strSnd_Key_2 = strSnd_Key[6:]
strSnd_gross = "{:s}@{:s}@{:s}@{:s}@{:s}".format("gross",strSndFlag,strFlag_gross,"","?")
strSnd =  ",".join(strSnd.split(",")[:5]) + "," + strSnd_strFlag + ";" + strSnd_NGMsg + ";" +strSnd_IsShow + ";" + strSnd_Key_1 \
+ strSnd_gross + strSndMsg_1 + strSndMsg_2 + strSnd_Key_2 + ";" + reflow_message
print(strSnd)
# print(strSnd)


GvVar.SetVar("#strSndMsg",strSnd)
GvVar.SetVar("#strFlag_gross",strFlag_gross)
   
