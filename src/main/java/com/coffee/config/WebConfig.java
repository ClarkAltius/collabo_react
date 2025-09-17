package com.coffee.config;


import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration //해당 클래스를 객체로 만들어 주되, 이 파일은 설정용 파일입니다.
public class WebConfig implements WebMvcConfigurer {
    @Override // allowCredentials(true) : 브라우저가 서버와 통신할 때 쿠키/세션 등의 인증 정보를 주고 받는 것에 대하여 허락하겠습니다.
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowCredentials(true);
    }
}
