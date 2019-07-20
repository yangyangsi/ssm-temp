package com.hand.yz24580.ssm.mapper;

import com.hand.yz24580.ssm.pojo.Item;
import com.hand.yz24580.ssm.pojo.ItemExample;

import java.util.List;

public interface ItemMapper {
    List<Item> getItemsByExample(ItemExample itemExample);
    Item getItemById(Integer itemId);
    Integer insertItem(Item item);
    Integer updateItemByItemId(Item item);
    Integer deleteItemByItemId(Integer itemId);
    Integer deleteBatch(List<Integer> ids);
    String  getItemCodeMax();
    List<Item> getItemsByIds(List<Integer> ids);
}
