const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true, 'name is requireed'
        ],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'discription is required']
    },
    price: {
        type: Number,
        maxLength: [
            8, 'maximum 8 charecters'
        ],
        required: [true, 'price is required']
    },
    ratings: {
        type: Number,
        default: 0
    },
    numOfReviewes: {
        type: Number,
        default:0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'category is required']
    },
    stock: {
        type: Number,
        required: [
            true, 'please enter Stock '
        ],
        maxLength: [4, 'stock cannot exceed 4']
    },

    reviews: [
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            name: {
                type: String,
                required: true
            },
            
            rating: {
                    type: Number,
                    required: true
            },
            
                comment: {
                    type: String,
                    required: true
                }
            }
        
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('product',productSchema)
