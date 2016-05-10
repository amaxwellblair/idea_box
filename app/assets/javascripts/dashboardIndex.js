$(document).ready(function() {
  getIdeas();
  $(".modal-trigger").leanModal();
  $("#create-trigger").click(function() {
    createIdea();
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

function createIdea() {
  var title = $("#create-title").val();
  var body = $("#create-body").val();
  $.post("/api/v1/ideas.json", {title: title, body: body}, function(data) {
    appendIdea(data);
    $("#create-title").val("");
    $("#create-body").val("");
  });
}

function appendIdea(idea) {
  $("#all-ideas").append("<div>" + idea.title + "</div>");
}
