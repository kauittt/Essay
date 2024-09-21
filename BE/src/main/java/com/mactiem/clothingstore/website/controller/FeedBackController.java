package com.mactiem.clothingstore.website.controller;

import com.mactiem.clothingstore.website.DTO.FeedBackRequestDTO;
import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.mapstruct.FeedBackMapper;
import com.mactiem.clothingstore.website.service.FeedBackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/feedbacks")
public class FeedBackController {
    private final FeedBackService feedBackService;
    private final FeedBackMapper feedBackMapper;

    @Autowired
    @Lazy
    public FeedBackController(FeedBackMapper feedBackMapper, FeedBackService feedBackService) {
        this.feedBackMapper = feedBackMapper;
        this.feedBackService = feedBackService;
    }

    @PostMapping
    public ResponseEntity<?> createFeedBack(@RequestBody FeedBackRequestDTO feedBackRequestDTO) {
        try {
            return ResponseEntity.ok(feedBackService.createFeedBack(feedBackRequestDTO));
        } catch (Exception ex) {
            Response response = Response.of(HttpStatus.BAD_REQUEST, ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFeedBack(@PathVariable String id, @RequestBody FeedBackRequestDTO feedBackRequestDTO) {
        try {
            return ResponseEntity.ok(feedBackService.updateFeedBack(id, feedBackRequestDTO));
        } catch (Exception ex) {
            Response response = Response.of(HttpStatus.BAD_REQUEST, ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeedBack(@PathVariable String id) {
        try {
            feedBackService.delete(id);
            Response response = Response.of(HttpStatus.OK, "Deleted FeedBack Successfully");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            Response response = Response.of(HttpStatus.NOT_FOUND, ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
