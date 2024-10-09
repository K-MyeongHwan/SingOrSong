package com.singorsong.singorsong.etc;

import com.singorsong.singorsong.entity.CustomUserDetail;
import com.singorsong.singorsong.entity.User;
import com.singorsong.singorsong.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserService userService;
    private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
    private RequestCache requestCache = new HttpSessionRequestCache();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        String type = authentication.getPrincipal().getClass().getSimpleName();

        //session 생성
        request.getSession().invalidate();
        HttpSession session = request.getSession(true);

        System.out.println("*********************************");
        System.out.println("isSuccessHandler");
        System.out.println(authentication.getPrincipal().toString());
        System.out.println(authentication.getAuthorities());
        System.out.println(type);
        System.out.println("*********************************");

        //Type 확인
        if (type.equals("CustomUserDetail")) {
            CustomUserDetail user = (CustomUserDetail) authentication.getPrincipal();

            //session 저장
            session.setAttribute("loginUser", user.getUserId());
            session.setMaxInactiveInterval(60 * 30);
        } else if (type.equals("DefaultOAuth2User")) {
            DefaultOAuth2User oauth2User = (DefaultOAuth2User) authentication.getPrincipal();
            String email = oauth2User.getAttribute("email");

            //유저 검색
            User user = userService.getUserByEmail(email);

            //session 저장
            session.setAttribute("loginUser", user.getUserId());
            session.setMaxInactiveInterval(60 * 30);
        }

        resultRedirectStrategy(request, response, authentication);
    }

    protected void resultRedirectStrategy(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        SavedRequest savedRequest = requestCache.getRequest(request, response);
        redirectStrategy.sendRedirect(request, response, "/");
    }
}
