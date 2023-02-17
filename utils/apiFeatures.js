
//    بس name  يجيبلي كل الكلمات الي شبهاا  في الداتا الي  الكلام دا في ال  url دي مهمتها لو كتبت حاجه في ال   
class APIFeatures{

constructor(query,queryStr){
    this.query=query;
    this.queryStr=queryStr
    console.log({queryStr}) //{ queryStr: { keyword: 'lorem', category: 'laptops' } }
}
search(){
const keyword=this.queryStr.keyword ?{
name:{
    $regex:this.queryStr.keyword,
    $options:'i'
}

}:{

}
console.log(keyword);
this.query=this.query.find({...keyword})
return this

}
// -----------------------------------------------------------

// url بيرجع ناتج البحث الي في ال 
filter(){  
const querycopy={...this.queryStr}
console.log(querycopy) //{ keyword: 'lorem', category: 'laptops' }

// Removing fields from the query 
const removeFields=['keyword','limit','page']
removeFields.forEach((el)=>{

    delete querycopy[el]
})
console.log({querycopy}) //{ category: 'laptops' }
// advanced filter for price , rating 
let queryStr=JSON.stringify(querycopy)
queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`)
console.log({querycopy}) //{ category: 'laptops' }

this.query=this.query.find(JSON.parse(queryStr))
return this
}
// -----------------------------------------------------------
pagination(resperpage){
const currentpage=Number(this.queryStr.page) || 1
const skip=resperpage * (currentpage - 1)
this.query=this.query.limit(resperpage).skip(skip)
console.log({'this is':this});
return this
/*
  'this is': APIFeatures {
    query: Query {
      _mongooseOptions: {},
      _transforms: [],
      _hooks: [Kareem],
      _executionStack: null,
      mongooseCollection: [Collection],
  }
*/

}

}

module.exports=APIFeatures