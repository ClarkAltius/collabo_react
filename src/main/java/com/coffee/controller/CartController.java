package com.coffee.controller;

import com.coffee.entity.*;
import com.coffee.service.CartProductService;
import com.coffee.service.CartService;
import com.coffee.service.MemberService;
import com.coffee.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;


/**
 * 테스트 시나리오
 * 사용자가 상품을 장바구니에 담았ㅇ르 때 체크
 1. 로그인 한 사람의 회원 아이디 확인
 2. Cart 테이블의 회원 아이디가 로그인한 사람인가요?
 3. Cart 엔티티의 카트 아이디와 CartProduct 엔티티의 카트 아이디가 동일해야함
 4. CartProduct 엔티티의 상품 아이디와 Product 엔티티의 상품 아이디가 동일해야한다
 */


@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor //final 키워드 가지고 있는 필드에 생성자를 이용하여 자동으로 주입해준다
public class CartController {

    private final MemberService memberService;
    private final ProductService productService;
    private final CartService cartService;
    private final CartProductService cartProductService;


    @PostMapping("/insert")
    public ResponseEntity<String> addToCart(@RequestBody CartProductDto dto){

        //necessary steps

        //if Member or Product is legitimate
        Optional<Member> memberOptional = memberService.findMemberById(dto.getMemberId());
        Optional<Product> productOptional = productService.findProductById(dto.getProductId());
        if(memberOptional.isEmpty() || productOptional.isEmpty()){//정부 무효시
            return ResponseEntity.badRequest().body("회원 또는 상품 정보가 올바르지 않습니다.");
        }

        //get member and product object details
        Member member = memberOptional.get();
        Product product = productOptional.get();

        //check inventory for stock
        if(product.getStock() < dto.getQuantity()){
            return ResponseEntity.badRequest().body("재고 수량이 부족합니다.");
        }
        //view Cart or create a new one
        Cart cart = cartService.findByMember(member);

        if(cart == null){
            Cart newCart = new Cart(); //새로운 카트
            newCart.setMember(member); //고객이 새로운 카트를 집어듬
            cart = cartService.saveCart(newCart); //데이터 베이스에 저장
        }
        //put the cart_product into cart
        CartProduct cp = new CartProduct();
        cp.setCart(cart);
        cp.setProduct(product);
        cp.setQuantity(dto.getQuantity());
        cartProductService.saveCartProduct(cp);

        //재고수량 차감 x (아직 판매가 이루어지지 않았음으로)

        return ResponseEntity.ok("요청하신 상품이 장바구니에 추가되었습니다.");
    }
}