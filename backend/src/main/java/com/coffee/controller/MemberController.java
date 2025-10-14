package com.coffee.controller;

import com.coffee.entity.Member;
import com.coffee.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/member")
public class MemberController {
    private final MemberService memberService;


    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody Member bean, BindingResult bindingResult){
        System.out.println(bean);
        System.out.println("유효성 오류 갯수");
        System.out.println(bindingResult.getFieldErrorCount());
        if(bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for(FieldError err:bindingResult.getFieldErrors()){
                errors.put(err.getField(),err.getDefaultMessage());
            }
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }
        Member member = memberService.findByEmail(bean.getEmail());

        if(member != null){
            return new ResponseEntity<>(Map.of("email","이미 존재하는 이메일 주소입니다."), HttpStatus.BAD_REQUEST);
        }else{
            memberService.insert(bean);
            return new ResponseEntity<>("회원 가입 성공", HttpStatus.OK);
        }
    }

    // [MODIFIED] The method signature was changed to handle 'x-www-form-urlencoded' data.
    // Instead of @RequestBody, we now use @RequestParam to map form fields to method parameters.
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestParam("email") String email, @RequestParam("password") String password){
        System.out.println("클라이언트에서 로그인 요청");
        System.out.println("Email: " + email);

        // The MemberService login method is called with the correctly parsed email and password.
        Member loggedInMember = memberService.login(email, password);

        Map<String, Object> response = new HashMap<>();

        if (loggedInMember != null) {
            // Login successful
            response.put("message", "로그인 성공");

            // For security, the password field is set to null before sending the response.
            loggedInMember.setPassword(null);
            response.put("member", loggedInMember);

            return ResponseEntity.ok(response);
        } else {
            // Login failed
            response.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
            // 401 Unauthorized is the appropriate status for failed authentication.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(){
        // Future logic can be added here if needed.
        return ResponseEntity.ok("logout success");
    }
}
