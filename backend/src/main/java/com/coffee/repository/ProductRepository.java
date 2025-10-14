//ProductRepository.java

package com.coffee.repository;

import com.coffee.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findProductByOrderByIdDesc();


    //image 칼럼에 특정 문자열이 포함된 데이터 조회
    //데이터베이스의 like 키워드와 유사
    //select * from products where image like '%bigs%';
    List<Product> findByImageContaining(String filter);

    //검색 조건인 spec 과 페이징 객체 pageable 사용, 데이터 검색.
    //정렬 방식은 pageable 에 포함
    Page<Product> findAll(Specification<Product> spec, Pageable pageable);


}
