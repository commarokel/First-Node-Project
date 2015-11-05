$(document).ready(function() {
	$('.commentButton').click(function(e) {	
		e.preventDefault();
		var comment = $('#comment').val();
		var answerID = $('#answerID').val();
	    var data = {comment: comment, answerID: answerID};
		$.ajax({
			type: 'POST',
			data: data,
			url: 'http://localhost:3000/comment',
			success: function(data) {
				$('.commentArray').last().append("<p class='commentContent' style='padding-left:2em; border-style:solid;border-width:1px;border-color:#d3d3d3;'>" 
					+ data.comment + "</p>" + "<p class='commentAuthor'>" + data.author + "</p>");
				$('#comment').val('');
			},
			error: function(e) {
				console.log(e);
			}
		});
  });
});