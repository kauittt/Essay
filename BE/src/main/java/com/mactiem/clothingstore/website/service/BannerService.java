package com.mactiem.clothingstore.website.service;

import com.mactiem.clothingstore.website.DTO.BannerRequestDTO;
import com.mactiem.clothingstore.website.DTO.BannerResponseDTO;
import com.mactiem.clothingstore.website.entity.Banner;
import com.mactiem.clothingstore.website.entity.Response;
import com.mactiem.clothingstore.website.entity.User;
import com.mactiem.clothingstore.website.mapstruct.BannerMapper;
import com.mactiem.clothingstore.website.repository.BannerRepository;
import com.mactiem.clothingstore.website.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Field;
import java.util.List;

@Service
public class BannerService {
    private final BannerRepository bannerRepository;
    private final BannerMapper bannerMapper;
    private final UserService userService;

    @Autowired
    public BannerService(BannerMapper bannerMapper, BannerRepository bannerRepository, UserService userService) {
        this.bannerMapper = bannerMapper;
        this.bannerRepository = bannerRepository;
        this.userService = userService;
    }

    //* Helper
    public List<Banner> findAll() {
        return bannerRepository.findAll();
    }

    public Banner findById(String id) {
        return bannerRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException(Response.notFound("Banner", id)));
    }

    //* Methods
    public BannerResponseDTO getById(String id) {
        Banner banner = findById(id);
        return bannerMapper.toDTO(banner);
    }

    public List<BannerResponseDTO> getAll() {
        return bannerMapper.toListDTOs(findAll());
    }

    @Transactional
    public BannerResponseDTO create(BannerRequestDTO bannerRequestDTO) {
        if (bannerRequestDTO.getPath() == null || bannerRequestDTO.getPath().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Banner's 'path' is required");
        }

        User user = userService.findUserById(SecurityUtils.getCurrentUserId());

        Banner banner = bannerMapper.toEntity(bannerRequestDTO);
        banner.setUser(user);

        return bannerMapper.toDTO(bannerRepository.save(banner));
    }

    @Transactional
    public BannerResponseDTO update(String id, BannerRequestDTO bannerRequestDTO) {
        Banner banner = findById(id);

        Field[] fields = bannerRequestDTO.getClass().getDeclaredFields();
        try {
            for (Field field : fields) {
                field.setAccessible(true);
                Object value = field.get(bannerRequestDTO);
                if (value != null) {
                    Field dbField = Banner.class.getDeclaredField(field.getName());
                    dbField.setAccessible(true);
                    dbField.set(banner, value);
                }
            }

        } catch (IllegalAccessException | NoSuchFieldException e) {
            throw new RuntimeException("Error updating fields", e);
        }

        return bannerMapper.toDTO(bannerRepository.save(banner));
    }

    @Transactional
    public void delete(String id) {
        Banner banner = findById(id);

        bannerRepository.delete(banner);
    }
}
