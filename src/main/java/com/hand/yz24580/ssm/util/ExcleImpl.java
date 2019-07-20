package com.hand.yz24580.ssm.util;

import com.hand.yz24580.ssm.pojo.Item;
import com.hand.yz24580.ssm.pojo.Person;
import org.apache.poi.hssf.usermodel.*;

import javax.servlet.ServletOutputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

public class ExcleImpl {
    public void export(String[] titles, ServletOutputStream out, List<Item> itemList) throws Exception{
        try{
            // 第一步，创建一个workbook，对应一个Excel文件
            HSSFWorkbook workbook = new HSSFWorkbook();

            // 第二步，在webbook中添加一个sheet,对应Excel文件中的sheet
            HSSFSheet hssfSheet = workbook.createSheet("sheet1");

            // 第三步，在sheet中添加表头第0行,注意老版本poi对Excel的行数列数有限制short
            hssfSheet.autoSizeColumn(1,true);
            HSSFRow row = hssfSheet.createRow(0);
            // 第四步，创建单元格，并设置值表头 设置表头居中
            HSSFCellStyle hssfCellStyle = workbook.createCellStyle();

            // 1.生成字体对象
            HSSFFont font = workbook.createFont();
            font.setFontHeightInPoints((short) 12);
            font.setFontName("新宋体");
            // 2.生成样式对象，这里的设置居中样式和版本有关，我用的poi用HSSFCellStyle.ALIGN_CENTER会报错，所以用下面的
            hssfCellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);//设置居中样式
            hssfCellStyle.setFont(font); // 调用字体样式对象
            hssfCellStyle.setWrapText(true);

            //居中样式
            hssfCellStyle.setAlignment(HSSFCellStyle.ALIGN_CENTER);

            HSSFCell hssfCell = null;
            for (int i = 0; i < titles.length; i++) {
                hssfCell = row.createCell(i);//列索引从0开始
                hssfCell.setCellValue(titles[i]);//列名1
                hssfCell.setCellStyle(hssfCellStyle);//列居中显示
            }



            for (int i = 0; i < itemList.size(); i++) {
                row = hssfSheet.createRow(i+1);
                Item item = itemList.get(i);

                // 第六步，创建单元格，并设置值
                String  itemCode = null;
                if(item.getItemCode() != null){
                    itemCode = item.getItemCode();
                }
                row.createCell(0).setCellValue(itemCode);

                String itemDescription = "";
                if(item.getItemDescription() != null){
                    itemDescription = item.getItemDescription();
                }
                row.createCell(1).setCellValue(itemDescription);

                String itemUom = "";
                if(item.getItemUom() != null){
                    itemUom = item.getItemUom();
                }
                row.createCell(2).setCellValue(itemUom);

                DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                String startActiveDate = "";
                if(item.getStartActiveDate() !=null){
                    startActiveDate = format.format(item.getStartActiveDate());
                }
                row.createCell(3).setCellValue(startActiveDate);

                String endActiveDate = "";
                if(item.getStartActiveDate() !=null){
                    endActiveDate = format.format(item.getEndActiveDate());
                }
                row.createCell(4).setCellValue(endActiveDate);

                String enabledFlag = "";
                if(item.getEnabledFlag() == 1){
                    enabledFlag = "是";
                }else {
                    enabledFlag = "否";
                }
                row.createCell(5).setCellValue(enabledFlag);
            }

            // 第七步，将文件输出到客户端浏览器
            try {
                workbook.write(out);
                out.flush();
                out.close();

            } catch (Exception e) {
                e.printStackTrace();
            }
        }catch(Exception e){
            e.printStackTrace();
            throw new Exception("导出信息失败！");

        }
    }
}
