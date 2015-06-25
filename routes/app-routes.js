var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var appRouter = express.Router();
var Survey = require('../lib/surveys.js');
//////////////////////////////////////////

// SURVEY ROUTES

appRouter.get('/', function(req, res) {
  Survey.find({}, function(err, surveyList) {
    if (err) {
      console.log(err);
      res.sendStatus(404);
    }
    res.render('dashboard', {
      surveys: surveyList
    });
  });
});

appRouter.get('/:id', function(req, res) {
  Survey.find({
    _id: req.params.id
  }, function(err, survey) {
    if (err) {
      console.log(err);
      res.sendStatus(404);
    }
    res.json(survey);
  });
});



appRouter.post('/', jsonParser);
appRouter.post('/', function(req, res) {
  Survey.create(req.body, function(error, survey) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(201);
    }
  });
});

appRouter.put('/:id', jsonParser);
appRouter.put('/:id', function(req, res) {
  Survey.findByIdAndUpdate(req.params.id, req.body, function(error, survey) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(200);
    }
  });
});

appRouter.delete('/:id', function(req, res) {
  Survey.remove({
    _id: req.params.id
  }, function(error) {
    if (error) {
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// QUESTION ROUTES

appRouter.get('/:id/questions/:question_id', function(req, res) {
  Survey.find({
    _id: req.params.id
  }, {
    questions: {
      $elemMatch: {
        _id: req.params.question_id
      }
    }
  }, function(err, question) {
    if (err) {
      console.log(err);
      res.sendStatus(404);
    }
    res.json(question);
  });
});

appRouter.post('/:id/questions/', jsonParser);
appRouter.post('/:id/questions/', function(req, res) {
  Survey.update({
    _id: req.params.id,
  }, {
    $push: {
      questions: req.body
    }
  }, function(err, question) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    }
    console.log(question);
    res.sendStatus(201);
  });
});

appRouter.put('/:id/questions/:question_id', jsonParser);
appRouter.put('/:id/questions/:question_id', function(req, res) {
  Survey.update({
    _id: req.params.id,
    'questions._id': req.params.question_id
  }, {
    $set: {
      'questions.$': req.body
    }
  }, function(err, question) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    }
    console.log('updated question');
    res.sendStatus(200);
  });
});


appRouter.delete('/:id/questions/:question_id', function(req, res) {
  Survey.update({
    _id: req.params.id,
  }, {
    $pull: {
      questions: {
        _id: req.params.question_id
      }
    }
  }, function(err, question) {
    if (err) {
      console.log(err);
      res.sendStatus(400);
    }
    console.log('question deleted');
    res.sendStatus(204);
  });
});





//////////////////////////////////////////
module.exports = appRouter;
