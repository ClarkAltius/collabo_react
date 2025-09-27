package com.coffee.entity;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter


public class CartProductDto {
    private Long memberId;
    private Long productId;
    private int quantity;
}
