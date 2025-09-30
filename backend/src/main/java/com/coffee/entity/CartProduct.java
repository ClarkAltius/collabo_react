package com.coffee.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

//장바구니에 담을 상품에 대한 정보를 가지고 있는 엔티티 클래스
@Getter
@Setter
@ToString
@Entity
@Table(name = "cart_products")
public class CartProduct {

    @Id // 이 칼럼은 primary key
    @GeneratedValue(strategy = GenerationType.AUTO) //기본 키 생성 전략
    @Column(name = "cart_product_id") // 칼럼 이름 변경
    private Long id; //카트 상품 아이디

    //card_id is a foreign key in this context
    //
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private Cart cart;

    //동일 품목은 여러 카트에 담길 수 있음
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="product_id")
    private Product product;


    @Column(nullable = false)
    private int quantity; //구매 수량


}
