package com.coffee.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString
public class OrderItemDto { //주문 1개 상품정보를 저장하고 있는 대한 클래스
    private Long cartProductId;
    private Long productId;
    private int quantity;


}
