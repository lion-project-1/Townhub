package com.example.backend.config;

import com.example.backend.global.exception.security.JwtAccessDeniedHandler;
import com.example.backend.global.exception.security.JwtAuthenticationEntryPoint;
import com.example.backend.global.exception.security.JwtExceptionFilter;
import com.example.backend.global.exception.security.SecurityErrorResponseWriter;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.jwt.JwtAuthenticationFilter;
import com.example.backend.security.jwt.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final SecurityErrorResponseWriter securityErrorResponseWriter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // OPTIONS 요청은 인증 없이 허용
                        .requestMatchers("/api/users/login", "/api/users/signup", "/api/users/token/reissue").permitAll()
                        .anyRequest().authenticated()
                )

                .cors(cors -> cors.configurationSource(configurationSource()))

                // 기본 로그인/Basic 인증 비활성화
                .httpBasic(httpBasic -> httpBasic.disable())
                .formLogin(form -> form.disable()
                )

                // SecurityContext 기반 인증/권한 실패 처리
                .exceptionHandling(eh -> eh
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint) // 인증되지 않은 사용자 접근 시
                        .accessDeniedHandler(jwtAccessDeniedHandler) // 권한 없는 사용자 접근 시
                );

        // JWT 예외처리
        JwtExceptionFilter jwtExceptionFilter = new JwtExceptionFilter(securityErrorResponseWriter);
        // 토큰 유효한지
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(jwtProvider, userRepository);

        // JwtExceptionFilter -> JwtAuthenticationFilter
        http.addFilterBefore(jwtExceptionFilter, UsernamePasswordAuthenticationFilter.class); // SecurityContext 에 들어가기 전에 JWT 예외를 먼저 처리
        http.addFilterAfter(jwtAuthenticationFilter, JwtExceptionFilter.class); // JWT 토큰을 파싱하고 인증 처리

        return http.build();
    }

    @Bean
    public CorsConfigurationSource configurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        // 허용 도메인
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:3000", "http://localhost:8080"
        ));

        // 허용 HTTP 메서드
        configuration.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "PATCH" , "DELETE", "OPTIONS"
        ));

        // 허용 헤더
        configuration.setAllowedHeaders(List.of(
                "Authorization", "Content-Type"
        ));

        // 노출 헤더
        configuration.setExposedHeaders(List.of(
                "Authorization"
        ));

        // 쿠키 허용
        configuration.setAllowCredentials(true);

        configuration.setMaxAge(3600L); // 캐시 시간
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 모든 API 적용

        return source;
    }
}