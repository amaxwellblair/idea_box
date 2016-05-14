$(document).ready(function() {
  getIdeas(updateIdea);
  $(".modal-trigger").leanModal();
  $("#create-trigger").click(function() {
    createIdea();
  });
});

function getIdeas(callback) {
  $.get("/api/v1/ideas.json", function(data) {
    if (data.length === 0) {
      return;
    }
    for (i = 0; i < data.length; i++) {
      appendIdea(data[i]);
    }
    callback();
  });
}

function createIdea() {
  var title = $("#create-title").val();
  var body = $("#create-body").val();
  $.post("/api/v1/ideas.json", { title: title, body: body }, function(data) {
    appendIdea(data);
    $("#create-title").val("");
    $("#create-body").val("");
  });
}

function updateIdea() {
  $(".update-trigger").click(function() {
    this.contentEditable = true;
    this.onkeypress = function (key) {
      if (key.keyCode === 13) {
        this.contentEditable = false;
        var id = extractID(this.href);
        var title = this.querySelector("#title-" + id);
        var body = this.querySelector("#body-" + id);
        patchIdea(id, title.innerHTML, body.innerHTML);
      }
    };
  });
}

function destroyIdea() {
  document.querySelector(".delete-trigger").onclick = function () {
    var id = extractID(this.id);

  };
}

function patchIdea(id, title, body) {
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/api/v1/idea/" + id + ".json",
    headers: { "X-HTTP-Method-Override": "PATCH" },
    data: { title: title, body: body },
    success: function() {
      overwriteIdea(id, title, body);
    }
  });
}

function overwriteIdea(id, title, body) {
  $("#title-" + id).html(title);
  $("#body-" + id).html(body);
}

function extractID(that) {
  return that.split("-")[1];
}

function appendIdea(idea) {
  var content = "<div id=title-" + idea.id + ">" + idea.title + "</div>";
  content = content + "<div id=body-" + idea.id + ">" + idea.body + "</div>";
  $("#all-ideas").append(ideaDiv(idea, content));
}

function ideaDiv(idea, content) {
  var card = document.createElement("div");
  card.className = "card";

  var link = document.createElement("a");
  link.className = "update-trigger";
  link.href = "#idea-" + idea.id;

  var innerIdea = document.createElement("div");
  innerIdea.id = "idea-" + idea.id;
  innerIdea.innerHTML = content;

  link.appendChild(innerIdea);
  card.appendChild(link);
  return card;
}
