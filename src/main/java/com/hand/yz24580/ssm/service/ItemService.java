package com.hand.yz24580.ssm.service;

import com.hand.yz24580.ssm.mapper.ItemMapper;
import com.hand.yz24580.ssm.pojo.Item;
import com.hand.yz24580.ssm.pojo.ItemExample;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ItemService {
    @Autowired
    private ItemMapper itemMapper;

    //查询所有物料
    @Transactional
    public List<Item> getAll(){
        return itemMapper.getItemsByExample(null);
    }

    //通过id来查找对应的物料
    @Transactional
    public Item getItem(Integer id){
        return itemMapper.getItemById(id);
    }

    //物料保存
    @Transactional
    public void saveItem(Item item){
        String itemCode = itemCodeAddOne(itemMapper.getItemCodeMax());
        item.setItemCode(itemCode);
        itemMapper.insertItem(item);
    }

    //删除物料
    @Transactional
    public void deleteItemById(Integer id){
        itemMapper.deleteItemByItemId(id);
    }

    //批量删除
    @Transactional
    public void deleteBatch(List<Integer> ids){
        itemMapper.deleteBatch(ids);
    }

    //更新物料
    @Transactional
    public void updateItemById(Item item){
        itemMapper.updateItemByItemId(item);
    }

    @Transactional
    public String itemCodeAddOne(String testStr){
        String[] strs = testStr.split("[^0-9]");//根据不是数字的字符拆分字符串
        String numStr = strs[strs.length-1];//取出最后一组数字
        if(numStr != null && numStr.length()>0){//如果最后一组没有数字(也就是不以数字结尾)，抛NumberFormatException异常
            int n = numStr.length();//取出字符串的长度
            int num = Integer.parseInt(numStr)+1;//将该数字加一
            String added = String.valueOf(num);
            n = Math.min(n, added.length());
            //拼接字符串
            return testStr.subSequence(0, testStr.length()-n)+added;
        }else{
            throw new NumberFormatException();
        }
    }

    @Transactional
    public List<Item> getItemsByExample(ItemExample itemExample){
        return itemMapper.getItemsByExample(itemExample);
    }

    @Transactional
    public List<Item> getItemsByIds(List<Integer> ids){
        List<Item> itemList=null;
        if(ids.size()==0){
            return itemList;
        }else{
            return itemMapper.getItemsByIds(ids);
        }
    }
}
