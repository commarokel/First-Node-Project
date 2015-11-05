$(document).ready(function() {
	$('.commentButton').click(function(e) {	
		e.preventDefault();
		var comment;
		var answerID;
		comment = $(this).parent().parent().prev().children('.col-sm-12').children('.comment').val();
		answerID = $(this).parent().parent().prev().children('.col-sm-12').children('.comment').next().val();
		console.log('the answer ID is ' + answerID);
		console.log('the comment is ' + comment);
	    var data = {comment: comment, answerID: answerID};
		$.ajax({
			type: 'POST',
			data: data,
			url: 'http://localhost:3000/comment',
			success: function(data) {
				if($('.answerArray'+ data.answerID).children().length < 6) {
					$('.answerArray' + data.answerID).children('.ansVoteDown').after("<div class='commentArray'></div>");
					$('.answerArray' + data.answerID).children('.commentArray').html("<p class='commentContent' style='padding-left:2em; border-style:solid;border-width:1px;border-color:#d3d3d3;'>" 
						+ data.comment + "</p>" + "<p class='commentAuthor'>" + data.author + "</p>");
					$('.comment').val('');
				}
				else if($('.answerArray'+ data.answerID).children('.commentArray')) {
					console.log($('.answerArray'+ data.answerID).children().length);
					$('.answerArray' + data.answerID).children('.commentArray').last().append("<p class='commentContent' style='padding-left:2em; border-style:solid;border-width:1px;border-color:#d3d3d3;'>" 
						+ data.comment + "</p>" + "<p class='commentAuthor'>" + data.author + "</p>");
					$('.comment').val('');
				}

			},
			error: function(e) {
				console.log(e);
			}
		});
  });
});