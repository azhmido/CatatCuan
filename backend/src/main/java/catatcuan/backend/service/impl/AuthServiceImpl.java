package catatcuan.backend.service.impl;

import catatcuan.backend.dto.request.LoginRequest;
import catatcuan.backend.dto.request.RegisterRequest;
import catatcuan.backend.dto.response.AuthResponse;
import catatcuan.backend.entity.Tenant;
import catatcuan.backend.exception.UnauthorizedException;
import catatcuan.backend.repository.TenantRepository;
import catatcuan.backend.dto.request.GoogleLoginRequest;
import catatcuan.backend.security.JwtService;
import catatcuan.backend.service.AuthService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${app.google.client-id:}")
    private String googleClientId;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (tenantRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email '" + request.getEmail() + "' sudah terdaftar");
        }

        Tenant tenant = Tenant.builder()
                .businessName(request.getBusinessName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        tenant = tenantRepository.save(tenant);

        return buildAuthResponse(tenant);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Tenant tenant = tenantRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Email atau password salah"));

        if (!passwordEncoder.matches(request.getPassword(), tenant.getPasswordHash())) {
            throw new UnauthorizedException("Email atau password salah");
        }

        return buildAuthResponse(tenant);
    }

    @Override
    @Transactional
    public AuthResponse googleLogin(GoogleLoginRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getIdToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                Tenant tenant = tenantRepository.findByEmail(email).orElseGet(() -> {
                    // Create new tenant auto-register
                    Tenant newTenant = Tenant.builder()
                            .email(email)
                            .businessName("Usaha " + name)
                            .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString())) // random password
                            .build();
                    return tenantRepository.save(newTenant);
                });

                return buildAuthResponse(tenant);
            } else {
                throw new UnauthorizedException("Google Token tidak valid");
            }
        } catch (Exception e) {
            throw new UnauthorizedException("Gagal memverifikasi akun Google: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse getCurrentUserProfile() {
        UUID tenantId = catatcuan.backend.security.TenantContext.get();
        if (tenantId == null) {
            throw new UnauthorizedException("Sesi tidak valid");
        }
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new UnauthorizedException("Tenant tidak ditemukan"));
        return buildAuthResponse(tenant);
    }

    private AuthResponse buildAuthResponse(Tenant tenant) {
        String token = jwtService.generateToken(tenant.getEmail(), tenant.getId());
        return AuthResponse.builder()
                .token(token)
                .tenantId(tenant.getId())
                .businessName(tenant.getBusinessName())
                .email(tenant.getEmail())
                .build();
    }
}

