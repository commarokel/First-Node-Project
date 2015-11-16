$(document).ready(function() {
    var count = $('#qVotes').html();
    var count = parseInt(count);
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

	getAnsVote();

	function getAnsVote() {
		$('.ansVoteUp').click(function(e) {	
			e.preventDefault();
			var answerID = $(this).next().next().val();
			ansCount = $(this).prev().html();
			ansCount = parseInt(ansCount);
		    ansCount  += 1;
			console.log('the count now is ' + ansCount );
		    var data = {count: ansCount , answerID: answerID};
			$.ajax({
				type: 'POST',
				data: data,
				url: 'http://localhost:3000/answerVote',
				success: function(data) {
					$('.ansVotes' + data.answerID).text(data.count);
				},
				error: function(e) {
					console.log(e);
				}
			});
	  	});
		$('.ansVoteDown').click(function(e) {	
			e.preventDefault();
			var answerID = $(this).next().val();
			ansCount = $(this).prev().prev().html();
			ansCount = parseInt(ansCount);
		    ansCount  -= 1;
			console.log('the count now is ' + ansCount );
		    var data = {count: ansCount , answerID: answerID};
			$.ajax({
				type: 'POST',
				data: data,
				url: 'http://localhost:3000/answerVote',
				success: function(data) {
					$('.ansVotes' + data.answerID).text(data.count);
				},
				error: function(e) {
					console.log(e);
				}
			});
	  	});
	};

});