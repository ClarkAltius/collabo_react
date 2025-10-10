package com.coffee.controller;

import com.coffee.constant.OrderStatus;
import com.coffee.constant.Role;
import com.coffee.dto.OrderDto;
import com.coffee.dto.OrderItemDto;
import com.coffee.dto.OrderResponseDto;
import com.coffee.entity.Member;
import com.coffee.entity.Order;
import com.coffee.entity.OrderProduct;
import com.coffee.entity.Product;
import com.coffee.service.MemberService;
import com.coffee.service.OrderService;
import com.coffee.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.aspectj.weaver.ast.Or;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    //리액트의 카트목록, 주문하기 버튼을 눌러 주문 시도
    @PostMapping("")  //CartList.js 파일의 makeOrder()함수와 연관 있습니다.
    public ResponseEntity<?> order(@RequestBody OrderDto dto){
        System.out.println(dto);

        //Create Member Object
        Optional<Member> optionalMember = memberService.findMemberById(dto.getMemberId());
        if(optionalMember.isEmpty()){
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
        }
        order.setOrderProducts(orderProductList);

        //Save Order object
        orderService.saveOrder(order);

        String message = "주문이 완료되었습니다";
        return ResponseEntity.ok(message);

    }
    //특정 회원의 주문 정보를 조회합니다.
    @GetMapping("/list")
    public ResponseEntity<?> getOrderList(@RequestParam Long memberId, @RequestParam Role role) {
        System.out.println("로그인한 유저 ID: " + memberId);
        System.out.println("로그인 한 사람 계정분류: " + role);

        List<Order> orders = null;
        if (role == Role.ADMIN) {
            System.out.println("관리자");
            orders = orderService.findAllOrders(OrderStatus.PENDING);
        } else {
            System.out.println("일반 유저");
            orders = orderService.findByMemberIdAndStatusOrderByIdDesc(memberId, OrderStatus.PENDING);
        }

        System.out.println("주문 건수: " + orders.size());

        List<OrderResponseDto> responseDtos = new ArrayList<>();
        for (Order bean : orders) {
            OrderResponseDto dto = new OrderResponseDto();

            //주문 기초 정보 세팅
            dto.setOrderId(bean.getId());
            dto.setOrderDate(bean.getOrderdate());
            dto.setStatus(bean.getStatus().name());

            //주문상품 여럿에 대한 세팅
            List<OrderResponseDto.OrderItem> orderItems = new ArrayList<>();

            for (OrderProduct op : bean.getOrderProducts()) {
                OrderResponseDto.OrderItem item
                        = new OrderResponseDto.OrderItem(op.getProduct().getName(), op.getQuantity());
                orderItems.add(item);
            }
            dto.setOrderItems(orderItems);
            responseDtos.add(dto);
        }
        return ResponseEntity.ok(responseDtos);
    }

//    @GetMapping("/update/{orderId}")
//    public String ddd(PathVariable Long orderId){
//        return null;
//    }

    ///update/status/${bean.orderId}?status=${newStatus}

    @PutMapping("/update/status/{orderId}")
    public ResponseEntity<String> statusChange(@PathVariable Long orderId, @RequestParam OrderStatus status){
        System.out.println("수정할 항목 아이디: " + orderId);
        System.out.println("수정할 주문 상태: " + status);

        int affected = -1;
        affected = orderService.updateOrderStatus(orderId, status);
        System.out.println("데이터베이스에 반영 된 행 갯수" + affected);
        String message = "송장번호 " + orderId + "의 주문상태가 변경되었습니다.";
        return ResponseEntity.ok(message);
    }

    //삭제요청


    @DeleteMapping("/delete/{orderId}")
    public ResponseEntity<String> cancelOrder(@PathVariable Long orderId){
        if(!orderService.existsById(orderId)){
            return ResponseEntity.notFound().build();

        }

        //재고수량 증가를 위한 코드
        Optional<Order> orderOptional = orderService.findOrderById(orderId);
        if(orderOptional.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        Order order = orderOptional.get();

        //주문 상품을 반복하면서 재고 수량을 더해 주어야 합니다.
        for(OrderProduct op : order.getOrderProducts()){
            Product product = op.getProduct();
            int quantity = op.getQuantity();

            //기존 재고에 취소된 수량 추가
            product.setStock(product.getStock() + quantity);
            productService.save(product);
        }


        orderService.deleteById(orderId);
        String message = "주문이 취소되었습니다.";
        return ResponseEntity.ok(message);
    }
}
