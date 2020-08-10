
const app = require('express');
const Article = require("../schema/article.js");
const router = app.Router();



router.get('/list',function(req,res,next){
    var article = new Article();
    Article.find(function(err, data) {
        if (err) {res.send(err)}

        res.send(data);
    });
});
module.exports = router
