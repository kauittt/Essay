package com.mactiem.clothingstore.website.config;


import com.mactiem.clothingstore.website.security.JWTAuthenticationFilter;
import com.mactiem.clothingstore.website.security.JWTGenerator;
import com.mactiem.clothingstore.website.security.JwtAuthEntryPoint;
import com.mactiem.clothingstore.website.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class ClothingStoreConfig {
    private final JwtAuthEntryPoint authEntryPoint;
    private final JWTGenerator jwtGenerator;
    private final CustomUserDetailsService customUserDetailsService;

    @Autowired
    @Lazy
    public ClothingStoreConfig(JwtAuthEntryPoint authEntryPoint, JWTGenerator jwtGenerator, CustomUserDetailsService customUserDetailsService) {
        this.authEntryPoint = authEntryPoint;
        this.jwtGenerator = jwtGenerator;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors()
                .and()
                .csrf().disable()
                .exceptionHandling()
                .authenticationEntryPoint(authEntryPoint)
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeHttpRequests(authorize -> {
                    authorize.requestMatchers("/users/login", "/users/register").permitAll();

                    //* User
                    authorize.requestMatchers("/users/current", "/users/current/**").authenticated(); //*  Update, Get theo token

                    authorize.requestMatchers(HttpMethod.DELETE, "/users/**").hasRole("ADMIN"); //* Delete
                    authorize.requestMatchers(HttpMethod.PUT, "/users/**").hasRole("ADMIN"); //* Update

                    authorize.requestMatchers(HttpMethod.GET, "/users").hasAnyRole("ADMIN", "STAFF"); //* getAll
                    authorize.requestMatchers(HttpMethod.GET, "/users/**").hasAnyRole("ADMIN", "STAFF");//* getById

                    //* Voucher
                    authorize.requestMatchers(HttpMethod.GET, "/vouchers").authenticated(); //* Get all
                    authorize.requestMatchers(HttpMethod.GET, "/vouchers/**").authenticated(); //* Get by ID
                    authorize.requestMatchers(HttpMethod.POST, "/vouchers").hasAnyRole("ADMIN", "STAFF"); //* Add
                    authorize.requestMatchers(HttpMethod.PUT, "/vouchers/**").hasAnyRole("ADMIN", "STAFF"); //* Update
                    authorize.requestMatchers(HttpMethod.DELETE, "/vouchers/**").hasAnyRole("ADMIN", "STAFF"); //* Delete

                    //* Product
                    authorize.requestMatchers(HttpMethod.GET, "/products").authenticated(); // Get all products
                    authorize.requestMatchers(HttpMethod.GET, "/products/**").authenticated(); // Get product by ID
                    authorize.requestMatchers(HttpMethod.POST, "/products").hasAnyRole("ADMIN", "STAFF"); // Add product
                    authorize.requestMatchers(HttpMethod.PUT, "/products/**").hasAnyRole("ADMIN", "STAFF"); // Update product
                    authorize.requestMatchers(HttpMethod.DELETE, "/products/**").hasRole("ADMIN"); // Delete product


                    //* Order
                    authorize.requestMatchers(HttpMethod.POST, "/orders").authenticated(); // Add order
                    authorize.requestMatchers(HttpMethod.PUT, "/orders/current/**").authenticated(); // Update current order
                    authorize.requestMatchers(HttpMethod.DELETE, "/orders/current/**").authenticated(); // Delete current order

                    authorize.requestMatchers(HttpMethod.GET, "/orders").hasAnyRole("ADMIN", "STAFF"); // Get all orders
                    authorize.requestMatchers(HttpMethod.GET, "/orders/**").hasAnyRole("ADMIN", "STAFF"); // Get order by ID
                    authorize.requestMatchers(HttpMethod.PUT, "/orders/**").hasAnyRole("ADMIN", "STAFF"); // Update order
                    authorize.requestMatchers(HttpMethod.DELETE, "/orders/**").hasRole("ADMIN"); // Delete order


                    authorize.anyRequest().authenticated();
                });

        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public JWTAuthenticationFilter jwtAuthenticationFilter() {
        return new JWTAuthenticationFilter(jwtGenerator, customUserDetailsService);
    }
}