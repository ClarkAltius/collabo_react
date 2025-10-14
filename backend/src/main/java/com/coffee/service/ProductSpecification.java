package com.coffee.service;

import com.coffee.constant.Category;
import com.coffee.entity.Product;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

//Specification : JPA의 Criteria API를 사용해서 where 절 검색조건을 객체 지향적으로 만들기 위해 사용하는 인터페이스
public class ProductSpecification {
    public static Specification<Product> hasDateRange(String searchDateType) {
        return new Specification<Product>() {
            @Override
            public jakarta.persistence.criteria.Predicate toPredicate(Root<Product> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                LocalDate now = LocalDate.now(); //현재 시각
                LocalDate startDate = null; //검색 시작일자
                //선택한 콤보 박스 값을 보고 검색 시작 일자를 계산
                switch (searchDateType) {
                    case "1d":
                        startDate = now.minus(1, ChronoUnit.DAYS);
                        break;
                    case "1w":
                        startDate = now.minus(1, ChronoUnit.WEEKS);
                        break;
                    case "1m":
                        startDate = now.minus(1, ChronoUnit.MONTHS);
                        break;
                    case "6m":
                        startDate = now.minus(6, ChronoUnit.MONTHS);
                        break;
                    case "all":
                    default: //전체 기간 조회
                        return criteriaBuilder.isTrue(criteriaBuilder.literal(true));
                }
                //상품 입고 일자가 검색 시작 일자 이후의 상품들만 검색
                return criteriaBuilder.greaterThanOrEqualTo(root.get("inputdate"), startDate);
            }
        };
    }

    public static Specification<Product> hasCategory(Category category) {
        return new Specification<Product>() {
            @Override
            public Predicate toPredicate(Root<Product> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                if (category == Category.ALL) {
                    //conjunction 메소도는 논리적으로 항상 true 인 객체 반환
                    return criteriaBuilder.conjunction();

                } else {
                    return criteriaBuilder.equal(root.get("category"), category);
                }
            }
        };
    }

    public static Specification<Product> hasNameLike(String keyword) {
        return new Specification<Product>() {
            @Override
            public Predicate toPredicate(Root<Product> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                return criteriaBuilder.like(root.get("name"), "%" + keyword + "%");
            }
        };

    }

    public static Specification<Product> hasDescriptionLike(String keyword) {
        return new Specification<Product>() {
            @Override
            public Predicate toPredicate(Root<Product> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                return criteriaBuilder.like(root.get("description"), "%" + keyword + "%");
            }
        };

    }
}