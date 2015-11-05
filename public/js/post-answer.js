$(document).ready(function() {
	$('#answerButton').click(function(e) {	
		e.preventDefault();
		var answer = $('#answer').val();
		var questionID = $('#questionID1').val();
		console.log(answer);
		console.log(questionID);
	    var data = {answer: answer, questionID: questionID};
		$.ajax({
			type: 'POST',
			data: data,
			url: 'http://localhost:3000/answer',
			success: function(data) {
				$('#answer').val("");
				$('.answerArray').last().after("<div class='answerArray'>" + "<h4>" + data.answer + "</h4>" + "<p>" + data.author + "</p>" + "</div>" + 
					"<p class='ansVoteUp'>" + "Vote Up" + "</p>" + "<p class='ansVoteDown'>" + "Vote Down" + "</p>");
				console.log('the success message is ' + data.answer);
				window.setTimeout('location.reload()', 1);
			},
			error: function(e) {
				console.log('The error is ' + e);
			}
		});
  });
});