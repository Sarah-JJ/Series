var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

mongoose.connect('mongodb://Sarah:Naruto22@ds243008.mlab.com:43008/tvseries').then(function () {
    console.log("Connected!")
}).catch(function (error) {
    console.log(error.message)
});
var Show = mongoose.model('Show', {
    name: String,
    description: String,
    image: String,
    genre: String,
    avgRating: Number,
    count: Number,
    ratings: Array,
    currentStarRating: Number,
    emptyStars: Number,
});


/* GET home page. */
router.get('/', function (req, res) {
    res.render('index');
});

router.get('/mainpage', function (req, res) {
    res.render('mainpage');
})

router.get('/shows', function (req, res) {
    Show.find(function (error, shows) {
        res.json(shows);
    });
});

router.get('/editpage', function (req, res) {
    res.render('editpage')
})

router.delete('/shows', function (req, res) {
    var id = req.param('id');
    Show.findByIdAndRemove(id).then(function () {
        res.json({
            isDeleted: true,
            message: "Show Deleted!"
        });
    }).catch(function (error) {
        res.json({
            isDeleted: false,
            message: error.message
        });
    })
})

router.post('/shows', function (req, res) {
    var newShow = new Show(req.param('show'));
    newShow.save().then(function () {
        res.json({
            isAdded: true,
            message: "Show Saved!"
        });
    }).catch(function (error) {
        res.json({
            isAdded: false,
            message: error.message
        });
    });
});

router.put('/shows', function (req, res) {
    var editedShow = req.param('show');
    Show.findByIdAndUpdate(editedShow._id, editedShow).then(function () {
        res.json({
            isEdited: true,
            message: "Show Updated!"
        });
    }).catch(function (error) {
        res.json({
            isEdited: false,
            message: error.message
        });
    });

});


router.get('/showSearch', function (req, res) {
    var searchParam = titleCase(req.param('name'));
    Show.find({'name': searchParam}, 'name genre description image', function (err, shows) {
        if (err) console.log(err);
        //console.log(shows);
        res.json(shows);
    });
});

//the series in the database are stored as a string with each word starting with an upper-case letter, therefore when a user searches for a series name
// we have to call this function to capitalize first letters, so it would match how the name is stored in the database
function titleCase(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {

        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
}

router.get('/genreSearch', function (req, res) {
    var genre = req.param('genre');
    var resultShows = [];

    //finding substring genres
    Show.find(function (error, shows) {

        for (var i = 0; i < shows.length; i++) {
            if (shows[i].genre.includes(genre))
                resultShows.push(shows[i]);
        }
        res.json(resultShows);
    });
})


module.exports = router;