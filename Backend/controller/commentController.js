const Joi = require('joi')
const Comment = require('../models/comment')
const CommentDTO = require('../dto/comment');
const mongoIdPattern = /^[0-9a-fA-F]{24}$/;


const commentController = {
    async create(req,res,next){
        const commentSchema = Joi.object( {
            content : Joi.string().required(),
            blog : Joi.string().regex(mongoIdPattern).required(),
            author : Joi.string().regex(mongoIdPattern).required()
        })

        const {error} = commentSchema.validate(req.body)

        if(error){
            return next(error)
        }

        const {content , blog, author} = req.body

        try {
            const newComment = new Comment({
                content, blog, author
            })

            await newComment.save();
        } catch (error) {
            return next(error)
        }

        res.status(201).json({success : "Comment Created!"})
    },
    async getById(req,res,next){
        const commentByID = Joi.object({
            id : Joi.string().regex(mongoIdPattern).required()
        })

        const {error} = commentByID.validate(req.params)

        if(error){
            return next(error)
        }

        const {id} = req.params;
        let comments; 
        try {
            comments  = await Comment.find({blog : id})
        } catch (error) {
            return next(error)
        }


        let commentsDTO = [];
        for(let i=0;i<comments.length;i++){
            const obj = new CommentDTO(comments[i]);
            commentsDTO.push(obj)
        }
        return res.status(200).json({data : commentsDTO})
    }
}


module.exports = commentController;