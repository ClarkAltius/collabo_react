package com.coffee.config;

import com.coffee.handler.handler.CustomLoginSuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        // Define which paths should be publicly accessible
        String[] permitAllowed = {"/", "/member/signup", "/member/login", "/product", "/product/list", "/cart/**", "/order/**", "/fruit/**", "/element/**", "/images/**"};

        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless REST APIs
                .cors(Customizer.withDefaults()) // Enable and configure CORS
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(permitAllowed).permitAll() // Allow access to public paths
                        .anyRequest().authenticated() // All other requests require authentication
                );

        // [MODIFIED] The .formLogin() configuration has been re-enabled.
        // This tells Spring Security to handle the /member/login endpoint.
        http.formLogin(form -> form
                .loginProcessingUrl("/member/login") // The URL Spring Security will listen to for login POST requests.
                .usernameParameter("email") // The form parameter for the username.
                .passwordParameter("password") // The form parameter for the password.
                .successHandler(handler()) // On successful login, this custom handler will be invoked.
                .permitAll()
        );

        http.logout(logout -> logout
                .logoutUrl("/member/logout")
                .permitAll()
        );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));

        /*
           백엔드: 리액트에서 쿠키 세션 정보를 넘기면 허용하기 위한 옵션
           프론트: axios 사용시 반드시 withCrendntials:true 옵션 명시할것

           인증 성공시 백엔드가 프론트에 JSESSIONID 라는 이름의 데이터를 넘겨주고 쿠키 형태로 저장
         */

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    // [MODIFIED] The bean for your CustomLoginSuccessHandler is now created
    // so it can be injected into the security filter chain.
    @Bean
    public CustomLoginSuccessHandler handler(){
        return new CustomLoginSuccessHandler();
    }
}

