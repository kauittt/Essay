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