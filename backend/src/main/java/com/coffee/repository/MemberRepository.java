package com.coffee.repository;


import com.coffee.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

//회원 정보들을 이용하여 데이터베이스와 교신하는 인터페이스
public interface MemberRepository extends JpaRepository<Member, Long> {

    //이메일 정보를 이용하여 해당 회원이 존재하는지 체크
    //findByEmail은 JPA에서 쿼리 메소드 라고 칭한다
    //이메일 정보를 이용해서 해당 회원이 존재하는 지 체크
    Member findByEmail(String email);
}
