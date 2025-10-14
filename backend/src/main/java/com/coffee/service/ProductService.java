package com.coffee.service;

import com.coffee.dto.SearchDto;
import com.coffee.entity.Product;
import com.coffee.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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

    public Page<Product> listProducts(Pageable pageable) {
        return this.productRepository.findAll(pageable);
    }
    public Page<Product> listProducts(SearchDto searchDto, int pageNumber, int pageSize){

        //Specification은 엔티티 객체에 대한 쿼리 조건을 정의할 수 있는 조건자로 사용됨. 
        Specification<Product> spec = Specification.where(null); //null은 현재 어떤한 조건도 없음을 의미

        //기간 검색 콤보 박스 조건 추가
        if(searchDto.getSearchDateType() != null){
            spec = spec.and(ProductSpecification.hasDateRange(searchDto.getSearchDateType()));
        }


        //카테고리 조건 추가
        if(searchDto.getCategory() != null){
            spec = spec.and(ProductSpecification.hasCategory(searchDto.getCategory()));
        }

        //검색 모드에 따른 조건 추가 (name or description)
        String searchMode = searchDto.getSearchMode();
        String searchKeyword = searchDto.getSearchKeyword();

        if(searchMode != null && searchKeyword != null){
            if("name".equals(searchMode)){ //상품명 검색
                spec = spec.and(ProductSpecification.hasNameLike(searchKeyword));
            }else if("description".equals(searchMode)){ //상품 설명 검색
                spec = spec.and(ProductSpecification.hasDescriptionLike(searchKeyword));

            }
        }

        Sort sort = Sort.by(Sort.Order.desc("id"));

        //pageNumber 페이지 (0base)를 sort 방식으로 정렬, pageSize 개 씩 보여주세요.
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);



        return this.productRepository.findAll(spec, pageable);
    }
}



