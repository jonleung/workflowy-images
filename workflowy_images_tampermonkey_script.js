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

function parseAndGenerateImagesForContentNode(node) {
  var $node = $(node);
  $node.nextAll(".content-img").remove();

  var text = $node.text();

  var markdownImageRegex = /\!\[.*\]\((.+)\)/;
  var matcher = text.match(markdownImageRegex);
  if (matcher !== null) {
    var imgSrc = matcher[1];
    $node.after('<div class="content-img"><img style="max-width: 100%;" src="' + imgSrc + '"/></div>')
  }
}

function parseAndGenerateImagesForLinkNode(node) {
  var $node = $(node);
  $node.nextAll(".content-img").remove();

  var url = $node.text();
  var curExtension = url.substr(-4);
  if (_.contains(IMAGE_EXTENSIONS, curExtension) && $node.parent().text()[0] !== "!") {
      $node.after('<div class="content-img"><img style="max-width: 100%;" src="' + url + '"/></div>')
  }
}

function generateImages() {
    $("div.name a.contentLink").each(function(i, node) {
        parseAndGenerateImagesForLinkNode(node);
    })
    $("div.name div.content, div.notes div.content").each(function(i, node) {
      parseAndGenerateImagesForContentNode(node);
    });
};

window.onhashchange = generateImages;
$(document).keydown(function(e) {
    setTimeout(function() {
        generateImages();
    }, 250);
});
