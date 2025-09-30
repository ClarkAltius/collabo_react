package com.coffee.dto;


import com.coffee.constant.OrderStatus;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

//사용자가 주문 할 때 필요한 변수들을 정리해둔 클래스
@Getter @Setter @ToString
public class OrderDto {
    private Long memberId;
    private OrderStatus status;
    private List<OrderItemDto> orderItems; //주문상품 목록

}
