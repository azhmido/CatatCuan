package catatcuan.backend.service;

import catatcuan.backend.dto.request.LoginRequest;
import catatcuan.backend.dto.request.RegisterRequest;
import catatcuan.backend.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse googleLogin(catatcuan.backend.dto.request.GoogleLoginRequest request);

    AuthResponse getCurrentUserProfile();
}

