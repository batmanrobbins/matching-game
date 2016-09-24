function isIE(version, comparison) {
    var cc      = 'IE',
        b       = document.createElement('B'),
        docElem = document.documentElement,
        isIE;
        
    if(version){
        cc += ' ' + version;
        if(comparison){ cc = comparison + ' ' + cc; }
    }
    
    b.innerHTML = '<!--[if '+ cc +']><b id="iecctest"></b><![endif]-->';
    docElem.appendChild(b);
    isIE = !!document.getElementById('iecctest');
    docElem.removeChild(b);
    return isIE;
}
//Listen for IE8 and redirect to compatible page if detected
if (isIE(8, "lte")) {
    window.location.href = "unsupported.html";
}
var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
var isiPad = ua.indexOf("ipad") > -1; //&& ua.indexOf("mobile");
var VP = document.getElementsByTagName("meta");
var userAgent;

if(isAndroid || isiPad) {
	for (userAgent=0; userAgent<VP.length; userAgent++) {
      if (VP[userAgent].name == "viewport") {
        VP[userAgent].content = "width=320, initial-scale=1";
      }
    }
}
var buildGame_extern;
$.preloadImages = function() {
  for (var i = 0; i < arguments.length; i++) {
    $("<img />").attr("src", arguments[i]);
  }
}
function tileResize() {
	var objWidth = 0;
	 $.each($('.cardWrap'), function(){
            objWidth = $(this).outerWidth();
			$(this).height(objWidth);
     });
}
$(document).ready(function (e) {
	// Declaring variables
	var maxCards,displayNum,compCard,compCarduID,cardInfo,pleaseWait,matchID;
	var cardInfo = [];
	var imgString = "../images/cards/";
	var initGame = function()
	{
		displayNum = 0;
		compCard = "";
		compCarduID = "";
		cardInfo[1] = "<p>The first college game ever played was the 1902 Pasadena Bowl.</p>";
		cardInfo[2] = "<p>Did you know that today's professional football helmet offers far greater protection over the original leather helmets?</p>";
		cardInfo[3] = "<p>The foam finger was first invented by a man named Steve Chmelar back in 1971.</p>";
		cardInfo[4] = "<p>The majority of football players wear gloves during the game.</p>";
		cardInfo[5] = "<p>A false start is the penalty that occurs the most in football.</p>";
		cardInfo[6] = "<p>The kickoff is decided by a coin toss at the beginning of each game.</p>";
		pleaseWait = false;
	};
	function shuffle(array) {
		var currentIndex = array.length,
		temporaryValue, randomIndex;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}
	function buildGame() {
		maxCards = (cardInfo.length-1) * 2;
		matches = maxCards / 2;
		var useArray = [];
		for (i = 1; i <= matches; i++) {
			$.preloadImages(imgString + i + ".png");
			useArray.push(i);
			useArray.push(i);
		}
		shuffle(useArray);
		
		for (i = 1; i <= maxCards; i++) {
			matchID = useArray.splice(useArray.indexOf(useArray[i] ), 1);
			$(".GameArea").append("<div class='cardWrap'><div class='gameCard' id='c" + i + "'><img src='" + imgString + "cardback.png' class='img-responsive back'></div></div>");
			$(".gameCard#c"+i).append("<img src='" + imgString + matchID +".png' class='img-responsive front' data-match="+matchID+">");
		}
	}
	buildGame_extern = function()
	{
		// Init values
		initGame();

		// Empty game area first
		$(".GameArea").empty();

		// Build the game
		buildGame();

		// Attach event handlers
		$(".gameCard").off('click').on('click', function () {
			var uID = $(this).attr("id");
			if(pleaseWait||$("#" + uID).hasClass("flipped")){return 0;}
			pleaseWait = true;
			setTimeout(function () {
				$("#" + uID).addClass("flipped");
				if(compCard==""){
					compCard = $("#" + uID + " .front").data("match");
					compCarduID = uID;
					pleaseWait=false;
				} else {
					if(compCard == $("#" + uID + " .front").data("match")){
						$("#" + uID+",#"+compCarduID).addClass('matched');
						displayNum = displayNum+2;
						//Populate Match Modal
						$("#GameInfo .cardImg").prop('src',  imgString + compCard +'.png');
						$("#GameInfo .cardInfo").html(cardInfo[compCard]);
						setTimeout(function(){
							$('#GameInfo').modal();
						},1000);
						compCard = "";
						compCarduID = "";
						pleaseWait=false;
					} else {
							setTimeout(function(){
								//SWAP IMAGE TO CARD BACK
								$(".gameCard").not('.matched').each(function() {
                                    if ($(this).find('[data-match='+compCard+']')) {
										$(this).removeClass("flipped");
									}
                                });
								compCard = "";
								compCarduID = "";
								pleaseWait=false;
						},1500);
					}
				}
				//Check End Game
				if (displayNum == maxCards) {
					$('#GameInfo').on('hidden.bs.modal', function (e) {
						//RUN AFTER FINAL MATCH OVERLAY CLOSES
						$("#loseMsg").modal("show");
						$("#endGame").removeClass("hidden");
					})			
				}
			}, 250)
		});
	};
	buildGame_extern();
	tileResize();
});
$(window).on("resize", function() {
tileResize();
});