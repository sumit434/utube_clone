import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "../middleware/async.js";
import Category from "../models/Categories.js";


// @desc    Get categories
// @route   GET /api/v1/categories
// @access  Private/Admin
export const getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Private/Admin
export const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id)

  if (!category) {
    return next(
      new ErrorResponse(`No category with that id of ${req.params.id}`)
    )
  }

  res.status(200).json({ sucess: true, data: category })
})

// @desc    Create Category
// @route   POST /api/v1/categories/
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create({
    ...req.body,
    userId: req.user.id
  })

  return res.status(200).json({ sucess: true, data: category })
})
