package com.singorsong.singorsong.config;

import com.singorsong.singorsong.service.CustomOauth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig{
    private final CustomOauth2UserService oauth2UserService;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public SecurityConfig(CustomOauth2UserService oauth2UserService, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.oauth2UserService = oauth2UserService;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    // 특정 HTTP 요청에 대한 웹 기반 보안 구성
    //requestMatchers 경로제한
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http	.csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(form -> form
                        .loginPage("/login")
                        .defaultSuccessUrl("/api/oauth/sosLogin")
                        .usernameParameter("userEmail")
                        .passwordParameter("userPassword"))
                .oauth2Login(oauth2Login -> oauth2Login
                        .loginPage("/login")
                        .userInfoEndpoint(userInfo -> userInfo.userService(oauth2UserService))
                        .defaultSuccessUrl("/api/oauth/socialLogin"))
                .authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers("/**").permitAll()
                        .anyRequest().authenticated())
                .logout((logout) -> logout
                        .logoutRequestMatcher(new AntPathRequestMatcher("/api/user/logout"))
                        .logoutSuccessUrl("/api/oauth/sosLogout")
                        .invalidateHttpSession(true))
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)

                )
                .cors(httpSecurityCorsConfigurer ->
                        httpSecurityCorsConfigurer.configurationSource(corsConfigurationSource()));
        return http.build();
    }

    //Security 인증 처리
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        corsConfiguration.setAllowedOriginPatterns(List.of("*"));
        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"));
        corsConfiguration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
        corsConfiguration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration); // 모든 경로에 대해서 CORS 설정을 적용

        return source;
    }
}
