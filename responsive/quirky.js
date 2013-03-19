jQuery(function($) {
	function qtFixed() {
		if ($(window).width() >= 320) {
			$("body").addClass("fixed");
			$("#page").css("padding-top", $("#header").outerHeight() + "px");
			if ($(window).width() >= 768) {
				$("body").addClass("fixed-large");
				$("#page").css("padding-bottom",
						$("#footer").outerHeight() + "px");
				var qtDashMargin = ($(window).height() / 2) - 250;
				if (qtDashMargin < 0) {
					qtDashMargin = 0
				}
				$("#dashboard").css("margin-top", qtDashMargin + "px")
			} else {
				$("body").removeClass("fixed-large");
				if ($("#insert-home-link").size() == 0) {
					$("#utility")
							.prepend(
									'<li id="insert-home-link"><a href="/">Home</a></li>')
				}
				$("#page").css("padding-bottom", "0");
				$("#dashboard").css("margin-top", "0")
			}
		} else {
			$("body").removeClass("fixed").removeClass("fixed-large");
			$("#page").css("padding-top", "0").css("padding-bottom", "0");
			$("#dashboard").css("margin-top", "0")
		}
	}
	function qtLightbox(settings) {
		qtCloseLightboxes();
		$("body").append('<div id="shadow" /><div id="lightbox" />');
		$("#lightbox").append('<a class="close" href="#close">Close</a>');
		if (settings.html != null) {
			$("#lightbox").append(settings.html)
		}
		if (settings.ajax != null) {
			$
					.ajax( {
						type : "GET",
						url : settings.ajax,
						beforeSend : function() {
							$("#lightbox")
									.append(
											'<div class="loading">Loading&hellip;</div>')
						},
						success : function(data) {
							$("#lightbox").find(".loading").remove();
							$("#lightbox").append(data);
							$("#lightbox .close-lightbox-link").click(
									function(e) {
										e.preventDefault();
										qtCloseLightboxes()
									});
							qtLightboxUrls();
							qtResizeLightbox()
						},
						error : function() {
							$("#lightbox").find(".loading").remove();
							$("#lightbox")
									.append(
											"<p>Oops! There was a problem retrieving content. Try that again in a few moments.</p>");
							qtResizeLightbox()
						}
					})
		}
		if (settings.form != null && settings.form == true) {
			$("#lightbox")
					.append(
							'<fieldset class="form-actions"><a class="button save-dialog" href="#save">Save &rsaquo;</a> <a class="cancel close-lightbox-link" href="#cancel">Cancel</a></fieldset>');
			$("#lightbox").find("a.save-dialog").click(function(e) {
				e.preventDefault();
				if (settings.onsave != null) {
					settings.onsave()
				}
				if (settings.onclose != null) {
					settings.onclose()
				}
				qtCloseLightboxes()
			});
			if (settings.form != null && settings.form == true
					&& settings.buttons != null) {
				for ( var i = 0; i < settings.buttons.length; i++) {
					var theButton = $('<a class="button" href="#">'
							+ settings.buttons[i].label + "</a>");
					if (settings.buttons[i].href != null) {
						$(theButton).attr("href", settings.buttons[i].href)
					}
					if (settings.buttons[i].type != null) {
						$(theButton).addClass(settings.buttons[i].type)
					}
					if (settings.buttons[i].callback != null) {
						var buttonCallback = settings.buttons[i].callback;
						$(theButton).click(function(e) {
							e.preventDefault();
							buttonCallback()
						})
					}
					$("#lightbox fieldset.form-actions").append(theButton)
				}
			}
		}
		$("#lightbox .close,#lightbox .close-lightbox-link,#shadow").click(
				function(e) {
					e.preventDefault();
					if (settings.onclose != null) {
						settings.onclose()
					}
					qtCloseLightboxes()
				});
		qtShortcut("esc", function() {
			if (settings.onclose != null) {
				settings.onclose()
			}
			qtCloseLightboxes()
		}, false);
		qtShortcut("enter", function() {
			$("#lightbox .button.save-dialog").click()
		}, false);
		if (settings.onopen != null) {
			settings.onopen()
		}
		qtLightboxUrls();
		$("#lightbox").click(function() {
			$("#item-url-drop-menu").remove()
		});
		qtResizeLightbox()
	}
	function qtCloseLightboxes() {
		$("#shadow,#lightbox").remove();
		qtUnShortcut("esc,enter")
	}
	function qtResizeLightbox() {
		if ($("#lightbox").outerHeight() < $(window).height() - 50) {
			$("#lightbox").css(
					"top",
					((($(window).height() - $("#lightbox").outerHeight()) / 2)
							+ $(window).scrollTop() - 50)
							+ "px")
		} else {
			$("#lightbox").css("top", ($(window).scrollTop() + 50) + "px")
		}
	}
	function qtLightboxUrls() {
		$("#lightbox input[data]")
				.each(
						function() {
							$(this).focus(function() {
								$("#item-url-drop-menu").remove()
							});
							var theInput = $(this);
							var dataUrl = $(this).attr("data");
							$(this).removeAttr("data");
							$(this)
									.wrap(
											'<span class="url-combo" style="width: ' + $(
													theInput).outerWidth() + 'px;" />');
							var theArrow = $('<a class="item-url-arrow" href="#pick-url" style="height: '
									+ ($(theInput).outerHeight() - 1)
									+ "px; margin-top: -"
									+ (parseInt($(theInput).css("padding-top")) * 1.4)
									+ 'px;">&hellip;</a>');
							$(theArrow)
									.click(
											function(e) {
												e.preventDefault();
												if ($("#item-url-drop-menu")
														.size() == 0) {
													var dropLink = $(this);
													$
															.ajax( {
																type : "GET",
																url : dataUrl,
																success : function(
																		data) {
																	$(dropLink)
																			.before(
																					'<ul id="item-url-drop-menu" style="margin-top: ' + (parseInt($(
																							theInput)
																							.css(
																									"padding-top")) * 1.25) + 'px;" />');
																	$
																			.each(
																					data.pages,
																					function(
																							i,
																							page) {
																						var pageRow = $('<li><a href="'
																								+ page.url
																								+ '">'
																								+ page.title
																								+ "</a></li>");
																						$(
																								pageRow)
																								.find(
																										"a")
																								.click(
																										function(
																												e) {
																											e
																													.preventDefault();
																											$(
																													theInput)
																													.val(
																															$(
																																	this)
																																	.attr(
																																			"href"));
																											$(
																													"#item-url-drop-menu")
																													.remove()
																										});
																						$(
																								"#item-url-drop-menu")
																								.append(
																										pageRow)
																					})
																},
																error : function() {
																	alert("Error getting URL list! Try that again in a few moments.")
																}
															})
												} else {
													$("#item-url-drop-menu")
															.remove()
												}
											});
							$(this).after(theArrow)
						})
	}
	function qtConfirm(confirmText, confirmAction) {
		if (confirm(confirmText)) {
			if (confirmAction != null) {
				confirmAction()
			}
		}
	}
	(function($) {
		$.fn.disableSelection = function() {
			return this.each(function() {
				$(this).attr("unselectable", "on").css( {
					"-moz-user-select" : "none",
					"-webkit-user-select" : "none",
					"user-select" : "none"
				}).each(function() {
					this.onselectstart = function() {
						return false
					}
				})
			})
		}
	})(jQuery);
	(function($) {
		$.fn.enableSelection = function() {
			return this.each(function() {
				$(this).removeAttr("unselectable").css( {
					"-moz-user-select" : "inherit",
					"-webkit-user-select" : "inherit",
					"user-select" : "inherit"
				}).each(function() {
					this.onselectstart = function() {
					}
				})
			})
		}
	})(jQuery);
	function qtShortcut(keys, keyAction, disabled) {
		var disableInInput = true;
		if (disabled != null && disabled == false) {
			disableInInput = false
		}
		keys = keys.split(",");
		for ( var i = 0; i < keys.length; i++) {
			shortcut.add(keys[i], function(e) {
				e.preventDefault();
				keyAction()
			}, {
				disable_in_input : disableInInput
			})
		}
	}
	function qtUnShortcut(keys) {
		keys = keys.split(",");
		for ( var i = 0; i < keys.length; i++) {
			shortcut.remove(keys[i])
		}
	}
	function htmlEncode(value) {
		return $("<div />").text(value).html()
	}
	function htmlDecode(value) {
		return $("<div/>").html(value).text()
	}
	function createCookie(name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString()
		} else {
			var expires = ""
		}
		document.cookie = name + "=" + value + expires + "; path=/"
	}
	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(";");
		for ( var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == " ") {
				c = c.substring(1, c.length)
			}
			if (c.indexOf(nameEQ) == 0) {
				return c.substring(nameEQ.length, c.length)
			}
		}
		return null
	}
	function eraseCookie(name) {
		createCookie(name, "", -1)
	}
	;

	$("noscript").hide();
	$(window).resize(function() {
		qtFixed()
	});
	qtFixed()
});