const Joi = require("joi");
const fs = require("fs");
const Blog = require("../models/blog");
const blogDTO = require("../dto/blog");
const { BACKEND_SERVER_PATH } = require("../config/index");
const blogDetails = require("../dto/blogDetails");
const JWTServices = require("../Services/JWTServices");
const Comment = require('../models/comment')
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

const blogController = {
  async create(req, res, next) {
    const createBlogSchema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().regex(mongoIdPattern).required(),
      content: Joi.string().required(),
      photo: Joi.string().required(),
    });

    const { error } = createBlogSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { title, author, content, photo } = req.body;

    const buffer = Buffer.from(
      photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );

    const imagePath = `${Date.now()}-${author}.png`;

    try {
      fs.writeFileSync(`storage/${imagePath}`, buffer);
    } catch (error) {
      return next(error);
    }

    let newBlog;
    try {
      newBlog = new Blog({
        title,
        author,
        content,
        photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
      });

      await newBlog.save();
    } catch (error) {
      return next(error);
    }

    const blogDto = new blogDTO(newBlog);

    return res.status(201).json({ blog: blogDto });
  },
  async getAll(req, res, next) {
    try {
      const blogs = await Blog.find({});
      const blogsDto = [];

      for (let i = 0; i < blogs.length; i++) {
        const dto = new blogDTO(blogs[i]);
        blogsDto.push(dto);
      }

      return res.status(201).json({ blogs: blogsDto });
    } catch (error) {
      return next(error);
    }
  },
  async getById(req, res, next) {
    const getBlogById = Joi.object({
      id: Joi.string().regex(mongoIdPattern).required(),
    });

    const { error } = getBlogById.validate(req.params);

    if (error) {
      return next(error);
    }

    const { id } = req.params;

    let blog;
    try {
      blog = await Blog.findOne({ _id: id }).populate('author');
    } catch (error) {
      return next(error);
    }

    const blogDto = new blogDetails(blog);

    return res.status(201).json({ blog: blogDto });
  },
  async update(req, res, next) {
    const blogUpdateSchema = Joi.object({
      title: Joi.string().required(),
      author: Joi.string().regex(mongoIdPattern).required(),
      content: Joi.string().required(),
      blogId: Joi.string().regex(mongoIdPattern).required(),
      photo: Joi.string(),
    });

    const { error } = blogUpdateSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { title, author, content, blogId, photo } = req.body;

    let blog;

    try {
      blog = await Blog.findOne({ _id: blogId });
    } catch (error) {
      return next(error);
    }

    if (photo) {
      let previousPhoto = await blog.photoPath;

      previousPhoto = previousPhoto.split("/").at(-1);

      fs.unlinkSync(`storage/${previousPhoto}`);

      const buffer = Buffer.from(
        photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );

      const imagePath = `${Date.now()}-${author}.png`;

      try {
        fs.writeFileSync(`storage/${imagePath}`, buffer);
      } catch (error) {
        return next(error);
      }

      await Blog.updateOne({_id : blogId},
        {title, content, photoPath : `${BACKEND_SERVER_PATH}/storage/${imagePath}`});
    }
    else{
        await Blog.updateOne({_id : blogId},{title, content})
    }

    res.status(201).json({msg : "Blog Updated!"})
  },
  async delete(req, res, next) {
    const deleteBlogSchema = Joi.object({
        id  : Joi.string().regex(mongoIdPattern).required()
    })

    const {error} = deleteBlogSchema.validate(req.params)

    if(error){
        return next(error)
    }

    const {id} = req.params

    try {
        await Blog.deleteOne({_id : id});

        await Comment.deleteMany({blog : id});
    } catch (error) {
        return next(error);
    }

    res.status(200).json({success : "Blog Deleted!"})
  },
};

module.exports = blogController;
