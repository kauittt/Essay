package com.mactiem.clothingstore.website.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {
    public static String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication instanceof CustomAuthenticationToken) {
            CustomAuthenticationToken customToken = (CustomAuthenticationToken) authentication;
            return customToken.getUserId();
        }
        return null; // Or throw an exception based on your requirements
    }
}
