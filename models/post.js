const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, '使用者 ID 未填寫'],
    },
    content: {
      type: String,
      required: [true, '內容未填寫'],
    },
    image: {
      type: String,
      default: '',
    },
    likes: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'posts',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

const myCustomLabels = {
  totalDocs: 'totalCount',
  docs: 'data',
  limit: 'perPage',
  page: 'currentPage',
  nextPage: 'next',
  prevPage: 'prev',
  totalPages: 'pageCount',
  pagingCounter: 'slNo',
  meta: 'paginator',
}

mongoosePaginate.paginate.options = {
  customLabels: myCustomLabels,
}

postSchema.plugin(mongoosePaginate)

postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id',
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
