package com.coffee.service;


import com.coffee.entity.Cart;
import com.coffee.entity.Member;
import com.coffee.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    public Cart findByMember(Member member) {

        //orElse : 해당 Cart가 있으면 그대로 리턴, 없으면 null 리턴
        return cartRepository.findByMember(member).orElse(null);
    }
    public Cart saveCart(Cart newCart){
        return cartRepository.save(newCart);
    }
}
