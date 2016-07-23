(function() {
  var IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".bmp"];

  function createImageNodeAfterNode($node, imgSrc) {

    var $div = $("<div>")
                  .addClass("content-img");
    var $img = $("<img>")
                  .attr("src", imgSrc)
                  .css({
                    "max-width": "100%",
                    "max-height": "350px"
                  });
    $div.append($img);

    $node.after($div);
  }

  function generateImagesForContentNode(node) {
    var $node = $(node);
    $node.nextAll(".content-img").remove();

    var text = $node.text();

    var markdownImageRegex = /\!\[.*\]\((.+)\)/;
    var matcher = text.match(markdownImageRegex);
    if (matcher !== null) {
      var imgSrc = matcher[1];
      createImageNodeAfterNode($node, imgSrc);
    }
  }

  function generateImagesForLinkNode(node) {
    var $node = $(node);
    $node.nextAll(".content-img").remove();

    var url = $node.text();
    var curExtension = url.substr(-4);
    if (_.contains(IMAGE_EXTENSIONS, curExtension) && $node.parent().text()[0] !== "!") {
      createImageNodeAfterNode($node.parent(), url);
    }
  }

  function checkForChanges() {
    $("div.name div.content, div.notes div.content").each(function(i, node) {
      generateImagesForContentNode(node);
    });

    $("div.name a.contentLink, div.notes a.contentLink").each(function(i, node) {
      generateImagesForLinkNode(node);
    });

    // TODO: These currently need to be in this order because otherwise when
    // there is a raw link  in the notes, it will be overwritten
  };

  // When the page finishes loading
  $(window).load(function () {
      checkForChanges();
  });

  // When you change nodes
  window.onhashchange = checkForChanges;

  // When you press any keyboard key
  $(document).keydown(function(e) {
    setTimeout(function() {
      checkForChanges();
    }, 250);
  });

})();
