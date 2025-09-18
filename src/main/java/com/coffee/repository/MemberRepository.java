package com.coffee.repository;


import com.coffee.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

//회원 정보들을 이용하여 데이터베이스와 교신하는 인터페이스
public interface MemberRepository extends JpaRepository<Member, Long> {


}
