$(document).ready(function() {
  getIdeas();
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

function appendIdea(idea) {
  $("#all-ideas").append("<div>" + idea.title + "</div>");
}
