package com.coffee.entity;

import com.coffee.constant.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
@Getter
@Setter
@ToString
@Entity
@Table(name = "members")
public class Member {
    @Id // 이 칼럼은 primary key 입니다
    @GeneratedValue(strategy = GenerationType.AUTO) //기본 키 생성 전략
    @Column(name = "member_id") // 칼럼 이름 변경
    private Long id;
    private String name;
    @Column(unique = true, nullable = false)
    private String email;
    private String password;
    private String address;
    @Enumerated(EnumType.STRING) //칼럼에 문자열 형식으로 데이터가 들어감
    private Role role; //USER of ADMIN
    private LocalDate regdate; //등록일자



}
