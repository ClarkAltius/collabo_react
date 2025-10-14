package com.coffee.service;

import com.coffee.entity.Member;
import com.coffee.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/*

UserDetailsService 인터페이스
 */


@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Member member = memberRepository.findByEmail(email);
        if(member == null){
            String message = "The email " + email + " does not exist";
            throw new UsernameNotFoundException(message);
        }
        return User.builder()
                .username(member.getEmail()) //로그인시 사용했던 ID (이 경우 email)
                .password(member.getPassword()) //암호화된 비번
                .roles(member.getRole().name()) //사용자 역할
                .build();
    }
}
