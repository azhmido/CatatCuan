package catatcuan.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class DashboardSummaryResponse {

    private BigDecimal totalRevenue;
    private long unpaidInvoiceCount;
    private long overdueInvoiceCount;

    @JsonProperty("unpaidCount")
    public long getUnpaidCount() {
        return unpaidInvoiceCount;
    }

    @JsonProperty("overdueCount")
    public long getOverdueCount() {
        return overdueInvoiceCount;
    }
}

