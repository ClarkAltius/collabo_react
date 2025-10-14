package com.coffee.service;

import com.coffee.constant.Role;
import com.coffee.entity.Member;
import com.coffee.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    @Autowired
    private PasswordEncoder passwordEncoder;
    public Member login(String email, String password) {
        // 1. 이메일로 회원을 찾습니다.
        Member member = memberRepository.findByEmail(email);

        if (member != null) {
            // 2. 회원이 존재하면, 입력된 비밀번호와 DB의 암호화된 비밀번호를 비교합니다.
            if (passwordEncoder.matches(password, member.getPassword())) {
                // 3. 비밀번호가 일치하면 회원 정보를 반환합니다. (로그인 성공)
                return member;
            }
        }

        // 4. 회원이 없거나 비밀번호가 틀리면 null을 반환합니다. (로그인 실패)
        return null;
    }


    public void insert(Member bean){
        //사용자 역할과 등록 일자는 여기서 입력
        bean.setRole(Role.USER);
        bean.setRegdate(LocalDate.now());
        //주의) repository 에서 인서트 작업은 save메소드 사용

        //encoded password
        String encodedPassword = passwordEncoder.encode(bean.getPassword());
        bean.setPassword(encodedPassword);

    memberRepository.save(bean);
    }

    public Optional<Member> findMemberById(Long memberId) {
        return this.memberRepository.findById(memberId);
    }
}
