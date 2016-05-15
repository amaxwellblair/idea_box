$(document).ready(function() {
  getIdeas(function() {
    updateIdea();
    destroyIdea();
    updateQuality();
  });
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
    updateIdea();
    destroyIdea();
    updateQuality();
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
        var quality = document.querySelector("#quality-" + id);
        patchIdea(id, quality.innerHTML, title.innerHTML, body.innerHTML);
      }
    };
  });
}

function updateQuality() {
  updatePositive();
  updateNegative();
}

function updateNegative() {
  var options = { 0: "bad", 1: "good", 2: "excellent" };
  var downvotes = document.querySelectorAll(".downvote-trigger");
  var downvote = function () {
    var id = extractID(this.id);
    var quality = options[nextQuality(id, -1)];
    document.querySelector("#quality-" + id).innerHTML = quality;
    patchIdea(id, quality);
  };
  for (var i = 0; i < downvotes.length; i++) {
    id = extractID(downvotes[i].id);
    downvotes[i].onclick = downvote;
  }
}

function updatePositive() {
  var options = { 0: "bad", 1: "good", 2: "excellent" };
  var upvotes = document.querySelectorAll(".upvote-trigger");
  var upvote = function () {
    var id = extractID(this.id);
    var quality = options[nextQuality(id, 1)];
    document.querySelector("#quality-" + id).innerHTML = quality;
    patchIdea(id, quality);
  };
  for (var i = 0; i < upvotes.length; i++) {
    id = extractID(upvotes[i].id);
    upvotes[i].onclick = upvote;
  }
}

function nextQuality(id, modifier) {
  var quality = document.querySelector("#quality-" + id);
  var options = { bad: 0, good: 1, excellent: 2 };
  var change = options[quality.innerHTML] + modifier;
  if (change < 0 || change > 2) {
    return options[quality.innerHTML];
  } else {
    return options[quality.innerHTML] + modifier;
  }
}

function destroyIdea() {
  document.querySelector(".delete-trigger").onclick = function () {
    var id = extractID(this.id);
    deleteIdea(id);
  };
}

function deleteIdea(id) {
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/api/v1/idea/" + id + ".json",
    headers: { "X-HTTP-Method-Override": "DELETE" },
    data: { id: id },
    success: function() {
      removeIdea(id);
      destroyIdea();
    }
  });
}

function patchIdea(id, quality, title, body) {
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/api/v1/idea/" + id + ".json",
    headers: { "X-HTTP-Method-Override": "PATCH" },
    data: { title: title, body: body, quality: quality },
    success: function() {
      overwriteIdea(id, title, body);
    }
  });
}

function removeIdea(id) {
  var card = document.querySelector("#card-" + id);
  card.parentNode.removeChild(card);
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
  card.id = "card-" + idea.id;

  var buttonHolder = document.createElement("div");
  buttonHolder.className = "card-action";

  var deleteButton = createDeleteButton(idea.id);
  var upvoteButton = createUpvoteButton(idea.id);
  var downvoteButton = createDownvoteButton(idea.id);
  var qualityBox = createQuality(idea.id, idea.quality);

  var link = document.createElement("a");
  link.className = "update-trigger";
  link.href = "#idea-" + idea.id;

  var innerIdea = document.createElement("div");
  innerIdea.id = "idea-" + idea.id;
  innerIdea.innerHTML = content;

  link.appendChild(innerIdea);
  buttonHolder.appendChild(qualityBox);
  buttonHolder.appendChild(upvoteButton);
  buttonHolder.appendChild(downvoteButton);
  buttonHolder.appendChild(deleteButton);
  card.appendChild(link);
  card.appendChild(buttonHolder);
  return card;
}

function createQuality(id, quality) {
  var qualityBox = document.createElement("p");
  qualityBox.id = "quality-" + id;
  qualityBox.innerHTML = quality;
  return qualityBox;
}

function createDeleteButton(id) {
  var deleteButton = document.createElement("button");
  deleteButton.id = "delete-" + id;
  deleteButton.className = "delete-trigger btn";
  deleteButton.innerHTML = "Delete";
  return deleteButton;
}

function createUpvoteButton(id) {
  var upvoteButton = document.createElement("button");
  upvoteButton.id = "upvote-" + id;
  upvoteButton.className = "upvote-trigger btn";
  upvoteButton.innerHTML = "Upvote";
  return upvoteButton;
}

function createDownvoteButton(id) {
  var downvoteButton = document.createElement("button");
  downvoteButton.id = "downvote-" + id;
  downvoteButton.className = "downvote-trigger btn";
  downvoteButton.innerHTML = "Downvote";
  return downvoteButton;
}
