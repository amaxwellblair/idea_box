$(document).ready(function() {
  getIdeas();
  $(".modal-trigger").leanModal();
  $("#create-trigger").click(function() {
    var title = $("#create-title").val();
    var body = $("#create-body").val();
    createIdea(title, body);
  });
});

function getIdeas() {
  $.get("/api/v1/ideas.json", function(data) {
    if (data.length === 0) {
      return;
    }
    for (i = 0; i < data.length; i++) {
      appendIdea(data[i]);
    }
  });
}

function createIdea(title, body) {
  console.log("hi there");
  $.post("/api/v1/ideas.json", {title: title, body: body}, function(data) {
    appendIdea(data);
  });
}

function appendIdea(idea) {
  $("#all-ideas").append("<div>" + idea.title + "</div>");
}
