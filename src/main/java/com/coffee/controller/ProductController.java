package com.coffee.controller;

import com.coffee.entity.Product;
import com.coffee.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/product")
@CrossOrigin(origins = "http://localhost:3000") // <-- ADD THIS LINE
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

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id){
        try{
            boolean isDeleted = this.productService.deleteProduct(id);
            if (isDeleted){
                return ResponseEntity.ok(id + "번 상품이 삭제 되었습니다");
            } else {
                return ResponseEntity.ok(id + "번 상품은 존재하지 않습니다.");
            }
        } catch(Exception err){
            return ResponseEntity.internalServerError().body("오류 발생: " + err.getMessage());
        }
    }

    // MODIFIED: Product Insert Method
    @PostMapping("/insert")
    public ResponseEntity<?> insert(@ModelAttribute Product product, @RequestParam("imageFile") MultipartFile imageFile) {

        String imageFileName = "product_" + System.currentTimeMillis() + ".jpg";

        String pathName = productImageLocation.endsWith("\\") || productImageLocation.endsWith("/")
                ? productImageLocation
                : productImageLocation + File.separator;

        File imageFileOnDisk = new File(pathName + imageFileName);

        try {
            // Get bytes directly from the MultipartFile and write to the new file
            FileOutputStream fos = new FileOutputStream(imageFileOnDisk);
            fos.write(imageFile.getBytes());
            fos.close();

            product.setImage(imageFileName);
            product.setInputdate(LocalDate.now());

            this.productService.save(product);

            return ResponseEntity.ok(Map.of("message", "Product insert successfully", "image", imageFileName));

        } catch (Exception err) {
            return ResponseEntity.status(500).body(Map.of("message", err.getMessage(), "error", "Error file uploading"));
        }
    }

    //프론트 엔드 상품 수정 페이지에서 요청이 들어올 때 실행
    @GetMapping("/update/{id}")
    public ResponseEntity<Product> getUpdate(@PathVariable Long id){
        System.out.println("수정할 상품 번호 : " + id);
        Product product = this.productService.getProductById(id);

        if (product == null) {//상 품이 없으면 응답과 함께 null 반환
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }else{ //해당 상품의 정보와 함께 성공(200) 메시지 반환
            return ResponseEntity.ok(product);
        }
    }
    // ProductController.java
    @PutMapping("/update/{id}")
    public ResponseEntity<?> putUpdate(@PathVariable Long id, @ModelAttribute Product updatedProduct, @RequestParam(value = "imageFile", required = false) MultipartFile imageFile){
        System.out.println("수정 할 상품 정보");
        System.out.println(updatedProduct);

        Optional<Product> findProduct = productService.findById(id);
        if(findProduct.isEmpty()){
            return ResponseEntity.notFound().build();
        } else {
            Product savedProduct = findProduct.get();

            try {
                // Update product fields from the incoming updatedProduct object
                savedProduct.setName(updatedProduct.getName());
                savedProduct.setPrice(updatedProduct.getPrice());
                savedProduct.setCategory(updatedProduct.getCategory());
                savedProduct.setDescription(updatedProduct.getDescription());
                savedProduct.setStock(updatedProduct.getStock());

                // Check if a new image file was uploaded
                if (imageFile != null && !imageFile.isEmpty()) {
                    // Logic to save the new file, adapted from your "insert" method
                    String imageFileName = "product_" + System.currentTimeMillis() + ".jpg";
                    String pathName = productImageLocation.endsWith("\\") || productImageLocation.endsWith("/")
                            ? productImageLocation
                            : productImageLocation + File.separator;
                    File imageFileOnDisk = new File(pathName + imageFileName);

                    FileOutputStream fos = new FileOutputStream(imageFileOnDisk);
                    fos.write(imageFile.getBytes());
                    fos.close();

                    // Set the new image name on the product
                    savedProduct.setImage(imageFileName);
                }
                // If no new image is sent, the old image name remains unchanged.

                this.productService.save(savedProduct);

                return ResponseEntity.ok(Map.of("message", "상품 수정 성공"));
            } catch(Exception e){
                e.printStackTrace(); // It's good practice to log the full error
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR) // Use 500 for server-side exceptions
                        .body(Map.of("message", e.getMessage(),"error","Error product update failed"));
            }
        }
    }
//Legacy
//    @PutMapping("/update/{id}")
//    public ResponseEntity<?> putUpdate(@PathVariable Long id, @ModelAttribute Product updatedProduct, @RequestParam("imageFile") MultipartFile imageFile){
//        // This method is incomplete, but that's not related to the 404 error.
//        System.out.println("수정 할 상품 정보");
//        System.out.println(updatedProduct);
//
//        // You will need to add logic here to handle the product update.
//
//
//        Optional<Product> findProduct = productService.findById(id);
//        if(findProduct.isEmpty()){
//            return ResponseEntity.notFound().build();
//        }else{
//            //상품이 있습니다
//            //Optional에서 실제 상품 정보 가져오기
//            Product savedProduct = findProduct.get();
//
//            try {
//                //이전 이미지 객체에 새로운 이미지 객체 정보 업데이트
//                savedProduct.setName(updatedProduct.getName());
//                savedProduct.setPrice(updatedProduct.getPrice());
//                savedProduct.setCategory(updatedProduct.getCategory());
//                savedProduct.setDescription(updatedProduct.getDescription());
//                savedProduct.setStock(updatedProduct.getStock());
////                savedProduct.setInputdate(LocalDate.now());
//                if (updatedProduct.getImage() != null && updatedProduct.getImage().startsWith(("data:image"))){
//                    String imageFileName = saveProductImage(updatedProduct.getImage()    );
//                    savedProduct.setImage(imageFileName);
//                }
//
//                //서비스를 통하여 데이터베이스에 저장
//                this.productService.save(savedProduct);
//
//                return ResponseEntity.ok(Map.of("message", "상품 수정 성공"));
//            }catch(Exception e){
//                return ResponseEntity
//                        .status(HttpStatus.NOT_FOUND)
//                        .body(Map.of("message", e.getMessage(),"error","Error product update failed"));
//            }
//        }
//    }
//
//    private String saveProductImage(String base64Image) {
//        //base64Image: Javascript fileReader API 에 만들어진 이미지. base64 사용 할 ㄹ경우
//        byte[] decodedImage = Base64.getDecoder().decode(base64Image.split(",")[1]);
//
//        String imageFileName = "product_" + System.currentTimeMillis() + ".jpg";
//
//        String pathName = productImageLocation.endsWith("\\") || productImageLocation.endsWith("/")
//                ? productImageLocation
//                : productImageLocation + File.separator;
//
//        File imageFile = new File(pathName + imageFileName);
//        try{
//            FileOutputStream fos = new FileOutputStream(imageFile);
//            fos.write(decodedImage);
//            return imageFileName;
//        } catch (Exception e) {
//            e.printStackTrace();
//            return base64Image;
//        }
//    }
}
