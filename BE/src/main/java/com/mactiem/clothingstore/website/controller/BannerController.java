package com.mactiem.clothingstore.website.controller;

import com.mactiem.clothingstore.website.DTO.BannerRequestDTO;
import com.mactiem.clothingstore.website.DTO.BannerResponseDTO;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.service.BannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/banners")
public class BannerController {
    private final BannerService bannerService;

    @Autowired
    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @GetMapping
    public ResponseEntity<List<BannerResponseDTO>> getAll() {
        List<BannerResponseDTO> bannerResponseDTOS = bannerService.getAll();
        return ResponseEntity.ok(bannerResponseDTOS);
    }

//
//    @GetMapping("/{id}")
//    public ResponseEntity<?> getBannerById(@PathVariable String id) {
//        try {
//            return ResponseEntity.ok(bannerService.getBannerById(id));
//        } catch (Exception ex) {
//            Response response = Response.of(HttpStatus.NOT_FOUND, ex.getMessage());
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
//        }
//    }

    @PostMapping
    public ResponseEntity<?> createBanner(@RequestBody BannerRequestDTO bannerRequestDTO) {
        try {
            return ResponseEntity.ok(bannerService.create(bannerRequestDTO));
        } catch (Exception ex) {
            Response response = Response.of(HttpStatus.BAD_REQUEST, ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBanner(@PathVariable String id, @RequestBody BannerRequestDTO bannerRequestDTO) {
        try {
            return ResponseEntity.ok(bannerService.update(id, bannerRequestDTO));
        } catch (Exception ex) {
            Response response = Response.of(HttpStatus.BAD_REQUEST, ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBanner(@PathVariable String id) {
        try {
            bannerService.delete(id);
            Response response = Response.of(HttpStatus.OK, "Deleted Banner Successfully");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            Response response = Response.of(HttpStatus.NOT_FOUND, ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
