package com.coffee.controller;

import com.coffee.entity.Product;
import com.coffee.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/product")
public class ProductController {
    @Value("${productImageLocation}")
    private String productImageLocation; //initial value is null

    @Autowired
    private ProductService productService;

    @GetMapping("/list")
    public List<Product> list(){
        List<Product> products = this.productService.getProductList();
        return products;
    }
    //클라이언트 특정 상품 id에 대하여 삭제 요청. PathVariable은 경로 변수를 메소드의 매개 변수로 값을 전달하는 역할
    @DeleteMapping("/delete/{id}") //{id}는 경로 변수, 가변 매개 변수
    public ResponseEntity<String> delete(@PathVariable Long id){ //{id}에서 넘어온 상품 번호가 변수 id에 할당
        try{

            boolean isDeleted = this.productService.deleteProduct(id);

            if (isDeleted){
                return ResponseEntity.ok(id + "번 상품이 삭제 되었습니다");
            }else{
                return ResponseEntity.ok(id + "번 상품은 존재하지 않습니다.");
            }

        }catch(Exception err){
return ResponseEntity.internalServerError().body("오류 발생: " + err.getMessage());
        }
    }
    
    // 상품 등록하기
    @PostMapping("/insert") //프론트에서 post 방식으로 보냈기에 postmapping 사용
    public ResponseEntity<?> insert(@RequestBody Product product){
        //@RequestBody : http를 사용하여 넘어온 data body를 자바 객체 형식으로 변환
        String imageData = product.getImage(); //base64 encoding string
        String imageFileName = "product_" + System.currentTimeMillis() + ".jpg";

        String pathName = productImageLocation.endsWith("\\")||productImageLocation.endsWith("/")
                ?productImageLocation
                :productImageLocation + File.separator;

        File imageFile = new File(pathName + imageFileName);

        try{
            //파일 정보를 byte 단위로 변환하여 이미지 복사
            FileOutputStream fos = new FileOutputStream(imageFile);

            byte[] decodedImage = Base64.getDecoder().decode(imageData.split(",")[1]);
            fos.write(decodedImage); //바이트 파일을 해당 이미지 경로에 복사

            product.setImage(imageFileName);
            product.setInputdate(LocalDate.now());

            this.productService.save(product);

            return ResponseEntity.ok(Map.of("message","Product insert successfully","image",imageFileName));

        }catch(Exception err){
            return ResponseEntity.status(500).body(Map.of("message", err.getMessage(), "error", "Error file uploading"));
        }

    }
}
