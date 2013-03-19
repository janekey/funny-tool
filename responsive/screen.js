jQuery(function($) {
	
	function qtScreenflyFixed() {
		$("#sizenav").css(
				"padding-left",
				(($(window).width() / 2) - (($("#sizenav > li").size() * 75) / 2))
						+ "px");
		var qtFormMargin = ($(window).height() / 2) - 200;
		if (qtFormMargin < 0) {
			qtFormMargin = 0
		}
		$("#screenfly-form").css("margin-top", qtFormMargin + "px")
	}
	function screenRulers() {
		$("#ruler").text($(window).width() + " x " + $(window).height())
	};
	
	$("#help").hide();
	var helpLink = $('<a id="help-pop" href="#help">?</a>');
	$(helpLink).click(function(e) {
		e.preventDefault();
		qtLightbox( {
			html : $("#help").html()
		})
	});
	$("#ruler").after(helpLink);
	$("#siteurl").keyup(function(e) {
		if (e.keyCode == 13 && $(this).val() != "") {
			$("#go").click()
		}
	});
	
	$("#go").click(function(e) {
		e.preventDefault();
		if ($("#siteurl").val() != "") {
//			createCookie("screenfly-auth", "1");
			$("#viewport").remove();
			$("#screenfly-form,#footer").hide();
			var siteUrl = $("#siteurl").val();
			if (siteUrl.substring(0, 7) != "http://"
					&& siteUrl.substring(0, 8) != "https://") {
				siteUrl = "http://" + siteUrl
			}
			if (siteUrl.substring(0, 31) == "http://quirktools.com/screenfly"
					|| siteUrl.substring(0, 35) == "http://www.quirktools.com/screenfly") {
				siteUrl = "http://quirktools.com/screenfly/paradox/"
			}
			var frame = $('<iframe id="frame" />');
			if (siteUrl.substring(0, 8) == "https://"
					&& $("#mimic-check").attr(
							"checked") == "checked") {
				$(".info-pop").remove();
				$("#page")
						.prepend(
								'<div class="info-pop" style="display: none;">Sorry! The proxy cannot be used with HTTPS. Switching to no-proxy mode&hellip;</div>');
				$(".info-pop").click(function() {
					$(this).slideUp(500,
							function() {
								$(this).remove();
							});
				});
				$(".info-pop").slideDown(500);
			}

			$(frame).attr("src", siteUrl)
					.width(1024)
					.height(600);
						
			$(frame).load(function() {
				$(this).css("background-image","none");
			});
			$("#page")
					.append(
							'<div id="viewport"><div id="viewport-header"><span id="viewport-url">' + siteUrl + '</span></div><div id="viewport-body" /><div id="viewport-footer"><a id="rotate" href="#rotate" title="Rotate Display">旋转显示</a><div style="clear: both;"></div></div></div>');
			$("#viewport").width(1024);
			$("#viewport-body").height(600);
			
			$("#rotate")
					.click(
							function(e) {
								e
										.preventDefault();
								var oWidth = $(
										"#frame")
										.css(
												"width");
								var oHeight = $(
										"#frame")
										.css(
												"height");
								$("#frame")
										.css(
												"width",
												oHeight)
										.css(
												"height",
												oWidth);
								$("#viewport")
										.css(
												"width",
												oHeight);
								$(
										"#viewport-body")
										.css(
												"height",
												oWidth)
							});
			$("#viewport-body").append(frame);
			console.log(frame);
			var closeFrame = $('<a id="close-frame" href="#close">Close</a>');
			$(closeFrame)
					.click(
							function(e) {
								e
										.preventDefault();
								$("#viewport")
										.remove();
								$("#sizenav")
										.hide();
								$(
										"#screenfly-form,#ruler,#user,#footer")
										.show()
							});
			$("#viewport-header").append(closeFrame);
			$("#sizenav li").removeClass("selected");
			$("#sizenav li:first,#sizenav li:first ul li:first").addClass("selected");
			$("#sizenav").show();
		}
	});
	
					screenRulers();
					$(window).resize(function() {
						screenRulers()
					});
					$(document).click(function(e) {
						var target = $(e.target);
						if (!target
								.is("#sizenav a,#sizenav span.icon,#sizenav span.label")) {
							$("#sizenav li ul").hide()
						}
						if (!target.is("#help-pop")
								&& target.closest("#help")
										.size() == 0) {
							$("#help").hide()
						}
					});
					$("#sizenav > li > a").click(function(e) {
						e.preventDefault();
						if ($(this).siblings("ul:hidden").size() > 0) {
							$("#sizenav li ul").hide();
							$(this).siblings("ul:hidden").show()
						} else {
							if ($(this).siblings("ul:visible").size() > 0) {
								$("#sizenav li ul").hide()
							}
						}
					});
					$("#sizenav > li ul a")
							.click(
									function(e) {
										e.preventDefault();
										var sizes = $(this).attr("href")
												.replace("#", "");
										var w = parseInt(sizes.split("x")[0]);
										var h = parseInt(sizes.split("x")[1]);
										var newUa = sizes.split("x")[2];
										if ($("#mimic-check").attr("checked") == "checked") {
											var currentUa = $(
													"#sizenav li.selected li.selected a")
													.attr("href").replace("#",
															"").split("x")[2];
											if (currentUa != newUa) {
												var theUrl = $("#frame").attr(
														"src");
												if (theUrl.indexOf("&ua=") != -1) {
													theUrl = theUrl
															.substr(
																	0,
																	theUrl
																			.indexOf("&ua="))
												}
												var theWidth = $("#frame").css(
														"width");
												var theHeight = $("#frame")
														.css("height");
												$("#frame").remove();
												
													$("#viewport-body")
															.append(
																	'<iframe id="frame" src="'
																			+ theUrl
																			+ "&ua="
																			+ newUa
																			+ '" style="width: '
																			+ theWidth
																			+ "; height: "
																			+ theHeight
																			+ ';" />')
												$("#frame")
														.load(
																function() {
																	$(this)
																			.css(
																					"background-image",
																					"none")
																})
											}
										}
										$("#frame").animate( {
											width : w,
											height : h
										}, 500);
										$("#viewport").animate( {
											width : w
										}, 500);
										$("#viewport-body").animate( {
											height : h
										}, 500);
										$("#sizenav li")
												.removeClass("selected");
										$(this).parent().addClass("selected");
										$(this).parent().parent().parent()
												.addClass("selected");
										$("#sizenav ul").hide()
									});
					qtScreenflyFixed()
					$(window).resize(function() {
						qtScreenflyFixed()
					});
				});

