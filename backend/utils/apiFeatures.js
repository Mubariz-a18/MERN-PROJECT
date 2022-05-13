class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    search() {
        const key = this.queryStr.key ? 
        {
            name: {
                $regex: this.queryStr.key,
                $options: 'i'
            },
        } :'';
        this.query = this.query.find({...key})
        return this
    }
    filter(){
        const queryCopy = {...this.queryStr};
        const removeFeilds = ['key','page','limit'];
        removeFeilds.forEach((key)=> delete queryCopy[key]) ;

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=> `$${key}`)
        this.query = this.query.find(JSON.parse(queryStr));
        return this

    }
    pageInation(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1
        const skip =resultPerPage * (currentPage - 1)
        this.query = this.query.limit(resultPerPage).skip(skip)
        return this
    }
}


module.exports = ApiFeatures
