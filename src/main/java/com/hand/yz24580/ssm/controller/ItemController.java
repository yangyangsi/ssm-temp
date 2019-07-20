package com.hand.yz24580.ssm.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.hand.yz24580.ssm.pojo.Item;
import com.hand.yz24580.ssm.pojo.ItemExample;
import com.hand.yz24580.ssm.pojo.Msg;
import com.hand.yz24580.ssm.pojo.Student;
import com.hand.yz24580.ssm.service.ItemService;
import com.hand.yz24580.ssm.util.ExcleImpl;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller
public class ItemController {

    @Autowired
    ItemService itemService;

    //根据id查询物料
    @RequestMapping(value = "/item/{id}",method = RequestMethod.GET)
    @ResponseBody
    public Msg getItem(@PathVariable("id")Integer id){

        Item item = itemService.getItem(id);
        return Msg.success().add("item",item);
    }

    @RequestMapping(value="/item",method= RequestMethod.POST)
    @ResponseBody
    public Msg saveItemPost(@Valid Item item,BindingResult result){
        System.out.println(item);
        if(result.hasErrors()){
            //校验失败，应该返回失败，在模态框中显示校验失败的错误信息
            Map<String, Object> map = new HashMap<>();
            List<FieldError> errors = result.getFieldErrors();
            for (FieldError fieldError : errors) {
                System.out.println("错误的字段名："+fieldError.getField());
                System.out.println("错误信息："+fieldError.getDefaultMessage());
                map.put(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return Msg.fail().add("errorFields", map);
        }else {
            itemService.saveItem(item);
            return Msg.success();
        }
    }

    //保存物料资料
    @ResponseBody
    @RequestMapping(value="/item/{itemId}",method = RequestMethod.PUT)
    public Msg saveItemPut(@Valid Item item,BindingResult result){
        System.out.println(item);
        if(result.hasErrors()){
            //校验失败，应该返回失败，在模态框中显示校验失败的错误信息
            Map<String, Object> map = new HashMap<>();
            List<FieldError> errors = result.getFieldErrors();
            for (FieldError fieldError : errors) {
                System.out.println("错误的字段名："+fieldError.getField());
                System.out.println("错误信息："+fieldError.getDefaultMessage());
                map.put(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return Msg.fail().add("errorFields", map);
        }else {
            itemService.updateItemById(item);
            return Msg.success();
        }
    }

    //删除物料
    @ResponseBody
    @RequestMapping(value="/item/{ids}",method= RequestMethod.DELETE)
    public Msg deleteItem(@PathVariable("ids")String ids){
        //批量删除
        if(ids.contains("-")){
            List<Integer> del_ids = new ArrayList<>();
            String[] str_ids = ids.split("-");
            //组装id的集合
            for (String string : str_ids) {
                del_ids.add(Integer.parseInt(string));
            }
            itemService.deleteBatch(del_ids);
        }else{
            Integer id = Integer.parseInt(ids);
            itemService.deleteItemById(id);
        }
        return Msg.success();
    }

    @RequestMapping("/items")
    @ResponseBody
    public Msg getEmpsWithJson(
            @RequestParam(value = "pn", defaultValue = "1") Integer pn, @RequestParam(value = "pageCountNum", defaultValue = "5")Integer pageCountNum) {
        // 这不是一个分页查询
        // 引入PageHelper分页插件
        // 在查询之前只需要调用，传入页码，以及每页的大小
        PageHelper.startPage(pn, pageCountNum);
        // startPage后面紧跟的这个查询就是一个分页查询
        List<Item> items = itemService.getAll();
        // 使用pageInfo包装查询后的结果，只需要将pageInfo交给页面就行了。
        // 封装了详细的分页信息,包括有我们查询出来的数据，传入连续显示的页数
        PageInfo page = new PageInfo(items, 5);
        return Msg.success().add("pageInfo", page);
    }

    @RequestMapping("/itemsexample")
    @ResponseBody
    public Msg getItemsWithExample(@RequestParam(value = "pn", defaultValue = "1") Integer pn,
                                   @RequestParam(value = "pageCountNum", defaultValue = "5")Integer pageCountNum,Item item,@RequestParam(value = "isAsc",defaultValue = "true")Boolean isAsc){

        PageHelper.startPage(pn, pageCountNum);
        if(item.getItemCode()==""){
            item.setItemCode(null);
        }
        if(item.getItemDescription()==""){
            item.setItemDescription(null);
        }
        ItemExample itemExample = new ItemExample();
        itemExample.setItem(item);
        itemExample.setAsc(isAsc);
        System.out.println(itemExample.getItem());
        List<Item> items = itemService.getItemsByExample(itemExample);
        PageInfo page = new PageInfo(items, 5);
        return Msg.success().add("pageInfo", page);
    }

    @RequestMapping("/itemsisasc")
    @ResponseBody
    public Msg getItemsWithAsc(@RequestParam(value = "pn", defaultValue = "1") Integer pn,
                                   @RequestParam(value = "pageCountNum", defaultValue = "5")Integer pageCountNum,Item item,@RequestParam(value = "isAsc",defaultValue = "true")Boolean isAsc){

        PageHelper.startPage(pn, pageCountNum);
        ItemExample itemExample=new ItemExample();
        itemExample.setAsc(isAsc);
        itemExample.setItem(new Item());
        List<Item> items = itemService.getItemsByExample(itemExample);
        PageInfo page = new PageInfo(items, 5);
        return Msg.success().add("pageInfo", page);
    }

    ExcleImpl excleImpl=new ExcleImpl();
    //导出EXCL
    @RequestMapping("/getExcel")
    @ResponseBody
    public String getExcel(HttpServletResponse response, @RequestParam(value = "itemIds",required = false)List<Integer> itemIds) {
        List<Item> itemList = itemService.getItemsByIds(itemIds);

        response.setContentType("application/binary;charset=UTF-8");
        try{
            ServletOutputStream out=response.getOutputStream();
            try {
                //设置文件头：最后一个参数是设置下载文件名(这里我们叫：张三.pdf)
                response.setHeader("Content-Disposition", "attachment;fileName=" + URLEncoder.encode("sss.xls", "UTF-8"));
            } catch (UnsupportedEncodingException e1) {
                e1.printStackTrace();
            }

            String[] titles = { "物料编码", "物料描述", "物料单位", "生成时间从","生效时间至","是否启用" };
            excleImpl.export(titles, out,itemList);
            return "success";
        } catch(Exception e){
            e.printStackTrace();
            return "导出信息失败";
        }
    }




}
