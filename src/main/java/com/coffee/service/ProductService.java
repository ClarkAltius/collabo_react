package com.coffee.service;

import com.coffee.entity.Product;
import com.coffee.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service //상품에 대한 여러가지 로직 정보를 처러해주는 서비스 클래스
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getProductList(){
        return this.productRepository.findProductByOrderByIdDesc();
    };

    public boolean deleteProduct(Long id) {
        if(productRepository.existsById(id)){ //해당 항목이 존재하면
            this.productRepository.deleteById(id);
            return true; //true means deletion successful in this case
        }else{

        }
        return false;
    }
}
