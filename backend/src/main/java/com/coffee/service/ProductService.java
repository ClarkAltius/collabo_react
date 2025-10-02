package com.coffee.service;

import com.coffee.entity.Product;
import com.coffee.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service //상품에 대한 여러가지 로직 정보를 처러해주는 서비스 클래스
@RequiredArgsConstructor
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
        }else{ //in case of not existant
            return false;
        }

    }

    public void save(Product product) {
        //save method is in the CRUD repository
        this.productRepository.save(product);
    }

    public Product getProductById(Long id) {
        //findbyid method is in the CRUD repository
        //optional을 반환 (해당 상품이 있을지 없을지 대비)
        Optional<Product> product = this.productRepository.findById(id);
    return product.orElse(null);
    }

    public Optional<Product> findById(Long id) {
        // 1. Call the findById method that Spring Data JPA provides on your repository.
        // 2. This repository method performs the database query: "SELECT * FROM product WHERE id = ?"
        // 3. If a product is found, the method automatically wraps it in an Optional: Optional.of(product).
        // 4. If no product is found, it returns Optional.empty().
        // 5. Your service method simply returns this result.
        return productRepository.findById(id);
    }

    public Optional<Product> findProductById(Long productId) {
            return this.productRepository.findById(productId);
        }

    public List<Product> getProductsByFilter(String filter) {
            if(filter != null && !filter.isEmpty()){
                return productRepository.findByImageContaining(filter);
            }
            return productRepository.findAll();
        }

    }



