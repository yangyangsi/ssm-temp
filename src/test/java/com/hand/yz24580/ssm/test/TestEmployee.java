package com.hand.yz24580.ssm.test;

import com.github.pagehelper.PageHelper;
import com.hand.yz24580.ssm.mapper.ItemMapper;
import com.hand.yz24580.ssm.pojo.Item;
import com.hand.yz24580.ssm.pojo.ItemExample;
import com.hand.yz24580.ssm.service.ItemService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.ArrayList;
import java.util.List;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:spring/applicationContext.xml", "classpath:mybatis/applicationContext-mybatis.xml", "classpath:mybatis/applicationContext-tx.xml"})
public class TestEmployee {

    @Autowired
    private ItemMapper itemMapper;

    @Autowired
    private ItemService itemService;

    @Test
    public void getItemsByExample(){
        PageHelper.startPage(1, 2);
        ItemExample itemExample = new ItemExample();

        Item item = new Item();
        item.setItemUom("米");

        itemExample.setAsc(false);
        itemExample.setItem(item);
        List<Item> list = itemMapper.getItemsByExample(itemExample);

        for(int i=0;i<list.size();i++){
            System.out.println(list.get(i));
        }
    }

    @Test
    public void testGetItemById(){
        System.out.println(itemMapper.getItemById(1));
    }

    @Test
    public void testInsertItem(){
        Item item = new Item();
        item.setItemUom("米");
        item.setItemDescription("awjidjdwhi");
        item.setEnabledFlag(1);

        itemMapper.insertItem(item);
    }

    @Test
    public void testUpdateItem(){
        Item item = new Item();
        item.setItemId(105);

        itemMapper.updateItemByItemId(item);
    }

    @Test
    public void testDeleteBatch(){
        List<Integer> list=new ArrayList<>();
        list.add(105);
        itemMapper.deleteBatch(list);
    }

    @Test
    public void testGetItemCodeMax(){
        System.out.println(itemMapper.getItemCodeMax());
    }

    @Test
    public void testStr(){
        System.out.println(itemService.itemCodeAddOne("ITEM000221"));
    }

    @Test
    public void testSaveItem(){
        Item item = new Item();
        item.setItemUom("米");
        item.setItemDescription("awjidjdwhi");
        item.setEnabledFlag(1);
        itemService.saveItem(item);
    }

    @Test
    public void testGetItemsByIds(){
        List<Integer> list = new ArrayList<>();
        list.add(1);
        List<Item> itemList=itemMapper.getItemsByIds(list);
        for(int i = 0;i < itemList.size();i++){
            //System.out.println(itemList.get());
        }
    }
}
