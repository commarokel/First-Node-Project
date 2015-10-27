// Load the Question model
var Sequelize = require('sequelize');

var sequelize = new Sequelize('wine', 'superadmin', 'xxxx', {
  host: '127.0.0.1',
  dialect: 'postgres',
  port: '5433',
  pool: {
      max:5,
      min:0,
      idle:10000
  },
});

var Question = sequelize.import('./../models/Question');
Question.sync();

module.exports.getQuestion = function(req, res, next) {
	Question.findAll({
		order: [['createdAt', 'DESC']]
	})
		.then(function(questions) {	
			question_array = [];
			for(var i = 0; i < questions.length; i++) {
				question_array.push(
					{
					title: questions[i].title,
					content: questions[i].content,
					tag: questions[i].tag,
					id: questions[i].id,
					truncated_content: questions[i].content.slice(0,20)
					}
				);
			}
			console.log(question_array);
			res.render('questionlist', question_array);
		})
		.catch(function(e) {
			console.log(e);
		})
};

module.exports.getQuestionSubmission = function(req, res, next) {
	res.render('question');
};

module.exports.postQuestion = function(req, res, next) {
	req.assert('title', 'Please input a title').notEmpty();
	req.assert('content', 'Please type your question').notEmpty();
	req.assert('tag', 'Please enter your tag').notEmpty();

	var submitErrors = req.validationErrors();
	console.log('The Validation Errors are: ' + submitErrors);

	if(submitErrors) {
		req.flash('errors', submitErrors);
		res.redirect('/submit-question');
		}
	else {
		Question.count({
			where: {
				title: req.body.title
				}
			})
			.then(function(title) {
				if(title > 0) {
					req.flash('postExists', 'This title already exists!');
					res.redirect('/submit-question');
				}
				else if(title.title != req.body.title) {
					var question = Question.build({title: req.body.title, content: req.body.content, tag: req.body.tag});
					question.save();
					req.flash('postSuccess', 'Your question was successfully created!');
					res.redirect('/questions-list');
				}
			})
			.catch(function(e) {
				console.log(e + ' saving error');
			})
	}
};

module.exports.getDetailedView = function(req, res) {
	var id = req.params.id;

	Question.findOne({
		where: {
			id: id
		}
	})
	.then(function(question) {
		console.log(question.title);
		var question = {
			'title': question.title,
			'content': question.content,
			'tag': question.tag
		};
		res.render('question-detailed', question);
	})
	.catch(function(e) {
		console.log(e);
	})
}