// ==UserScript==
// @name         WorkflowyImages
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  eetry to take over the world!
// @author       You
// @match        https://workflowy.com/*
// @grant        none
// ==/UserScript==
'use strict';

var IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".bmp"];

function do_parseImg() {
    $(this).nextAll(".content-img").remove();
    var lines = $(this).text().split("\n");
    var img_re = /^\!\[.*\]\((.+)\)$/;

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        var extension = line.substr(-4);
        var img = line.match(img_re);
        if (img !== null) {
            $(this).after('<div class="content-img"><img style="max-width: 100%;" src="' + img[1] + '"/></div>')
        }
        else if (_.contains(IMAGE_EXTENSIONS, extension)) {
            $(this).after('<div class="content-img"><img style="max-width: 100%;" src="' + line + '"/></div>')
        }
    }
}

function generateImages() {
    $("div.notes div.content").live("click keyup", do_parseImg);
    $("div.notes div.content").each(do_parseImg);
    $("#expandButton").live("click", function() {
        $("div.notes div.content").each(do_parseImg);
    });

    $("div.name a.contentLink").live("click keyup", do_parseImg);
    $("div.name a.contentLink").each(do_parseImg);
    $("#expandButton").live("click", function() {
        $("div.name a.contentLink").each(do_parseImg);
    });

};

window.onhashchange = generateImages();
$(document).keydown(function(e) {
    if(e.ctrlKey || e.metaKey) {
        setTimeout(function() {
            generateImages();
        }, 200);
    }
});
