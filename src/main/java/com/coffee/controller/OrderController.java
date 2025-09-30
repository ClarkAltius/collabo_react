package com.coffee.controller;

import com.coffee.dto.OrderDto;
import com.coffee.dto.OrderItemDto;
import com.coffee.entity.Member;
import com.coffee.entity.Order;
import com.coffee.entity.OrderProduct;
import com.coffee.entity.Product;
import com.coffee.service.CartProductService;
import com.coffee.service.MemberService;
import com.coffee.service.OrderService;
import com.coffee.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final MemberService memberService;
    private final ProductService productService;
    private final CartProductService cartProductService;

    //리액트의 카트목록, 주문하기 버튼을 눌러 주문 시도
    @PostMapping("")  //CartList.js 파일의 makeOrder()함수와 연관 있습니다.
    public ResponseEntity<?> order(@RequestBody OrderDto dto){
        System.out.println(dto);

        //Create Member Object
        Optional<Member> optionalMember = memberService.findMemberById(dto.getMemberId());
        if(!optionalMember.isPresent()){
            throw new RuntimeException("회원이 존재하지 않습니다.");
        }
        Member member = optionalMember.get();

        //Create Order Object
        Order order = new Order();

            //the following member ordered it
        order.setMember(member);
        order.setOrderdate(LocalDate.now());
        order.setStatus(dto.getStatus());

        //OrderProduct uses for loop

        List<OrderProduct> orderProductList = new ArrayList<>();

        for(OrderItemDto item : dto.getOrderItems()){
            //item 은 주문하고자 하는 주문 상품 1개 의미
            Optional<Product> optionalProduct = productService.findProductById(item.getProductId());
            if (optionalProduct.isEmpty()){
                throw new RuntimeException("해당 상품이 존재하지 않습니다.");
            }
            Product product = optionalProduct.get();
            if(product.getStock() < item.getQuantity()){
                throw new RuntimeException("재고 수량이 부족합니다.");
            }

            OrderProduct orderProduct = new OrderProduct();
            orderProduct.setOrder(order);
            orderProduct.setProduct(product);
            orderProduct.setQuantity(item.getQuantity());
            
            //리스트 컬렉션에 각 주문상품을 담아준다
            orderProductList.add(orderProduct);

            //상품 재고수량 차감하기
            product.setStock(product.getStock() - item.getQuantity());
            Long cartProductId = item.getCartProductId() ;
            //System.out.println("cartProductId : " + cartProductId);

            if(cartProductId != null){ // 장바구니 내역에서 `주문하기` 버튼을 클릭한 경우에 해당함
                cartProductService.deleteCartProductById(cartProductId);

            }else{
                System.out.println("상품 상세 보기에서 클릭하셨군요.");
            }
        }


        order.setOrderProducts(orderProductList);

        //Save Order object
        orderService.saveOrder(order);

        String message = "주문이 완료되었습니다";
        return ResponseEntity.ok(message);
    }

}
