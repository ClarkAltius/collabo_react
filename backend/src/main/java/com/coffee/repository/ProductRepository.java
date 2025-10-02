//ProductRepository.java

package com.coffee.repository;

import com.coffee.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findProductByOrderByIdDesc();


    //image 칼럼에 특정 문자열이 포함된 데이터 조회
    //데이터베이스의 like 키워드와 유사
    //select * from products where image like '%bigs%';
    List<Product> findByImageContaining(String filter);


}
