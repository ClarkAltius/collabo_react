package com.coffee.dto;

import com.coffee.entity.CartProduct;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
//리액트의 cartlist.js 파일에서 fetchcartproducts() 함수 참조
public class CartProductResponseDto {
    private Long cartProductId;
    private Long productId;
    private String name;
    private String image;
    private int price;
    private int quantity ;
    private boolean checked = false;

    public CartProductResponseDto(CartProduct cartProduct){
        this.cartProductId = cartProduct.getId();
        this.productId = cartProduct.getProduct().getId();
        this.name = cartProduct.getProduct().getName();
        this.image = cartProduct.getProduct().getImage();
        this.price = cartProduct.getProduct().getPrice();
        this.quantity = cartProduct.getQuantity();

    }
}
