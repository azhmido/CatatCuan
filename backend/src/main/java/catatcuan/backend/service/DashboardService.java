package catatcuan.backend.service;

import catatcuan.backend.dto.response.DashboardSummaryResponse;
import catatcuan.backend.dto.response.InvoiceResponse;

import java.util.List;

public interface DashboardService {

    DashboardSummaryResponse getSummary();

    List<InvoiceResponse> getRecentInvoices();
}

