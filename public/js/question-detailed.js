$(document).ready(function() {
    var count = 0; 	
    var count = $('#qVotes').html();
    var count = parseInt(count);
    console.log(count);
	$('#qVoteUp').click(function(e) {	
		e.preventDefault();
		var questionID = $('#questionID1').val();
	    count += 1;
	    var data = {count: count, questionID: questionID};
		$.ajax({
			type: 'POST',
			data: data,
			url: 'http://localhost:3000/questionVote',
			success: function(count) {
				$('#qVotes').html(count);
			},
			error: function(e) {
				console.log(e);
			}
		});
  });
	$('#qVoteDown').click(function(e) {
		e.preventDefault();
		var questionID = $('#questionID1').val();
		count -= 1;
	    var data = {count: count, questionID: questionID};
		$.ajax({
			type: 'POST',
			data: data,
			url: 'http://localhost:3000/questionVote',
			success: function(result) {
				$('#qVotes').html(count);
			},
			error: function(e) {
				console.log(e);
			}
		});
	});

});