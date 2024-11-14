package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.InvoiceRequestDTO;
import com.mactiem.clothingstore.website.DTO.InvoiceResponseDTO;
import com.mactiem.clothingstore.website.DTO.ProductRequestDTO;
import com.mactiem.clothingstore.website.DTO.ProductResponseDTO;
import com.mactiem.clothingstore.website.entity.GenerateID;
import com.mactiem.clothingstore.website.entity.Invoice;
import com.mactiem.clothingstore.website.entity.Product;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.mapstruct.InvoiceMapper;
import com.mactiem.clothingstore.website.repository.InvoiceRepository;
import com.mactiem.clothingstore.website.validator.InvoiceValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;
    private final InvoiceValidator invoiceValidator;

    @Autowired
    @Lazy
    public InvoiceService(InvoiceMapper invoiceMapper, InvoiceRepository invoiceRepository, InvoiceValidator invoiceValidator) {
        this.invoiceMapper = invoiceMapper;
        this.invoiceRepository = invoiceRepository;
        this.invoiceValidator = invoiceValidator;
    }

    //* Helper
    public Invoice findInvoiceById(String id) {
        return invoiceRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException(Response.notFound("Invoice", id)));
    }

    public List<Invoice> findAllInvoices() {
        return invoiceRepository.findAll();
    }

    //* Methods
    public InvoiceResponseDTO getInvoiceById(String id) {
        Invoice invoice = findInvoiceById(id);
        return invoiceMapper.toDTO(invoice);
    }

    public List<InvoiceResponseDTO> getAllInvoices() {
        return invoiceMapper.toListDTOs(findAllInvoices());
    }

    @Transactional
    public InvoiceResponseDTO create(InvoiceRequestDTO invoiceRequestDTO) {
        invoiceValidator.validateInvoiceRequest(invoiceRequestDTO);

        Invoice invoice = invoiceMapper.toEntity(invoiceRequestDTO);
        invoice.setCreateDate(LocalDateTime.now());
        return invoiceMapper.toDTO(invoiceRepository.save(invoice));
    }
}
