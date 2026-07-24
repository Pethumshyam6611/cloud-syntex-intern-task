import * as Yup from 'yup'

export function createCategorySchema(categories) {
  return Yup.object({
    name: Yup.string()
      .trim()
      .required('Category name is required.')
      .min(2, 'Category name must be at least 2 characters.')
      .max(50, 'Category name cannot exceed 50 characters.')
      .test(
        'unique-category',
        'A category with this name already exists.',
        (value) => {
          if (!value) return true
          const normalizedName = value.trim().toLowerCase()
          return !categories.some(
            (category) => category.name.trim().toLowerCase() === normalizedName,
          )
        },
      ),
  })
}
