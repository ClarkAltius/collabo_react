package com.coffee.dto;

import com.coffee.constant.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

//상품 검색시 사용하는 클래스
@Getter @Setter @ToString
@AllArgsConstructor
public class SearchDto {
    //조회할 날짜 검색 범위를 선정하기 위한 변수, 현재 시간과 상품입고일을 비교하여 처리
    //all, id, iw, im, 6m 기간 설정

    private String searchDateType ; //기간 검색 콤보 박스
    private Category category ; //카테고리 콤보 박스
    
    private String searchMode; //상품검색모드 콤보박스 (name or description)
    private String searchKeyword; //검색 키워드 입력 상자
    

}
