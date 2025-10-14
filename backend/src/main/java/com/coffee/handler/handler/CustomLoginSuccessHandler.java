package com.coffee.handler.handler;

import com.coffee.entity.Member;
import com.coffee.service.MemberService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
// [MODIFIED] This is the correct User class from Spring Security, not from Tomcat (org.apache.catalina.User).
import org.springframework.security.core.userdetails.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class CustomLoginSuccessHandler implements AuthenticationSuccessHandler {
    private MemberService memberService ;

    @Autowired
    public void setMemberService(MemberService memberService) {
        this.memberService = memberService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        // Set the response content type to JSON.
        response.setContentType("application/json;charset=UTF-8");

        // [MODIFIED] The principal from Spring's Authentication object is correctly cast to Spring's User object.
        User user = (User) authentication.getPrincipal();
        String email = user.getUsername();
        Member member = memberService.findByEmail(email);

        // For security, clear the password before sending member data to the client.
        if (member != null) {
            member.setPassword(null);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("message", "로그인 성공");
        data.put("member", member);

        System.out.println("Login Success Handler - Member Info:");
        System.out.println(member);

        // Use ObjectMapper to convert the Java map to a JSON string.
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        response.getWriter().write(mapper.writeValueAsString(data));
    }
}
