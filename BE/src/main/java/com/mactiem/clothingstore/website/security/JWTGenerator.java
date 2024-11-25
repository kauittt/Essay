package com.mactiem.clothingstore.website.security;

import com.mactiem.clothingstore.website.entity.User;
import com.mactiem.clothingstore.website.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class JWTGenerator {
    private final Key key;
    private final UserRepository userRepository;

    @Autowired
    public JWTGenerator(UserRepository userRepository) {
        byte[] keyBytes = SecurityConstants.JWT_SECRET.getBytes();
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.userRepository = userRepository;
    }

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + SecurityConstants.JWT_EXPIRATION);

        Optional<User> optionalUser = userRepository.findByUsername(username);
        User user = optionalUser.orElseThrow(() -> new UsernameNotFoundException(username));

        Map<String, Object> userClaims = new HashMap<>();
//        userClaims.put("username", username);
//        userClaims.put("name", user.getName());
        userClaims.put("id", user.getId());
        userClaims.put("roles", authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        Map<String, Object> claims = new HashMap<>();
        claims.put("user", userClaims);


        String token = Jwts.builder()
                .setClaims(claims) // Set custom claims
                .setSubject(username) //- setSubject để getUsernameFromJWT có thể .getSubject
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
        return token;
    }

    public String generateRefreshToken(Authentication authentication) {
        String username = authentication.getName();
        Date currentDate = new Date();
        Date expireDate = new Date(currentDate.getTime() + SecurityConstants.REFRESH_TOKEN_EXPIRATION);

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        String refreshToken = Jwts.builder()
                .setClaims(claims) // Set custom claims
                .setSubject(username)
                .setIssuedAt(currentDate)
                .setExpiration(expireDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
        return refreshToken;
    }

    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }


    public String getUserIdFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        Map<String, Object> userClaims = (Map<String, Object>) claims.get("user");
        if (userClaims != null) {
            Object userId = userClaims.get("id");
            if (userId instanceof Number) {
                return String.valueOf(userId);
            } else {
                return (String) userId;
            }
        }
        return null;
    }

    public List<GrantedAuthority> getAuthoritiesFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        List<String> roles = (List<String>) claims.get("roles");

        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (SecurityException e) {
            // Xử lý trường hợp chữ ký không hợp lệ
            throw new RuntimeException("Invalid JWT signature");
        } catch (MalformedJwtException e) {
            // Xử lý trường hợp JWT không đúng định dạng
            throw new RuntimeException("Invalid JWT token");
        } catch (ExpiredJwtException e) {
            // Xử lý trường hợp JWT đã hết hạn
            throw new RuntimeException("Expired JWT token");
        } catch (UnsupportedJwtException e) {
            // Xử lý trường hợp JWT không được hỗ trợ
            throw new RuntimeException("Unsupported JWT token");
        } catch (IllegalArgumentException e) {
            // Xử lý trường hợp JWT có giá trị trống hoặc không hợp lệ
            throw new RuntimeException("JWT claims string is empty");
        }
    }
}
