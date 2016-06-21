var express = require('express');
var path = require('path');
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var app = express();
var bodyParser = require('body-parser');
var Movie = require('./models/movie');
var _ = require('underscore');
mongoose.connect('mongodb://localhost/movie')

app.set('views','./views/pages');
app.set('view engine','jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'bower_components')))
app.listen(port)
console.log('start on ' + port)

app.get('/',function(req,res){
    //查询所有电影列表
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err)
        }
        res.render('index',{
            title:'imooc 首页',
            movies:movies
        })
    })
});

app.get('/admin/update/:id',function(req,res){
    var id = req.params.id;
    if(id){
        Movie.findById(id,function(err,movie){
            res.render('admin',{
                title:'imooc后台更新页'
            })
        })
    }
})

app.get('/admin/list',function(req,res){
    Movie.fetch(function(err,movies){
        if(err){
            console.log(err)
        }
        res.render('list',{
            title:'列表页',
            movies:movies
        })
    })
})
app.get('/admin/movie',function(req,res){
    res.render('admin',{
        title:'后台录入页',
        movie:{
            title:'',
            doctor:'',
            country:'',
            year:'',
            poster:'',
            flash:'',
            summary:'',
            language:''
        }
    })
});

//
app.post('/admin/movie/new',function(req,res){
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie;
    if(id !== 'undefined') {
        Movie.findById(id,function(err,movie){
            if(err){
                console.log(err);
            }
            _movie = _.extend(movie,movieObj);
            _movie.save(function(err,movie){
                if(err){
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            })
        })
    } else {
        _movie = new Movie({
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        })
        _movie.save(function(err,movie){
            if(err){
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        })
    }
});

app.get('/movie/:id',function(req,res){
    var id = req.params.id;
    Movie.findById(id,function(err,movie){
        res.render('detail',{
            title:'imooc' + movie.title,
            movie:movie
        })
    })
})