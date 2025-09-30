//dis is da cart entity. It represents the cart.
//in database-speak, it has to share te primary key with the user entity coz they are in a 1-1 relationship.

/*
테스트 시나리오
최초로 고객이 장바구니에 품목을 담으면
    1. 카트 객체 생성
    2. 카트 상품 객체 생성
그 고객이 다른 상품을 장바구니에 담으면 기존 장바구니에
    1. 카트 상품 객체 생성
이전 카트 상품을 추가로 더 구매하면
    1. 이전 카트 상품을 갱신
 */

package com.coffee.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter @Setter @ToString
@Entity
@Table(name="carts")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // <-- Add this line
    @Column(name = "cart_id")
    private Long id; //카드 아이디

    @OneToOne(fetch= FetchType.LAZY) //일대일 지연 로딩
    @JoinColumn(name = "member_id")
    private Member member;
    
    //Cart 1개에는 여러 개의 카트상품 객체를 담을 수 있다
    //cascade : 카트에 변동 발생시 (변경, 수정 삭제 등) 카트상품에 반영시켜주세요 (.All indicates to do this on everything)
    //mappedBy 구문은 연관관게 주문이 아닌 읽기 전용 매핑 정보만 가지고 있다
    //주의사항) 연관관계의 주인 엔티티에 들어있는 변수 명과 반드시 동일해야한다 (이 경우 cart)
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CartProduct> cartProducts;
}
