package catatcuan.backend.config;

import catatcuan.backend.entity.InvoiceStatus;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.format.FormatterRegistry;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToInvoiceStatusConverter());
    }

    public static class StringToInvoiceStatusConverter implements Converter<String, InvoiceStatus> {
        @Override
        public InvoiceStatus convert(@NonNull String source) {
            return InvoiceStatus.fromString(source);
        }
    }
}
