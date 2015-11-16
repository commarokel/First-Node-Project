var Sequelize = require('sequelize');
var sequelize = new Sequelize('wine', 'superadmin', '311086', {
  host: '127.0.0.1',
  dialect: 'postgres',
  port: '5433',
  pool: {
      max:5,
      min:0,
      idle:10000
  },
});
// Load the Question model
var Question = sequelize.import('./../models/Question');
Question.sync();
// Load the Answer model
var Answer = sequelize.import('./../models/Answer');
Answer.belongsTo(Question);
Answer.sync();
// Load the Comment model
var Comment = sequelize.import('./../models/Comment');
Comment.belongsTo(Answer);
Comment.sync();

module.exports.getQuestion = function(req, res, next) {
	var initial_pageSize = 10;
	// Function to create pretty looking slug
	function convertToSlug(Text) {
    	return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/_/g, '')
        .replace(/ +/g,'-')
        ;
 	}
	Question.findAndCountAll({
		order: [['createdAt', 'DESC']],
		limit: initial_pageSize || req.query.pageSize,
		offset: (req.query.page - 1) * req.query.pageSize
	})
		.then(function(questions) {	
			var question_array = [];
			var page_array = [];
			var totalPageArray = [];
			for(var i = 0; i < questions.rows.length; i++) {
				question_array.push(
					{
					title: questions.rows[i].title,
					content: questions.rows[i].content,
					tag: 'Categorized under: ' + questions.rows[i].tag,
					id: questions.rows[i].id,
					slug: convertToSlug(questions.rows[i].title),
					pageNumber: req.query.page || initial_pageSize,
					author: questions.rows[i].author
					}
				);
			}
			for(i = 0; i <= questions.count; i++) {
				page_array.push(i);
			}
			var totalPageNumber = Math.ceil(questions.count/initial_pageSize);
			for(i = 1; i < totalPageNumber+1; i++) {
				totalPageArray.push(i);
			}
			res.render('questionlist', {
										mainObj: question_array, 
										totalPages: totalPageArray,
										pageSize: initial_pageSize
										});
		})
		.catch(function(e) {
			console.log(e);
		});
};

module.exports.getQuestionSubmission = function(req, res, next) {
	res.render('question');
};

module.exports.postQuestion = function(req, res, next) {
	req.assert('title', 'Please input a title').notEmpty();
	req.assert('content', 'Please type your question').notEmpty();
	req.assert('tag', 'Please enter your tag').notEmpty();
	var submitErrors = req.validationErrors();
	// Function to create pretty looking slug
	function convertToSlug(Text) {
    	return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
 	}
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
					var question = Question.build({title: req.body.title, content: req.body.content, tag: req.body.tag, author: req.session.username, slug: convertToSlug(req.body.title), votes: 0});
					question.save();
					req.flash('postSuccess', 'Your question was successfully created!');
					res.redirect('/questions-list');
				}
			})
			.catch(function(e) {
				console.log(e + ' saving error');
			});
	}
};

module.exports.getDetailedView = function(req, res) {
	var id = req.params.id;
	//var slug = req.params.slug;	
	var answer_id = req.body.answerID;
	var question = {};
	var answers_array = [];
	var comments_array = [];
	var isLoggedIn = req.session.username;
	// Function to create pretty looking slug
	function convertToSlug(Text) {
    	return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
 	};

	Question.findOne({
		where: {
			id: id
		}
	})
	.then(function(question) {
		question = {
			'title': question.title,
			'content': question.content,
			'tag': question.tag,
			'id': question.id,
			'slug': convertToSlug(question.title),
			'votes': question.votes
		};
		Answer.findAll({
			where: {
				questionId: id
			},
			order: [['createdAt', 'ASC']],
		})
		.then(function(answers) {
			for(var i = 0; i < answers.length; i++) {
				answers_array.push({
					content: answers[i].content,
					id: answers[i].id,
					author: answers[i].author,
					votes: answers[i].votes
				});
			}
			question.answers_array = answers_array;
			question.count = answers.length;
			Comment.findAll()
				.then(function(comments) {
					for(var i = 0; i < comments.length; i++) {
						comments_array.push({
							content: comments[i].content,
							id: comments[i].answerId,
							author: comments[i].author
						});
					}
					question.comments_array = comments_array;
					question.isLoggedIn = isLoggedIn;
					res.render('question-detailed', question);
				})
				.catch(function(e) {
					console.log(e);
				});
		})
		.catch(function(e) {
			console.log(e);
		});
	})
	.catch(function(e) {
		console.log(e);
	});

};

module.exports.postAnswer = function(req, res) {
	req.assert('answer', 'Please input your answer').notEmpty();
	var answerErrors = req.validationErrors();
	var id = req.params.id;
	if(answerErrors) {
		var backURL=req.header('Referer');
		req.flash('errors', answerErrors);
		res.redirect('back');
		}
	else {
		var answerContent = req.body.answer;
		var questionID = req.body.questionID;
		console.log('The answer content is ' + answerContent);
		var data = {'answer': answerContent, 'questionID': questionID, 'author': req.session.username};
		var answer = Answer.build({content: answerContent, author: req.session.username, questionId: questionID, votes: 0});
		var backURL=req.header('Referer');
		answer.save()
			.then(function() {
				res.send(data)
			});
	}
};

module.exports.postComment = function(req, res) {
	var answerID = req.body.answerID;
	var content = req.body.comment;
	console.log('This comment belongs to number: ' + answerID);
	var data = {'answerID': answerID, 'comment': content, 'author': req.session.username};
	var backURL=req.header('Referer');	
	var comment = Comment.build({content: content, author: req.session.username, answerId: answerID});
	comment.save()
		.then(function() {
			res.send(data);
		});
};

module.exports.questionPostVote = function(req, res) {
	var id = req.body.questionID;
	var count = req.body.count;
	Question.update(
	{
		votes: count,
	},
	{
	where: {id: id}
	})
	res.send(count);
};

module.exports.answerPostVote = function(req, res) {
	var id = req.body.answerID;
	var count = req.body.count;
	console.log(id);
	console.log('my count iss.........' + count);
	Answer.update( 
	{
		votes: count,
	},
	{
	where: {id: id}
	})
	var data = {'answerID': id, 'count': count};
	res.send(data);
};