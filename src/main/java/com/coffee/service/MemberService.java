package com.coffee.service;

import com.coffee.constant.Role;
import com.coffee.entity.Member;
import com.coffee.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service //서비스 역할을 하며, 주로 로직 처리에 활용되는 자바 클래스
@RequiredArgsConstructor
public class MemberService {
    private final MemberRepository memberRepository;

    public Member findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }
    public void insert(Member bean){
        //사용자 역할과 등록 일자는 여기서 입력
        bean.setRole(Role.USER);
        bean.setRegdate(LocalDate.now());
        //주의) repository 에서 인서트 작업은 save메소드 사용

    memberRepository.save(bean);
    }

    public Optional<Member> findMemberById(Long memberId) {
        return this.memberRepository.findById(memberId);
    }
}
