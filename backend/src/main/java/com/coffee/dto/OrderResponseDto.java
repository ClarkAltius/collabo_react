package com.coffee.dto;

//React에서 들어온 주문내역 조회에 대응하하는 Dto. 주문 1개를 의미하는 자바 클래스

import com.coffee.constant.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data // @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor를 자동으로 포함합니다.
@NoArgsConstructor // 매개 변수가 없는 기본 생성자를 자동 생성합니다.
@AllArgsConstructor // 모든 필드를 매개 변수로 받는 생성자를 자동 생성합니다.
public class OrderResponseDto {
    private Long orderId; //송장 번호 (주문의 고유번호 _ PK 기반)
    private LocalDate orderDate; //주문 일자
    private OrderStatus status; //주문의 상태
    private List<OrderItem> orderItems;

    public void setStatus(String name) {
        this.status = OrderStatus.valueOf(name);


    }

    //주문 상품 하나를 의미하는 클래스
    @Data
    @AllArgsConstructor // 상품 추가 정보가 더 필요할 경우 하단에 변수 추가
    public static class OrderItem{
        //내부 정적 클래스
        private String productName;
        private int quantity;
    }
}
