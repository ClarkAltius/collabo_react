package com.coffee.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@Entity
@Table(name="order_products")
public class OrderProduct {//하나의 주문 상품을 의미하는 자바 엔티티 클래스
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="order_product_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="order_id", nullable = false)
    private Order order; //주문과 다대일 관계

    @ManyToOne
    @JoinColumn(name="product_id")
    private Product product;
    private int quantity;


}
