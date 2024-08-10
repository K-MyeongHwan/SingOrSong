package com.singorsong.singorsong.service;

import com.singorsong.singorsong.entity.Category;
import com.singorsong.singorsong.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    //categoryListAll
    public List<Category> findCategoryAll() {
        return categoryRepository.findAll();
    }


}
