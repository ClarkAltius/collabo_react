package com.coffee.repository;

import com.coffee.constant.OrderStatus;
import com.coffee.entity.Order;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    //쿼리 메소드 사용, 특정 회원 주문날짜 최신순으로 조회
    //cf. 더 복잡한 query는 @query 혹은 querydsl 사용 필요
//    List<Order> findByMemberIdOrderByIdDesc(Long memberId);
    List<Order> findByMemberIdAndStatusOrderByIdDesc(Long memberId, OrderStatus orderStatus);


    //주문번호 기준으로 모든 주문 내역을 역순으로 조회
    //관리자 전용 (유저 불문하고 모든 주문 내역을 조회하니까)
    List<Order> findAllByOrderByIdDesc();

    //@Query annotation 사용 예시. JPQL 사용
    //테이블 이름 대신 Entity 이름 사용
    //대소문자 구분
    @Modifying // 데이터 구분을 위한 annotation
    @Transactional //jakarta.
    @Query("update Order o set o.status = :status where o.id = :orderId")
    int updateOrderStatus(@Param("orderId") Long orderId, @Param("status") OrderStatus status);

    Optional<Order> findOrderById(Long orderId);

    //주문의 상태가 PENDING인 것만 조회합니다.
    List<Order> findByStatusOrderByIdDesc(OrderStatus status);
}
