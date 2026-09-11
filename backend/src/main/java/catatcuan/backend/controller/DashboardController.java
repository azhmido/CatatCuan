package catatcuan.backend.controller;

import catatcuan.backend.dto.response.ApiResponse;
import catatcuan.backend.dto.response.DashboardSummaryResponse;
import catatcuan.backend.dto.response.InvoiceResponse;
import catatcuan.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary() {
        return ResponseEntity.ok(ApiResponse.success("OK", dashboardService.getSummary()));
    }

    @GetMapping("/recent-invoices")
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getRecentInvoices() {
        return ResponseEntity.ok(ApiResponse.success("OK", dashboardService.getRecentInvoices()));
    }
}

